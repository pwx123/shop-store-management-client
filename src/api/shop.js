import {
  get,
  post
} from '@/util/http';
export const getShopInfo = () => post('/shop/getShopInfo');
export const updateShopName = params => post('/shop/updateShopName', params);
export const changeShopStatus = params => post('/shop/changeShopStatus', params);
export const updateShopDescription = params => post('/shop/updateShopDescription', params);
