import {
  get,
  post
} from "./../util/http";

// 获取图书列表
export const getBookList = params => post("/book/getBookList", params);
// 删除列表中的图书
export const deleteBooks = params => post("/book/deleteBooks", params);
// 获取所有图书分类
export const getAllClassify = () => post("/book/getAllClassify");
// 删除分类
export const deleteClassify = params => post("/book/deleteClassify", params);
// 更新图书
export const updateBook = (params, config) => post("/book/updateBook", params, config);
// 插入图书
export const insertBook = (params, config) => post("/book/insertBook", params, config);
// 添加分类
export const addClassify = params => post("/book/addClassify", params);
// 批量上传Excel
export const uploadExcel = (params, config) => post("/book/uploadExcel", params, config);
// 下载批量上传模板
export const downloadBookTemplate = (params, config) => post("/book/downloadBookTemplate", params, config);
// 更改图书售卖状态
export const changeBookSellStatus = params => post("/book/changeBookSellStatus", params);
// 更新图书库存
export const updateBookStock = params => post("/book/updateBookStock", params);
// 分页查询进货记录
export const getStockRecordList = params => post("/book/getStockRecordList", params);
