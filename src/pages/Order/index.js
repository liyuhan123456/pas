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
    deleteOrder,
} from '../../service/index';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: 10,
            rowTotal: 0,
            list: [],
        };
        this.orderColumns = [
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
                       dataSource={this.state.list} columns={this.orderColumns}
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

export default Order;