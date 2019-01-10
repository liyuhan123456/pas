import React, {Component} from 'react'
import 'moment/locale/zh-cn';
import {Breadcrumb,Input,Button,message,Table,Popconfirm} from 'antd';
import {log} from '../../utils/utils';
import {deactivateUser,getUserList,activeUser,deleteUser} from '../../service/index';
import moment from 'moment';
import {withRouter} from "react-router-dom";
@withRouter
class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            rowTotal: -1,
            pageSize: 10,
            list: [],
            isLoading: false,
            searchMode: false,
            text: '',
        };
        this.userColumns = [
            {
                title: '身份',
                align: 'center',
                dataIndex: 'role'
            },
            {
                title: '昵称',
                align: 'center',
                dataIndex: 'nickname'
            },
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '状态',
                align: 'center',
                dataIndex: 'state',
                render: (text)=>{
                    return (<span>{text === 0 ? '不可用' : '可用'}</span>)
                }
            },
            {
                title: '操作',
                align: 'center',
                render: (text,record,index)=>{
                    return (
                        <div style={{display: 'flex',justifyContent: 'space-around'}}>
                            <Button type={"primary"} onClick={()=>{this.props.history.push('/index/manage/userForm',{userInfo: {...record,password: ''}})}}>详情</Button>
                            { record.state === 1 ?
                                <Popconfirm title="确定要禁用这个账户吗？" onConfirm={()=>{this.handleDeactivateUser(record.id)}} okText="是" cancelText="否">
                                    <Button type={"danger"} >禁用</Button>
                                </Popconfirm> :
                                <Button onClick={()=>{this.handleActiveUser(record.id)}} type={"primary"} >激活</Button>
                            }
                            <Popconfirm title="确定要删除这个账户吗？" onConfirm={()=>{this.handleDeleteUser(record.id)}} okText="是" cancelText="否">
                                <Button type={"danger"} >删除</Button>
                            </Popconfirm>
                        </div>
                    )
                }
            },
        ];
    }
    componentDidMount(){
        this.fetchUserList();
    }
    //获取用户列表
    fetchUserList(){
        this.setState({
            isLoading: true
        },()=>{
            let postData = {
                page_size: this.state.pageSize,
                page_num: this.state.pageNum
            };
            if(this.state.searchMode){
                postData.keyword = this.state.text;
            }
            getUserList(postData).then(res=>{
                log(res);
                this.setState({
                    list: res.data.list,
                    rowTotal: res.data.totalRow,
                });
            }).catch(err=>{
                message.error('用户列表加载失败，请稍后再试或检查服务器状态。',1);
                log(err);
            }).finally(()=>{
                this.setState({
                    isLoading: false
                })
            })
        });
    }
    //禁用用户
    handleDeactivateUser(id){
        deactivateUser({id}).then(res=>{
            if(res.error === 0){
                message.success("禁用成功",1);
                this.fetchUserList();
            }else{
                message.error("禁用失败,请稍后再试或检查服务器状态!",1);
            }
        }).catch(err=>{
            log(err);
            message.error("禁用失败,请稍后再试或检查服务器状态!",1);
        })
    }   //禁用用户
    handleDeleteUser(id){
        deleteUser({id}).then(res=>{
            if(res.error === 0){
                message.success("删除成功",1);
                this.fetchUserList();
            }else{
                message.error("删除失败,请稍后再试或检查服务器状态!",1);
            }
        }).catch(err=>{
            log(err);
            message.error("删除失败,请稍后再试或检查服务器状态!",1);
        })
    }
    //激活用户
    handleActiveUser(id){
        activeUser({id}).then(res=>{
            if(res.error === 0){
                message.success("激活成功",1);
                this.fetchUserList();
            }else{
                message.error("激活失败,请稍后再试或检查服务器状态!",1);
            }
        }).catch(err=>{
            log(err);
            message.error("激活失败,请稍后再试或检查服务器状态!",1);
        })
    }
    render() {
        return (
            <div className="block">
                <Breadcrumb>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ height: 30 }}>
                    {/*<Input.Search value={this.state.text} onChange={(e)=>{this.setState({text: e.target.value.trim()})}} placeholder="根据用户名称或id搜索用户" onSearch={()=>{this.setState({ searchMode: true,pageNum: 1 },()=>{this.fetchUserList()})}} style={{ width: 300 }}/>*/}
                    {/*{ this.state.searchMode ? <a style={{ marginLeft: 20 }} href="#" onClick={(e)=>{e.preventDefault();this.setState({ text: '',pageNum: 1,rowMax: -1,searchMode: false },()=>{this.fetchUserList()})}}>清除搜索条件</a> : null}*/}
                    <Button style={{ marginLeft: 30,float: 'right' }} type={"primary"} onClick={()=>{this.props.history.push('/index/manage/userForm')}}>新增用户</Button>
                </div>
                <Table style={{ marginTop: 30 }} rowKey={'id'} pagination={{ current: this.state.pageNum, pageSize: this.state.pageSize, total: this.state.rowTotal, onChange: (value)=>{this.setState({ pageNum: value },()=>{this.fetchUserList()})}}} columns={this.userColumns} dataSource={this.state.list}  />
            </div>
        )
    }
}

export default UserManage