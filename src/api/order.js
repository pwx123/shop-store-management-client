import {
  get,
  post
} from '@/util/http';
export const getOrderList = params => post('/order/getOrderList', params);
