import {
  get,
  post
} from "./../util/http";

// 分页获取订单信息
export const getOrderList = params => post("/order/getOrderList", params);
// 根据订单号查询订单
export const getOrderByOrderId = params => post("/order/getOrderByOrderId", params);
// 确认待确认的订单
export const submitOrder = params => post("/order/submitOrder", params);
// 上传物流信息
export const submitDeliveryInfo = params => post("/order/submitDeliveryInfo", params);
// 新增收货地址
export const submitAddAddress = params => post("/order/submitAddAddress", params);
// 处理退款订单
export const submitRefundInfo = params => post("/order/submitRefundInfo", params);
// 分页查询退款订单
export const getRefundRecord = params => post("/order/getRefundRecord", params);
// 获取所有物流公司
export const getAllDeliveryCompany = () => post("/order/getAllDeliveryCompany");
// 更新订单的收货地址
export const updateOrderAddress = params => post("/order/updateOrderAddress", params);
// 删除物流公司
export const deleteDeliveryCompany = params => post("/order/deleteDeliveryCompany", params);
// 添加物流公司
export const addDeliveryCompany = params => post("/order/addDeliveryCompany", params);
// 上传物流Excel
export const uploadDeliveryExcel = (params, config) => post("/order/uploadDeliveryExcel", params, config);
// 下载物流上传模板
export const downloadDeliveryTemplate = (params, config) => post("/order/downloadDeliveryTemplate", params, config);
