import {
  get,
  post
} from '@/util/http';
export const getBookList = params => post('/book/getBookList', params);
export const deleteBooks = params => post('/book/deleteBooks', params);
export const getAllClassify = () => post('/book/getAllClassify');
export const deleteClassify = params => post('/book/deleteClassify', params);
