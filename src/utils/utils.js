import axios from 'axios'
import React ,{Component} from 'react';
import {inject,observer} from "mobx-react";
import Appstate from "@src/Mobx/AppState";
axios.defaults.baseURL = 'http://sales.diigii.com:8080';
// axios.defaults.withCredentials = true;
axios.interceptors.request.use((config)=>{
    const withOutTokenUrl = [
        '/user/login',
    ];
    if(!withOutTokenUrl.includes(config.url)){
        config.headers.token = JSON.parse(localStorage.getItem('userInfo')).token;
    }
    return (config);
});
axios.interceptors.response.use((res)=>{
    if(res.data.error === 3001){
        localStorage.removeItem('userInfo');
        localStorage.removeItem('role');
        Appstate.logout();
        Appstate.history.push('/login');
    }else{
        return res;
    }
});
function stringifyURL(params,postFlag){
    var paramUrl = '';
    for (var key in params) {
        if (!postFlag && paramUrl === '') {
            paramUrl += '?' + key + '=' + encodeURIComponent(params[key]);
        }
        else {
            paramUrl += '&' + key + '=' + encodeURIComponent(params[key]);
        }
    }
    //console.log(paramUrl);
    return paramUrl;
}

export function post(url,data) {
    return new Promise((resolve, reject) => {
        let header =  {'Content-type': 'application/json'};
        axios.post(url, data, {
                headers: header
            }
        ).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
export function postFormData(url,data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
export function get(url,data) {
    return new Promise((resolve, reject) => {
        axios.get(url,{params:data},{
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
export let log = console.log.bind(console);

export let H = document.documentElement.clientWidth / 1920;

export let W = document.documentElement.clientHeight / 1080;

export function CheckLogin(Cmp){
    @inject('store')
    @observer class HOC extends Component{
        constructor(props){
            super(props);
            if(JSON.parse(localStorage.getItem('userInfo')) && localStorage.getItem('role')){
                this.props.store.login();
            }
            if(!this.props.store.isLogin && this.props.store.history !== null){
                // window.location.href = '/login'
                this.props.store.history.push('/login')
            }
        }
        render(){
            return (<Cmp {...this.props} />)
        }
    }
    return HOC
}

