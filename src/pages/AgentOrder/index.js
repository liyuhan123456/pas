import React, {Component} from 'react'
import {
    AutoComplete,
    Breadcrumb,
    Button, Form, Input,
    message,
    Popconfirm,
    Table,
    Tabs,
    Select,
} from 'antd';
import {log} from '../../utils/utils';
import {
    fetchAgentOrder,
    deleteOrder, fetchAgentDetail, fetchLevelList, queryAgent, saveAgent, fetchAgentBonusList, updateBonusStatus,
} from '../../service/index';
const FormItem = Form.Item;
const Option = AutoComplete.Option;
class AgentOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: 10,
            rowTotal: 0,
            list: [],
            activeKey: 'detail',
            agentForm: {
                series_no: '',
                level_id: '',
                name: '',
                phone: '',
                email: '',
                qq: '',
                weixin: '',
                referrer_id: '',
                description: '',
                referrer_name: ''
            },
            levelList: [],
            agentList: [],
            bonusList: [],
            bonusPageNum: 1,
            bonusRowTotal: 0,
            bonusLoading: false,
        };
        this.agentOrderColumns = [
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
                                this.props.history.push(`/index/agent/detail/${record.id}`,{agentId: this.props.match.params.id})
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
        this.timeoutFlag = '';
        this.handleSaveAgent = this.handleSaveAgent.bind(this);
        this.searchAgent = this.searchAgent.bind(this);
        this.selectAgent = this.selectAgent.bind(this);
    }

    componentDidMount() {
        this.handleFetchOrderList();
        fetchAgentDetail({
            id: this.props.match.params.id
        }).then(res=>{
            this.setState({
                agentForm: res.data
            })
        }).catch(err=>{
            log(err);
            message.error("获取代理商信息失败,请检查网络和服务器状态");
        });

        this.setState({
            levelLoading: true
        }, () => {
            fetchLevelList(
                {
                    pageNum: 1,
                    pageSize: 1000
                }
            ).then(res => {
                this.setState({
                    levelList: res.data.list,
                })
            }).catch(err => {
                log(err);
            }).finally(() => {
                this.setState({
                    levelLoading: false
                });
            })
        });

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
            bonusLoading: true
        }, () => {
            fetchAgentBonusList({
                seller_id: this.props.match.params.id,
                page_num: this.state.bonusPageNum,
                page_size: this.state.pageSize
            }).then(res => {
                this.setState({
                    bonusList: res.data.list,
                    bonusRowTotal: res.data.totalRow
                });
            }).catch(err => {
                log(err);
                message.error("获取提成列表失败，请检查网络和服务器状态", 1.5)
            }).finally(() => {
                this.setState({
                    bonusLoading: false
                });
            })
        });
    }

    handleSaveAgent() {
        saveAgent(this.state.agentForm).then(res=>{
            if(res.error === 0){
                message.success("保存成功");
            }else{
                message.error("保存失败，请检查网络或服务器状态");
            }
        }).catch(err=>{
            log(err);
        })
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
            fetchAgentOrder({
                seller_id: this.props.match.params.id,
                page_num: this.state.pageNum,
                page_size: this.state.pageSize
            }).then(res => {
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
    inputField(table, field, value) {
        let data = this.state[table];
        data[field] = value;
        this.setState({
            [table]: data
        })
    }
    searchAgent(value) {
        if (new Date().getTime() - this.flag < 300) {
            clearTimeout(this.timeoutFlag);
        }
        this.flag = new Date().getTime();
        this.timeoutFlag = setTimeout(() => {
            queryAgent({
                keyword: value
            }).then(res => {
                let dataList = [];
                res.data.map(item => {
                    dataList.push(<Option key={item.id} text={item.name}>{`${item.name}-${item.phone}`}</Option>);
                });
                this.setState({
                    agentList: dataList,
                    agentInfoList: res.data,
                })
            }).catch(err => {
                log(err);
            })
        }, 300);
    }

    selectAgent(value) {
        let name = this.state.agentInfoList.filter(item => {
            return item.id === +value
        })[0].name;
        setTimeout(() => {
            this.inputField('agentForm', 'referrer_name', name);
            this.inputField('agentForm', 'referrer_id', +value);
            this.setState({
                lastSelectName: name,
            });
        }, 0)
    }
    render() {
        return <div className="block">
            <Breadcrumb>
                <Breadcrumb.Item><a href="#" onClick={e=>{e.preventDefault();this.props.history.push('/index/agent')}}>代理商管理</a></Breadcrumb.Item>
                <Breadcrumb.Item>代理商详情</Breadcrumb.Item>
            </Breadcrumb>
            <Tabs style={{marginTop: 20}} activeKey={this.state.activeKey} onChange={key => {
                this.setState({activeKey: key})}}>
                <Tabs.TabPane tab={'个人信息'} key={'detail'}>
                    <div style={{marginTop: 20}}>
                        <Form>
                            <FormItem
                                label='代理商编号'
                                labelCol={{span: 2}}
                                wrapperCol={{span: 22}}
                            >
                                <Input style={{maxWidth: 300}} value={this.state.agentForm.series_no} onChange={(e) => {
                                    this.inputField('agentForm', 'series_no', e.target.value)
                                }}/>
                            </FormItem>
                            <FormItem
                                label='代理级别'
                                labelCol={{span: 2}}
                                wrapperCol={{span: 22}}
                            >
                                <Select style={{width: 180}} value={this.state.agentForm.level_id} onChange={(value) => {
                                    this.inputField('agentForm', 'level_id', value)
                                }}>
                                    {this.state.levelList.map(item => {
                                        return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </FormItem>
                            <FormItem
                                label='姓名'
                                labelCol={{span: 2}}
                                wrapperCol={{span: 22}}
                            >
                                <Input style={{maxWidth: 300}} value={this.state.agentForm.name} onChange={(e) => {
                                    this.inputField('agentForm', 'name', e.target.value)
                                }}/>
                            </FormItem>
                            <FormItem
                                label='电话'
                                labelCol={{span: 2}}
                                wrapperCol={{span: 22}}
                            >
                                <Input style={{maxWidth: 300}} value={this.state.agentForm.phone} onChange={(e) => {
                                    this.inputField('agentForm', 'phone', e.target.value)
                                }}/>
                            </FormItem>
                            <FormItem
                                label='邮箱'
                                labelCol={{span: 2}}
                                wrapperCol={{span: 22}}
                            >
                                <Input style={{maxWidth: 300}} value={this.state.agentForm.email} onChange={(e) => {
                                    this.inputField('agentForm', 'email', e.target.value)
                                }}/>
                            </FormItem>
                            <FormItem
                                label='QQ'
                                labelCol={{span: 2}}
                                wrapperCol={{span: 22}}
                            >
                                <Input style={{maxWidth: 300}} value={this.state.agentForm.qq} onChange={(e) => {
                                    this.inputField('agentForm', 'qq', e.target.value)
                                }}/>
                            </FormItem>
                            <FormItem
                                label='微信'
                                labelCol={{span: 2}}
                                wrapperCol={{span: 22}}
                            >
                                <Input style={{maxWidth: 300}} value={this.state.agentForm.weixin} onChange={(e) => {
                                    this.inputField('agentForm', 'weixin', e.target.value)
                                }}/>
                            </FormItem>
                            <FormItem
                                label='引荐人'
                                labelCol={{span: 2}}
                                wrapperCol={{span: 22}}
                            >
                                <AutoComplete
                                    value={this.state.agentForm.referrer_name}
                                    dataSource={this.state.agentList}
                                    style={{width: 300}}
                                    onSelect={this.selectAgent}
                                    onSearch={this.searchAgent}
                                    onBlur={() => {
                                        this.inputField('agentForm', 'referrer_name', this.state.lastSelectName)
                                    }}
                                    onFocus={()=>{this.state.agentForm.referrer_name !== '' && this.searchAgent(this.state.agentForm.referrer_name)}}
                                    onChange={value => {
                                        this.inputField('agentForm', 'referrer_name', value);
                                        this.setState({lastSelectName: ''},()=>{
                                            this.inputField('agentForm', 'referrer_id', '');
                                        })
                                    }}
                                >
                                </AutoComplete>
                            </FormItem>
                            <FormItem
                                label='描述'
                                labelCol={{span: 2}}
                                wrapperCol={{span: 22}}
                            >
                                <Input style={{maxWidth: 300}} value={this.state.agentForm.description} onChange={(e) => {
                                    this.inputField('agentForm', 'description', e.target.value)
                                }}/>
                            </FormItem>
                        </Form>
                        <Button style={{ marginTop: 30, marginLeft: '8.33333%' }} type={"primary"} onClick={this.handleSaveAgent}>保存</Button>
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab={'订单列表'} key={'order'}>
                    <div style={{marginTop: 20}}>
                        <Button onClick={() => {
                            this.props.history.push(`/index/agent/detail/`,{agentId: this.props.match.params.id})
                        }} style={{marginLeft: 30}} type={"primary"}>新增订单</Button>
                        <Table rowKey={'id'} style={{margin: 30}} loading={this.state.isLoading}
                               dataSource={this.state.list} columns={this.agentOrderColumns}
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
                </Tabs.TabPane>
                <Tabs.TabPane tab={'提成列表'} key={'bonus'}>
                    <div style={{marginTop: 20}}>
                        <Table rowKey={'id'} style={{margin: 30}} loading={this.state.bonusLoading}
                               dataSource={this.state.bonusList} columns={this.bonusColumns}
                               pagination={{
                                   current: this.state.bonusPageNum, onChange: (page) => {
                                       this.setState({
                                           bonusPageNum: page
                                       }, () => {
                                           this.handleFetchBonusList();
                                       })
                                   }
                               }}/>
                    </div>
                </Tabs.TabPane>
            </Tabs>

        </div>
    }
}

export default AgentOrder;