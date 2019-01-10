import React,{Component} from 'react';
import AdminHome from '../AdminHome/index';
import NoMatch from '../404/NoMatch';
class Home extends Component {
    constructor(props) {
        super(props);
        this.template = NoMatch;
        switch (localStorage.getItem('role')) {
            case 'admin':
                this.template = AdminHome;
                break;
            case 'user':
                this.template = AdminHome;
                break;
            default: 
                break;
        }
    }

    render() {
        return <this.template />
    }
}
export default Home;
