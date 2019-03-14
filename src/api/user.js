import {
  get,
  post
} from '@/util/http';
export const getShopUserInfo = params => post('/user/getShopUserInfo', params);
