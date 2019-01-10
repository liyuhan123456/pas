import React,{ Component } from 'react';
import {Avatar, Dropdown, Menu, Icon} from 'antd';
import css from './index.css';
import {withRouter,Link} from 'react-router-dom';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_852492_folieqeuct4.js',
});
class Header extends Component{
    constructor(props) {
        super(props);
        this.state = {
            time: new Date().toLocaleString(),
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            nickName: '我是管理员'
        };
        this.flag = null;
        this.menu = (
            <Menu>
                {/*<Menu.Item>*/}
                    {/*<Link to='/index/home/userInfo'>用户资料</Link>*/}
                {/*</Menu.Item>*/}
                {/*<Menu.Item>*/}
                    {/*<Link to='/index/home/changePassword'>修改密码</Link>*/}
                {/*</Menu.Item>*/}
                <Menu.Item>
                    <a href="#/" onClick={(e)=>{ e.preventDefault();localStorage.removeItem('role');localStorage.removeItem('userInfo');document.cookie="";this.props.history.push('/login')}}>退出系统</a>
                </Menu.Item>
            </Menu>
        );
    }
    componentDidMount(){
        if(this.props.history.location.pathname !== '/'){
            this.newTime();
        }
    }
    newTime(){
        this.flag = setInterval(()=>{
            this.setState({ time: new Date().toLocaleString()})
        },1000)
    }
    componentWillUnmount(){
        clearInterval(this.flag);
    }
    render(){
        return (
            <div className={css.container + ' shadow-1px'}>
                <IconFont type="icon-clock" style={{fontSize: 16,marginRight:8}}/>{ this.state.time }
                <div style={{ cursor: 'pointer', float: 'right'}}><Avatar size="default" src={this.state.avatar}/>
                    <Dropdown overlay={this.menu} trigger={['hover']}>
                        <span style={{ display: 'inline-block',verticalAlign: 'sub'  }}>{localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).nickname}</span>
                    </Dropdown>
                </div>

    </div>
        )
    }
}

export default withRouter(Header);