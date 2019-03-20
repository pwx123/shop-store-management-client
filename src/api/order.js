import {
  get,
  post
} from '@/util/http';
export const getOrderList = params => post('/order/getOrderList', params);
export const submitOrder = params => post('/order/submitOrder', params);
export const submitDeliveryInfo = params => post('/order/submitDeliveryInfo', params);
export const getAllDeliveryCompany = () => post('/order/getAllDeliveryCompany');
export const deleteDeliveryCompany = params => post('/order/deleteDeliveryCompany', params);
export const addDeliveryCompany = params => post('/order/addDeliveryCompany', params);
export const uploadDeliveryExcel = (params, config) => post('/order/uploadDeliveryExcel', params, config);
export const downloadDeliveryTemplate = (params, config) => post('/order/downloadDeliveryTemplate', params, config);
