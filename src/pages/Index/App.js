import {IndexRouters} from '@src/router/router'
import React, {Component} from 'react'
// import {GetList} from '@src/Service/Api';
import Siderbar from '@src/components/Siderbar/index';
import {log} from '@src/utils/utils';
import { Row, Col,} from 'antd';
import Header from '@src/components/Header/index';
import 'moment/locale/zh-cn';
import css from './App.css';
import {CheckLogin} from '../../utils/utils';
import {inject,observer} from "mobx-react";
@inject('store')
@CheckLogin
@observer
class App extends Component {
    constructor(props) {
        super(props);
        if(localStorage.getItem('role') === null || localStorage.getItem('userInfo') === null){
             return this.props.history.push('/login')
         }
        if(this.props.store.history === null){
            this.props.store.setHistory(this.props.history);
        }
        if (this.props.history.location.pathname === '/') {
            return this.props.history.push('/index/home')
        }else{
            this.flag = true;
        }
    }

    render() {
        if(!this.flag){
            return null
        }
        return (
            <Row style={{minHeight: '100vh'}} type="flex">
                <Col span={4} >
                    <div style={{height: 64, backgroundColor: '#78dde9',color: '#fff'}}>
                        <img src={require('../../assets/robot.jpg')} style={{ width: 64, height: 64,verticalAlign: 'top', marginLeft: 20 }} alt=""/>
                        <div style={{paddingLeft: 10, lineHeight: '64px', fontSize: '18px',display: 'inline-block',marginLeft: 10 }}>进销存管理系统</div>
                        {/*<span style={{display: 'inline-block', lineHeight: '58px', fontSize: '8px',marginLeft: '6px' }}>客户服务管理后台</span>*/}
                    </div>
                    <Siderbar role={localStorage.getItem('role')} />
                </Col>
                <Col span={20}  style={{height: '100vh', flexDirection: 'column', display: 'flex',overflow:'hidden'}}>
                    <Header/>
                    <div className={css.content}>
                        <div style={{ width: '100%', overflow: 'hidden'}}>
                            <IndexRouters />
                        </div>
                        <p className={css.copyright}>
                            Copyright © 2018
                        </p>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default App