import {get,post,log} from '@src/utils/utils';
//登录
export function login(data){
    return get('/user/login',data);
}
//获取用户列表
export function getUserList(data){
    return get('/user/list',data);
}
//禁用用户
export function deactivateUser(data){
    return get('/user/deactivate',data);
}
//激活用户
export function activeUser(data){
    return get('/user/active',data);
}
//激活用户
export function deleteUser(data){
    return get('/user/delete',data);
}
//保存/新增用户
export function saveUser(data){
    return get('/user/save',data);
}
//具体类别的列表
export function fetchCategoryList(data){
    return get('/category/list',data);
}
//类别列表
export function fetchCategoryType(data){
    return get('/category/types',data);
}
//删除类别
export function deleteCategory(data){
    return get('/category/delete',data);
}
//新增/编辑类别
export function saveCategory(data){
    return get('/category/save',data);
}
//商品列表
export function fetchProductList(data){
    return get('/product/info/list',data);
}