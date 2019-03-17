import {
  get,
  post
} from '@/util/http';
export const getBookList = params => post('/book/getBookList', params);
export const deleteBooks = params => post('/book/deleteBooks', params);
export const getAllClassify = () => post('/book/getAllClassify');
export const deleteClassify = params => post('/book/deleteClassify', params);
export const updateBook = (params, config) => post('/book/updateBook', params, config);
export const insertBook = (params, config) => post('/book/insertBook', params, config);
export const addClassify = params => post('/book/addClassify', params);
export const uploadExcel = (params, config) => post('/book/uploadExcel', params, config);
export const downloadBookTemplate = (params, config) => post('/book/downloadBookTemplate', params, config);
export const changeBookSellStatus = params => post('/book/changeBookSellStatus', params);
export const updateBookStock = params => post('/book/updateBookStock', params);
