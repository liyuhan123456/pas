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
    fetchAgentList,
    saveAgent,
    deleteAgent,
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
            agentVisible: false,
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
            levelId: '',
            agentList: [],
            lastSelectName: '',
            agentInfoList: []
        };
        this.agentColumns = [
            {
                title: '代理商编号',
                dataIndex: 'series_no',
                align: 'center'
            },
            {
                title: '代理级别',
                dataIndex: 'level_id',
                align: 'center',
                render: (text) => {
                    return <span>{this.state.levelList.length === 0 ? text : this.state.levelList.filter(item => {
                        return item.id === text
                    })[0].name}</span>
                }
            },
            {
                title: '姓名',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '电话',
                dataIndex: 'phone',
                align: 'center'
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                align: 'center'
            },
            {
                title: 'QQ',
                dataIndex: 'qq',
                align: 'center'
            },
            {
                title: '微信',
                dataIndex: 'weixin',
                align: 'center'
            },
            {
                title: '引荐人',
                dataIndex: 'referrer_name',
                align: 'center'
            },
            {
                title: '描述',
                dataIndex: 'description',
                align: 'center'
            },
            {
                title: '操作',
                align: 'center',
                render: (text, record) => {
                    return (
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                            <Button type={"primary"} onClick={() => {
                                this.handleChangeAgent(record)
                            }}>修改</Button>
                            <Popconfirm title="确定要删除这个代理商吗？" onConfirm={() => {
                                this.handleDeleteAgent(record.id)
                            }} okText="是" cancelText="否">
                                <Button type={"danger"}>删除</Button>
                            </Popconfirm>
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
        this.handleFetchAgentList();
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
                    levelId: res.data.list[0] ? res.data.list[0].id : ''
                })
            }).catch(err => {
                log(err);
            }).finally(() => {
                this.setState({
                    levelLoading: false
                });
            })
        });
    }

    handleDeleteAgent(id) {
        deleteAgent({id}).then(res => {
            if (res.error === 0) {
                message.success("删除成功", 1);
                this.handleFetchAgentList();
            } else {
                message.error("删除失败,请稍后再试或检查服务器状态!", 1);
            }
        }).catch(err => {
            log(err);
            message.error("删除失败,请稍后再试或检查服务器状态!", 1);
        })
    }

    handleFetchAgentList() {
        this.setState({
            isLoading: true
        }, () => {
            fetchAgentList({
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
                message.error("获取代理商列表失败，请检查网络和服务器状态", 1.5)
            }).finally(() => {
                this.setState({
                    isLoading: false
                });
            })
        });
    }

    handleChangeAgent(record) {
        this.setState({
            agentVisible: true,
            lastSelectName: record.referrer_name,
            agentForm: {
                id: record.id,
                series_no: record.series_no,
                level_id: record.level_id,
                name: record.name,
                phone: record.phone,
                email: record.email,
                qq: record.qq,
                weixin: record.weixin,
                referrer_id: record.referrer_id,
                description: record.description,
                referrer_name: record.referrer_name,
            },
        })
    }

    handleSaveAgent() {
        saveAgent(this.state.agentForm).then(res=>{
            if(res.error === 0){
                message.success("保存成功");
                this.setState({
                    agentVisible: false,
                    agentForm:{
                        series_no: '',
                        level_id: '',
                        name: '',
                        phone: '',
                        email: '',
                        qq: '',
                        weixin: '',
                        referrer_id: '',
                        description: '',
                        referrer_name: '',
                    },
                    lastSelectName: '',
                });
                this.handleFetchAgentList();
            }else{
                message.error("保存失败，请检查网络或服务器状态");
            }
        }).catch(err=>{
            log(err);
        })
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
                    selectMode: true
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
                <Breadcrumb.Item>代理商管理</Breadcrumb.Item>
            </Breadcrumb>
            <Modal width={640} visible={this.state.agentVisible} onOk={this.handleSaveAgent} onCancel={() => {
                this.setState({agentVisible: false})
            }}>
                <Form style={{marginBottom: 20}}>
                    <FormItem
                        label='代理商编号'
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
                    >
                        <Input style={{maxWidth: 300}} value={this.state.agentForm.series_no} onChange={(e) => {
                            this.inputField('agentForm', 'series_no', e.target.value)
                        }}/>
                    </FormItem>
                    <FormItem
                        label='代理级别'
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
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
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
                    >
                        <Input style={{maxWidth: 300}} value={this.state.agentForm.name} onChange={(e) => {
                            this.inputField('agentForm', 'name', e.target.value)
                        }}/>
                    </FormItem>
                    <FormItem
                        label='电话'
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
                    >
                        <Input style={{maxWidth: 300}} value={this.state.agentForm.phone} onChange={(e) => {
                            this.inputField('agentForm', 'phone', e.target.value)
                        }}/>
                    </FormItem>
                    <FormItem
                        label='邮箱'
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
                    >
                        <Input style={{maxWidth: 300}} value={this.state.agentForm.email} onChange={(e) => {
                            this.inputField('agentForm', 'email', e.target.value)
                        }}/>
                    </FormItem>
                    <FormItem
                        label='QQ'
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
                    >
                        <Input style={{maxWidth: 300}} value={this.state.agentForm.qq} onChange={(e) => {
                            this.inputField('agentForm', 'qq', e.target.value)
                        }}/>
                    </FormItem>
                    <FormItem
                        label='微信'
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
                    >
                        <Input style={{maxWidth: 300}} value={this.state.agentForm.weixin} onChange={(e) => {
                            this.inputField('agentForm', 'weixin', e.target.value)
                        }}/>
                    </FormItem>
                    <FormItem
                        label='引荐人'
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
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
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
                    >
                        <Input style={{maxWidth: 300}} value={this.state.agentForm.description} onChange={(e) => {
                            this.inputField('agentForm', 'description', e.target.value)
                        }}/>
                    </FormItem>
                </Form>
            </Modal>
            <div style={{marginTop: 20}}>
                <Button onClick={() => {
                    this.setState({
                        agentVisible: true,
                        agentForm: {
                            series_no: '',
                            level_id: this.state.levelId,
                            name: '',
                            phone: '',
                            email: '',
                            qq: '',
                            weixin: '',
                            referrer_id: '',
                            description: '',
                            referrer_name: '',
                        },
                        lastSelectName: '',
                    })
                }} style={{marginLeft: 30}} type={"primary"}>新增代理商</Button>
                <Table rowKey={'id'} style={{margin: 30}} loading={this.state.isLoading}
                       dataSource={this.state.list} columns={this.agentColumns}
                       pagination={{
                           current: this.state.pageNum, onChange: (page) => {
                               this.setState({
                                   pageNum: page
                               }, () => {
                                   this.handleFetchAgentList();
                               })
                           }
                       }}/>
            </div>
        </div>
    }
}

export default Agent;