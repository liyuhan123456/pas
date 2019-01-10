import {observable,action} from 'mobx';
const appState = observable({
    selectedKey: ['/home'],
    isLogin: false,
    history: null
});
appState.toggleKey = action((key)=>{
    appState.selectedKey = [key]
});
appState.login = action(()=>{
    appState.isLogin = true
});
appState.logout = action(()=>{
    appState.isLogin = false
});

appState.setHistory = action((history)=>{
    appState.history = history
});

export default appState;