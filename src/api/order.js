import {
  get,
  post
} from "./../util/http";

export const getOrderList = params => post("/order/getOrderList", params);
export const getOrderByOrderId = params => post("/order/getOrderByOrderId", params);
export const submitOrder = params => post("/order/submitOrder", params);
export const submitDeliveryInfo = params => post("/order/submitDeliveryInfo", params);
export const submitAddAddress = params => post("/order/submitAddAddress", params);
export const submitRefundInfo = params => post("/order/submitRefundInfo", params);
export const getRefundRecord = params => post("/order/getRefundRecord", params);
export const getAllDeliveryCompany = () => post("/order/getAllDeliveryCompany");
export const updateOrderAddress = params => post("/order/updateOrderAddress", params);
export const deleteDeliveryCompany = params => post("/order/deleteDeliveryCompany", params);
export const addDeliveryCompany = params => post("/order/addDeliveryCompany", params);
export const uploadDeliveryExcel = (params, config) => post("/order/uploadDeliveryExcel", params, config);
export const downloadDeliveryTemplate = (params, config) => post("/order/downloadDeliveryTemplate", params, config);
