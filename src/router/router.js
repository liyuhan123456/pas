import React from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Bundle from './bundle';
import AppState from '@src/Mobx/AppState';
import {Provider} from 'mobx-react'



// 路由按需加载
const Index = (props) => (
    <Bundle load={() => import(/* webpackChunkName: "Index" */'../pages/Index/App')}>
        {(Index) => <Provider  store={AppState}><Index {...props}/></Provider>}
    </Bundle>
);

const NoMatch = (props)=> (
    <Bundle load={() => import(/* webpackChunkName: "Nomatch" */'../pages/404/NoMatch')}>
        {(NoMatch) => <NoMatch {...props}/>}
    </Bundle>
);
const Home = (props) => (
    <Bundle load={() => import(/* webpackChunkName: "Home" */'../pages/Home')}>
        {(Home) => <Home {...props}/>}
    </Bundle>
);

const Login = (props) => (
    <Bundle load={()=> import(/* webpackChunkName: "Login" */'../pages/Login/index')}>
        {(Login) => <Login {...props} />}
    </Bundle>
);


const UserManage = (props) => (
    <Bundle load={()=> import(/* webpackChunkName: "UserManage" */'../pages/UserManage/index')}>
        {(UserManage) => <UserManage {...props} />}
    </Bundle>
);

const UserForm = (props) => (
    <Bundle load={()=> import(/* webpackChunkName: "UserForm" */'../pages/UserForm/index')}>
        {(UserForm) => <UserForm {...props} />}
    </Bundle>
);

const Category = (props) => (
    <Bundle load={()=> import(/* webpackChunkName: "Category" */'../pages/Category/index')}>
        {(Category) => <Category {...props} />}
    </Bundle>
);

const CategoryDetail = (props) => (
    <Bundle load={()=> import(/* webpackChunkName: "CategoryDetail" */'../pages/CategoryDetail/index')}>
        {(CategoryDetail) => <CategoryDetail {...props} />}
    </Bundle>
);

const ProductDetail = (props) => (
    <Bundle load={()=> import(/* webpackChunkName: "ProductDetail" */'../pages/ProductDetail/index')}>
        {(ProductDetail) => <ProductDetail {...props} />}
    </Bundle>
);

const Level = (props) => (
    <Bundle load={()=> import(/* webpackChunkName: "Level" */'../pages/Level/index')}>
        {(Level) => <Level {...props} />}
    </Bundle>
);

const System = (props) => (
    <Bundle load={()=> import(/* webpackChunkName: "System" */'../pages/System/index')}>
        {(System) => <System {...props} />}
    </Bundle>
);

const Agent = (props) => (
    <Bundle load={()=> import(/* webpackChunkName: "Agent" */'../pages/Agent/index')}>
        {(Agent) => <Agent {...props} />}
    </Bundle>
);






const routerMap=[
    { path: '/login', component: Login,  exact: true},
    { path: '/index/', component: Index },
    { path: '/', component: Index, exact: true},
    { path: '*', component: NoMatch,  },
];

const IndexRouterMap = [
    { path: '/index/404', component: NoMatch, exact: true },
    { path: '/index/home', component: Home, exact: true },
    { path: '/index/home/product', component: ProductDetail, exact: true },
    { path: '/index/category', component: Category, exact: true },
    { path: '/index/category/detail', component: CategoryDetail, exact: true },
    { path: '/index/level', component: Level, exact: true },
    { path: '/index/system', component: System, exact: true },
    { path: '/index/agent', component: Agent, exact: true },
    { path: '/index/manage', component: UserManage, exact: true },
    { path: '/index/manage/userForm', component: UserForm, exact: true },
    { path: '/index/*', component: NoMatch, exact: true },

];


export const IndexRouters = () => (
    <Router>
        <Switch>
            {IndexRouterMap.map((router)=>
                <Route key={router.path} exact={router.exact} path={router.path} component={router.component}/>
            )}
        </Switch>
    </Router>
);
export const Routers = () => (
    <Router>
        <Switch>
            {routerMap.map((router)=>
                <Route key={router.path} exact={router.exact} path={router.path} component={router.component}/>
            )}
        </Switch>
    </Router>
);


