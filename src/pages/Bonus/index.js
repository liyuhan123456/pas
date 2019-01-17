import React, {Component} from 'react'
import {
    Breadcrumb,
    Button,
    message,
    Table,
} from 'antd';
import {log} from '../../utils/utils';
import {
    fetchBonusList,
    updateBonusStatus,
} from '../../service/index';

class Bonus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: 10,
            rowTotal: 0,
            list: [],
        };
        this.bonusColumns = [
            {
                title: '进货商',
                dataIndex: 'order_seller_name',
                align: 'center'
            },
            {
                title: '订单ID',
                dataIndex: 'order_id',
                align: 'center',
            },
            {
                title: '订单金额',
                dataIndex: 'order_amount',
                align: 'center',
            },
            {
                title: '推荐人',
                dataIndex: 'seller_name',
                align: 'center'
            },
            {
                title: '提成金额',
                dataIndex: 'amount',
                align: 'center'
            },
            {
                title: '订单日期',
                dataIndex: 'order_date',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                align: 'center',
                render: (text)=> {
                    let str = '';
                    if(text === 1) str =  '已提取';
                    if(text === 0) str =  '未提取';
                    return str
                }

            },
            {
                title: '操作',
                align: 'center',
                render: (text, record) => {
                    return (
                        <div style={{textAlign: 'center'}}>
                            { record.status === 1 && <Button onClick={()=>{this.handleUpdateBonusStatus(record.id,0)}} type={"default"}>设为未提取</Button> }
                            { record.status === 0 && <Button onClick={()=>{this.handleUpdateBonusStatus(record.id,1)}} type={"primary"}>设为提取</Button> }
                        </div>
                    )
                }
            }
        ];
    }

    componentDidMount() {
        this.handleFetchBonusList();
    }

    handleUpdateBonusStatus(id,status) {
        updateBonusStatus({id,status}).then(res => {
            if (res.error === 0) {
                message.success("修改成功", 1);
                this.handleFetchBonusList();
            } else {
                message.error("修改失败,请稍后再试或检查服务器状态!", 1);
            }
        }).catch(err => {
            log(err);
            message.error("修改失败,请稍后再试或检查服务器状态!", 1);
        })
    }

    handleFetchBonusList() {
        this.setState({
            isLoading: true
        }, () => {
            fetchBonusList({
                page_num: this.state.pageNum,
                page_size: this.state.pageSize
            }).then(res => {
                this.setState({
                    list: res.data.list,
                    rowTotal: res.data.totalRow
                });
            }).catch(err => {
                log(err);
                message.error("获取提成列表失败，请检查网络和服务器状态", 1.5)
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
                <Breadcrumb.Item>提成管理</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{marginTop: 20}}>
                <Table rowKey={'id'} style={{margin: 30}} loading={this.state.isLoading}
                       dataSource={this.state.list} columns={this.bonusColumns}
                       pagination={{
                           current: this.state.pageNum, onChange: (page) => {
                               this.setState({
                                   pageNum: page
                               }, () => {
                                   this.handleFetchBonusList();
                               })
                           }
                       }}/>
            </div>
        </div>
    }
}

export default Bonus;