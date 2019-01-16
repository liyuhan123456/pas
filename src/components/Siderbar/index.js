import React,{Component} from 'react';
import { Icon,Menu} from 'antd';
import {withRouter} from 'react-router-dom';
import {inject,observer} from "mobx-react";
import css from './index.css';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_852492_vjpfcl3hrq9.js',
});
const Template = {
    admin: [
        <Menu.Item key="/home">
            <IconFont className={css['icon-middle']} type="icon-home"/>
            <span>商品管理</span>
        </Menu.Item>,
        <Menu.Item key="/order">
            <IconFont className={css['icon-middle']} type="icon-orderform"/>
            <span>订单管理</span>
        </Menu.Item>,
        <Menu.Item key="/category">
            <IconFont className={css['icon-middle']} type="icon-category"/>
            <span>类别管理</span>
        </Menu.Item>,
        <Menu.Item key="/level">
            <IconFont className={css['icon-middle']} type="icon-Level"/>
            <span>代理级别管理</span>
        </Menu.Item>,
        <Menu.Item key="/agent">
            <IconFont className={css['icon-middle']} type="icon-agentslinemtui"/>
            <span>代理商管理</span>
        </Menu.Item>,
        <Menu.Item key="/manage">
            <IconFont className={css['icon-middle']} type="icon-user"/>
            <span>用户管理</span>
        </Menu.Item>,
        <Menu.Item key="/system">
            <IconFont className={css['icon-middle']} type="icon-config"/>
            <span>系统配置</span>
        </Menu.Item>,

    ],
    user: [

    ],
};
@inject('store')
@observer
class Siderbar extends Component{
    constructor(props){
        super(props);
        this.state = {
            Template,
        };
        this.onSelect = this.onSelect.bind(this);
        this.getSelected = this.getSelected.bind(this)
    }
    componentDidMount(){
        this.getSelected(this.props.history.location.pathname)
    }
    getSelected(url) {
        const key = url.split("/")
        this.props.store.toggleKey('/'+key[2]);
    }
    componentWillReceiveProps(nextProps) {
        this.getSelected(nextProps.store.selectedKeys)
    }
    onSelect ({ item, key, selectedKeys }) {
        this.props.store.toggleKey(key);
        this.props.history.push('/index'+key)
    }
    render(){
        return (
            <div>
                <Menu
                    mode="inline"
                    selectedKeys={this.props.store.selectedKey}
                    // onSelect={this.onSelect}
                    onClick = {this.onSelect}
                >

                    {this.state.Template[this.props.role]}

                </Menu>

            </div>
        )
    }
}

export default withRouter(Siderbar);