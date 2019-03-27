import {
  get,
  post
} from "./../util/http";

// 获取公钥
export const getPublicKey = () => post("/getPublicKey");
// 获取登录用户信息
export const getUserInfo = () => post("/getUserInfo");
// 获取省份
export const getProvince = () => post("/getProvince");
// 根据省份id获取市
export const getCityByProvince = params => post("/getCityByProvince", params);
// 根据市id获取县
export const getCountryByCity = params => post("/getCountryByCity", params);
// 根据物流单号获取物流信息
export const getDeliveryInfoById = params => post("/getDeliveryInfoById", params);
