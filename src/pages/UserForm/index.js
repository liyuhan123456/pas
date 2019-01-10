import React, {Component} from 'react'
import 'moment/locale/zh-cn';
import {Breadcrumb,Input,Button,message,Table,Form,DatePicker,Radio} from 'antd';
import {log} from '../../utils/utils';
import {saveUser} from '../../service/index';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: (this.props.location.state && this.props.location.state.userInfo) || {
                username: '',
                nickname: '',
                password: '',
                role: 'user',
                state: 1,
            },
            isLoading: false,
        };
        log(this.state.userInfo);
        this.handleSave = this.handleSave.bind(this);
    }
    inputField(table,field,value){
            let data = this.state[table];
            data[field] = value;
            this.setState({
                [table]: data
            })
    }
    handleSave(){
        this.setState({
            isLoading: true
        },()=>{
            let postData = {...this.state.userInfo};
            if(this.state.userInfo.id && (this.state.userInfo.password === '')){
                delete postData.password;
            }
            saveUser(this.state.userInfo).then(res=>{
                if(res.error === 0){
                    message.success('保存成功',1,()=>{
                        this.props.history.push('/index/manage');
                    })
                }
                else{
                    message.error('保存用户信息失败,请稍后再试或检查服务器状态!',1);
                }
            }).catch(err=>{
                message.error('保存用户信息失败,请稍后再试或检查服务器状态!',1);
                log(err);
            }).finally(()=>{
                this.setState({
                    isLoading: false
                })
            })
        })
    }
    render(){
        let role = localStorage.getItem('role');
        return (
            <div className="block">
                <Breadcrumb>
                    <Breadcrumb.Item><a href="#" onClick={(e)=>{e.preventDefault();this.props.history.push('/index/manage')}}>用户管理</a></Breadcrumb.Item>
                    <Breadcrumb.Item>{ this.state.userInfo.id ? '编辑用户' : '添加用户' }</Breadcrumb.Item>
                </Breadcrumb>
                <Form style={{ marginTop: 50 }}>
                    <FormItem
                        label='用户名'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 10 }}
                    >
                        <Input style={{ maxWidth: 300 }} value={this.state.userInfo.username}  onChange={(e)=>{this.inputField('userInfo','username',e.target.value)}} />
                    </FormItem>
                    <FormItem
                        label='昵称'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 10 }}
                    >
                        <Input style={{ maxWidth: 300 }} value={this.state.userInfo.nickname}  onChange={(e)=>{this.inputField('userInfo','nickname',e.target.value)}} />
                    </FormItem>
                    <FormItem
                        label='密码'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 10 }}
                    >
                        <Input type={"password"} placeholder={ this.state.userInfo.id ? "置空为不修改" : ''} style={{ maxWidth: 300 }} value={this.state.userInfo.password}  onChange={(e)=>{this.inputField('userInfo','password',e.target.value)}} />
                    </FormItem>
                    <FormItem
                        label='角色'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 10 }}
                    >
                        <RadioGroup value={this.state.userInfo.role} onChange={(e)=>{this.inputField('userInfo','role',e.target.value)}}>
                            <Radio value={'admin'}>管理员</Radio>
                            <Radio value={'user'}>用户</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        label='状态'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 10 }}
                    >
                        <RadioGroup value={this.state.userInfo.state} onChange={(e)=>{this.inputField('userInfo','state',e.target.value)}}>
                            <Radio value={1}>可用</Radio>
                            <Radio value={0}>不可用</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
                  <Button loading={this.state.isLoading} style={{ marginLeft: '8.33333333%', marginTop: 10 }} type="primary" onClick={this.handleSave}>保存</Button>
            </div>
        )
    }
}

export default UserForm