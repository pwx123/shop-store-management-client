import {
  get,
  post
} from '@/util/http';
export const getShopUserInfo = params => post('/user/getShopUserInfo', params);
export const getUserDeliveryAddress = params => post('/user/getUserDeliveryAddress', params);
export const changeUserStatus = params => post('/user/changeUserStatus', params);
export const resetUserPwd = params => post('/user/resetUserPwd', params);
export const getOrderAddressById = params => post('/user/getOrderAddressById', params);
