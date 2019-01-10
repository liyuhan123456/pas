import React,{Component} from 'react';
import {Form, Input, Button, message} from 'antd';
import {withRouter} from 'react-router-dom';
import {login} from '@src/service/index';
import {log} from '@src/utils/utils';
import css from './index.css';
import Appstate from '@src/Mobx/AppState';
class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            usernameStatus: null,
            usernameTip: '',
            passwordStatus: null,
            passwordTip: '',
            flag: false,
        };
        if(JSON.parse(localStorage.getItem('userInfo')) && localStorage.getItem('role')){
            this.props.history.push('/index/home');
        }
        this.validate = this.validate.bind(this);
        this.login = this.login.bind(this);
    }
    validate(key){
        if(key === 'username'){
            if(this.state[key].length >= 2 && this.state[key].length <= 16){
                this.setState({ usernameStatus: 'success',usernameTip: '' });
            }else{
                this.setState({ usernameStatus: 'error',usernameTip: '用户名长度应在2-16之间' });
            }
        }
        if(key === 'password'){
            if(this.state[key].length >= 2 && this.state[key].length <= 16){
                this.setState({ passwordStatus: null,passwordTip: '' });
            }else{
                this.setState({ passwordStatus: 'error',passwordTip: '密码长度应在2-16之间'});
            }
        }
    }
    login(){
        this.validate('username');
        this.validate('password');
        const {username, password} = this.state;
        if(this.state.usernameStatus === 'success' && this.state.passwordStatus === null){
            this.setState({
                flag: true
            });
           login({username,password}).then(res=>{
               this.setState({
                   flag: false
               },()=>{
                   //登录成功时
                   if(res.error === 0){
                       log(res.data);
                       localStorage.setItem('userInfo',JSON.stringify(res.data));
                       localStorage.setItem('role',res.data.role);
                       Appstate.login();
                       message.success('登录成功！',1,()=>{
                           this.props.history.push('/index/home');
                       })
                   }
                   //用户名或密码错误
                   if(res.error === 5011){
                       message.error('用户名或密码错误！',1.5);
                   } //用户名或密码错误
                   if(res.error === 5012){
                       message.error(res.message,1.5)
                   }
               });


           }).catch(e=>{
               log(e);
               message.error('登录失败,请稍后再试或检查服务器状态。',1);
               this.setState({
                   flag: false
               })
           })
        }
    }
    render(){
        
        return(
            <div className={css.content + ' shadow-1px'}>
                <div className={css.loginBox}>
                    <div className={css.title}>进销存管理系统</div>
                    <div style={{ padding: '30px' }}>
                        <Form
                            layout={"vertical"}

                        >
                            <Form.Item
                                validateStatus={this.state.usernameStatus}
                                help={this.state.usernameTip}
                                hasFeedback
                            >
                                <Input onKeyDown={(e)=>{if(e.keyCode === 13){this.login()}}} onBlur={()=>{this.validate('username')}} className={css.input} placeholder="请输入您的用户名" value={this.state.username} onChange={(e)=>{ this.setState({ username: e.target.value }) }} />
                            </Form.Item>
                            <Form.Item
                                validateStatus={this.state.passwordStatus}
                                help={this.state.passwordTip}
                                hasFeedback
                            >
                                <Input onKeyDown={(e)=>{if(e.keyCode === 13){this.login()}}}  onBlur={()=>{this.validate('password')}} type='password' className={css.input} placeholder="请输入您的密码" value={this.state.password} onChange={(e)=>{ this.setState({ password: e.target.value }) }} />
                            </Form.Item>
                        </Form>
                        <Button  style={{ width: '100%' }} onClick={this.login} disabled={this.state.username.length < 2 || this.state.username.length > 16 || this.state.password.length < 2 || this.state.password.length > 16 || this.state.flag} type="primary">登录</Button>
                    </div>
                </div>
                <div style={{ position: 'absolute',width: '100%',bottom: '50px',textAlign: 'center',color:'#fff' }}> Copyright © 2018 </div>
            </div>
        )
    }
}
export default withRouter(Login);