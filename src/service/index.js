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
//获取级别列表
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
//删除库存记录
export function deleteInventoryRecord(data){
    return get('/product/inventory/delete',data);
}
//新增/保存级别
export function saveLevel(data){
    return get('/seller/level/save',data);
}
//删除级别
export function deleteLevel(data){
    return get('/seller/level/delete',data);
}
//系统配置列表
export function fetchConfigList(data){
    return get('/config/list',data);
}
//新增/保存配置
export function saveConfig(data){
    return get('/config/save',data);
}
//删除配置
export function deleteConfig(data){
    return get('/config/delete',data);
}
//系统配置列表
export function fetchAgentList(data){
    return get('/seller/info/list',data);
}
//新增/保存配置
export function saveAgent(data){
    return get('/seller/info/save',data);
}
//删除配置
export function deleteAgent(data){
    return get('/seller/info/delete',data);
}
//查询代理商
export function queryAgent(data){
    return get('/seller/info/query',data);
}
//查询订单列表
export function fetchOrderList(data){
    return get('/order/info/list',data);
}
//删除订单
export function deleteOrder(data){
    return get('/order/info/delete',data);
}
//订单详情
export function fetchOrderDetail(data){
    return get('/order/info/detail',data);
}
//保存订单
export function saveOrder(data){
    return post('/order/info/save',data);
}
//获取代理商订单
export function fetchAgentOrder(data){
    return get('/order/info/list_by_seller',data);
}
//获取代理商订单
export function fetchAgentDetail(data){
    return get('/seller/info/detail',data);
}
//获取提成列表
export function fetchBonusList(data){
    return get('/seller/bonus/list',data);
}
//修改提成状态
export function updateBonusStatus(data){
    return get('/seller/bonus/status',data);
}
//获取代理商提成列表
export function fetchAgentBonusList(data){
    return get('/seller/bonus/list_by_seller',data);
}