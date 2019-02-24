import { get, post } from '@/util/http';
export const getBookList = params => post('/book/getBookList', params);
