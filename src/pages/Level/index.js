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
} from 'antd';
import {log} from '../../utils/utils';
import {
    fetchLevelList,
    saveLevel,
    deleteLevel,
} from '../../service/index';
const FormItem = Form.Item;

class Level extends Component {
    constructor(props){
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: 10,
            rowTotal: 0,
            list: [],
            levelVisible: false,
            levelForm: {
                name: '',
                icon: '',
                sorting: '',
                description: ''
            },
        };
        this.levelColumns = [
            {
                title: '级别名称',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '级别说明',
                dataIndex: 'description',
                align: 'center'
            },
            {
                title: '排序',
                dataIndex: 'sorting',
                align: 'center'
            },
            {
                title: '操作',
                align: 'center',
                render: (text, record) => {
                    return (
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                            <Button type={"primary"} onClick={() => {
                                this.handleChangeLevel(record)
                            }}>修改</Button>
                            <Popconfirm title="确定要删除这个级别吗？" onConfirm={() => {
                                this.handleDeleteLevel(record.id)
                            }} okText="是" cancelText="否">
                                <Button type={"danger"}>删除</Button>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ];
        this.handleSaveLevel = this.handleSaveLevel.bind(this);
    }
    componentDidMount() {
        this.handleFetchLevelList();
    }
    handleDeleteLevel(id){
        deleteLevel({id}).then(res=>{
            if(res.error === 0){
                message.success("删除成功",1);
                this.handleFetchLevelList();
            }else{
                message.error("删除失败,请稍后再试或检查服务器状态!",1);
            }
        }).catch(err=>{
            log(err);
            message.error("删除失败,请稍后再试或检查服务器状态!",1);
        })
    }
    handleFetchLevelList(){
        this.setState({
            isLoading: true
        },()=>{
            fetchLevelList({
                page_num: this.state.pageNum,
                page_size: this.state.pageSize
            }).then(res=>{
                log(res);
                this.setState({
                    list: res.data.list,
                    rowTotal: res.data.totalRow
                });
            }).catch(err=>{
                log(err);
                message.error("获取级别列表失败，请检查网络和服务器状态",1.5)
            }).finally(()=>{
                this.setState({
                    isLoading: false
                });
            })
        });
    }
    handleChangeLevel(record){
        this.setState({
            levelVisible: true,
            levelForm: {
                id: record.id,
                name: record.name,
                icon: record.icon,
                sorting: record.sorting,
                description: record.description
            },
        })
    }
    handleSaveLevel(){
        saveLevel(this.state.levelForm).then(res=>{
            if(res.error === 0){
                message.success("保存成功");
                this.setState({
                    levelVisible: false,
                    levelForm:{
                        name: '',
                        icon: '',
                        sorting: '',
                        description: ''
                    },
                });
                this.handleFetchLevelList();
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
    render(){
        return <div className="block">
            <Breadcrumb>
                <Breadcrumb.Item>代理级别管理</Breadcrumb.Item>
            </Breadcrumb>
            <Modal width={640} visible={this.state.levelVisible} onOk={this.handleSaveLevel} onCancel={() => {this.setState({levelVisible: false})}} >
                <Form style={{marginBottom: 20}}>
                    <FormItem
                        label='级别名称'
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
                    >
                        <Input style={{maxWidth: 300}} value={this.state.levelForm.name} onChange={(e)=>{this.inputField('levelForm','name',e.target.value)}}/>
                    </FormItem>
                    <FormItem
                        label='级别说明'
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
                    >
                        <Input style={{maxWidth: 300}} value={this.state.levelForm.description} onChange={(e)=>{this.inputField('levelForm','description',e.target.value)}}/>
                    </FormItem>
                    <FormItem
                        label='排序'
                        labelCol={{span: 4}}
                        wrapperCol={{span: 18}}
                    >
                        <Input placeholder={"数字越大排序越靠后"} style={{maxWidth: 300}} value={this.state.levelForm.sorting} onChange={(e)=>{this.inputField('levelForm','sorting',e.target.value)}}/>
                    </FormItem>
                </Form>
            </Modal>
            <div style={{marginTop: 20}}>
                <Button onClick={()=>{
                    this.setState({
                        levelVisible: true,
                        levelForm: {
                            name: '',
                            icon: '',
                            sorting: '',
                            description: ''
                        },
                    })
                }} style={{ marginLeft: 30 }} type={"primary"}>新增级别</Button>
                <Table rowKey={'id'} style={{margin: 30}} loading={this.state.isLoading}
                       dataSource={this.state.list} columns={this.levelColumns}
                       pagination={{
                           current: this.state.pageNum, onChange: (page) => {
                               this.setState({
                                   pageNum: page
                               },()=>{
                                   this.handleFetchLevelList();
                               })
                           }
                       }}/>
            </div>
        </div>
    }
}

export default Level;