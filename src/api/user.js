import {
  get,
  post
} from "./../util/http";

// 获取店铺用户信息
export const getShopUserInfo = params => post("/user/getShopUserInfo", params);
// 获取店铺用户收货地址
export const getUserDeliveryAddress = params => post("/user/getUserDeliveryAddress", params);
// 改变店铺用户状态
export const changeUserStatus = params => post("/user/changeUserStatus", params);
// 重置店铺用户密码
export const resetUserPwd = params => post("/user/resetUserPwd", params);
// 根据收货地址id查询收货地址信息
export const getOrderAddressById = params => post("/user/getOrderAddressById", params);
