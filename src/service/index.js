import {get,post,log,postFormData} from '@src/utils/utils';
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
//图片上传
export function upload(data){
    return postFormData('/file/upload',data);
}
//新增/编辑商品
export function saveProduct(data){
    return get('/product/info/save',data);
}
//删除商品
export function deleteProduct(data){
    return get('/product/info/delete',data);
}
//商品价格列表
export function fetchPriceList(data){
    return get('/product/price/list',data);
}
//新增/保存价格
export function savePrice(data){
    return get('/product/price/save',data);
}
//新增/保存价格
export function fetchLevelList(data){
    return get('/seller/level/list',data);
}
//删除价格
export function deletePrice(data){
    return get('/product/price/delete',data);
}
//获取库存记录
export function fetchInventoryList(data){
    return get('/product/inventory/list',data);
}
//新增/保存库存记录
export function saveInventoryRecord(data){
    return get('/product/inventory/save',data);
}
//新增/保存库存记录
export function deleteInventoryRecord(data){
    return get('/product/inventory/delete',data);
}