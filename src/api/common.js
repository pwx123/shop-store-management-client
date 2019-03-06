import {
  get,
  post
} from '@/util/http';
export const getPublicKey = () => post('/getPublicKey');
export const getUserInfo = () => post('/getUserInfo');
