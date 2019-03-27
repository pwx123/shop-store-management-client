import {
  get,
  post
} from "./../util/http";

// 获取店铺信息
export const getShopInfo = () => post("/shop/getShopInfo");
// 更新店铺名
export const updateShopName = params => post("/shop/updateShopName", params);
// 更改店铺状态
export const changeShopStatus = params => post("/shop/changeShopStatus", params);
// 更改店铺描述
export const updateShopDescription = params => post("/shop/updateShopDescription", params);
// 分页获取更改记录
export const getOptionRecord = params => post("/shop/getOptionRecord", params);
