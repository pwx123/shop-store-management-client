import { get, post } from '@/util/http';
export const getPublicKey = () => post('/getPublicKey');
export const login = params => post('/admin/login', params);
export const reg = params => post('/admin/reg', params);
