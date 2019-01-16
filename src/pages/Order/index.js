import React, {Component} from 'react'
import {
    Breadcrumb,
    Input,
    Button,
    message,
    Form,
    Modal,
    Popconfirm,
    Table,
    Select,
    AutoComplete
} from 'antd';
import {log} from '../../utils/utils';
import {
    fetchOrderList,
    saveAgent,
    deleteOrder,
    fetchLevelList,
    queryAgent
} from '../../service/index';

const FormItem = Form.Item;
const Option = AutoComplete.Option;

class Agent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: 10,
            rowTotal: 0,
            list: [],
            // orderVisible: false,
            // orderForm: {
            //     series_no: '',
            //     level_id: '',
            //     name: '',
            //     phone: '',
            //     email: '',
            //     qq: '',
            //     weixin: '',
            //     referrer_id: '',
            //     description: '',
            //     referrer_name: ''
            // },
            // levelList: [],
            // levelId: '',
            // agentList: [],
            // lastSelectName: '',
            // lastSelectProduct: '',
            // agentInfoList: []
        };
        this.agentColumns = [
            {
                title: '代理商名称',
                dataIndex: 'seller_name',
                align: 'center'
            },
            {
                title: '商品种类数量',
                dataIndex: 'species',
                align: 'center',
            },
            {
                title: '商品件数',
                dataIndex: 'quantity',
                align: 'center'
            },
            {
                title: '总金额',
                dataIndex: 'amount',
                align: 'center',
                render: (text)=>{
                    return (
                        <span>{text}元</span>
                    )
                }
            },
            {
                title: '操作',
                align: 'center',
                render: (text, record) => {
                    return (
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                            <Button type={"primary"} onClick={() => {
                                this.props.history.push(`/index/order/detail/${record.id}`)
                            }}>订单详情</Button>
                            <Popconfirm title="确定要删除这个订单吗？" onConfirm={() => {
                                this.handleDeleteOrder(record.id)
                            }} okText="是" cancelText="否">
                                <Button type={"danger"}>删除</Button>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ];
    }

    componentDidMount() {
        this.handleFetchOrderList();
    }

    handleDeleteOrder(id) {
        deleteOrder({id}).then(res => {
            if (res.error === 0) {
                message.success("删除成功", 1);
                this.handleFetchOrderList();
            } else {
                message.error("删除失败,请稍后再试或检查服务器状态!", 1);
            }
        }).catch(err => {
            log(err);
            message.error("删除失败,请稍后再试或检查服务器状态!", 1);
        })
    }

    handleFetchOrderList() {
        this.setState({
            isLoading: true
        }, () => {
            fetchOrderList({
                page_num: this.state.pageNum,
                page_size: this.state.pageSize
            }).then(res => {
                log(res);
                this.setState({
                    list: res.data.list,
                    rowTotal: res.data.totalRow
                });
            }).catch(err => {
                log(err);
                message.error("获取订单列表失败，请检查网络和服务器状态", 1.5)
            }).finally(() => {
                this.setState({
                    isLoading: false
                });
            })
        });
    }

    // handleChangeAgent(record) {
    //     this.setState({
    //         orderVisible: true,
    //         lastSelectName: record.referrer_name,
    //         orderForm: {
    //             id: record.id,
    //             series_no: record.series_no,
    //             level_id: record.level_id,
    //             name: record.name,
    //             phone: record.phone,
    //             email: record.email,
    //             qq: record.qq,
    //             weixin: record.weixin,
    //             referrer_id: record.referrer_id,
    //             description: record.description,
    //             referrer_name: record.referrer_name,
    //         },
    //     })
    // }

    // handleSaveAgent() {
    //     saveAgent(this.state.orderForm).then(res=>{
    //         if(res.error === 0){
    //             message.success("保存成功");
    //             this.setState({
    //                 orderVisible: false,
    //                 orderForm:{
    //                     series_no: '',
    //                     level_id: '',
    //                     name: '',
    //                     phone: '',
    //                     email: '',
    //                     qq: '',
    //                     weixin: '',
    //                     referrer_id: '',
    //                     description: '',
    //                     referrer_name: '',
    //                 },
    //                 lastSelectName: '',
    //             });
    //             this.handleFetchOrderList();
    //         }else{
    //             message.error("保存失败，请检查网络或服务器状态");
    //         }
    //     }).catch(err=>{
    //         log(err);
    //     })
    // }

    // inputField(table, field, value) {
    //     let data = this.state[table];
    //     data[field] = value;
    //     this.setState({
    //         [table]: data
    //     })
    // }

    // searchAgent(value) {
    //     if (new Date().getTime() - this.flag < 300) {
    //         clearTimeout(this.timeoutFlag);
    //     }
    //     this.flag = new Date().getTime();
    //     this.timeoutFlag = setTimeout(() => {
    //         queryAgent({
    //             keyword: value
    //         }).then(res => {
    //             let dataList = [];
    //             res.data.map(item => {
    //                 dataList.push(<Option key={item.id} text={item.name}>{`${item.name}-${item.phone}`}</Option>);
    //             });
    //             this.setState({
    //                 agentList: dataList,
    //                 agentInfoList: res.data,
    //                 selectMode: true
    //             })
    //         }).catch(err => {
    //             log(err);
    //         })
    //     }, 300);
    // }
    //
    // selectAgent(value) {
    //     let name = this.state.agentInfoList.filter(item => {
    //         return item.id === +value
    //     })[0].name;
    //     setTimeout(() => {
    //         this.inputField('orderForm', 'referrer_name', name);
    //         this.inputField('orderForm', 'referrer_id', +value);
    //         this.setState({
    //             lastSelectName: name,
    //         });
    //     }, 0)
    // }
    render() {
        return <div className="block">
            <Breadcrumb>
                <Breadcrumb.Item>订单管理</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{marginTop: 20}}>
                <Button onClick={() => {
                    this.props.history.push('/index/order/detail/')
                }} style={{marginLeft: 30}} type={"primary"}>新增订单</Button>
                <Table rowKey={'id'} style={{margin: 30}} loading={this.state.isLoading}
                       dataSource={this.state.list} columns={this.agentColumns}
                       pagination={{
                           current: this.state.pageNum, onChange: (page) => {
                               this.setState({
                                   pageNum: page
                               }, () => {
                                   this.handleFetchOrderList();
                               })
                           }
                       }}/>
            </div>
        </div>
    }
}

export default Agent;