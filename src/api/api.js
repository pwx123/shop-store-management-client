import { get, post } from '@/util/http';
export const login = params => post('login', params);
export const reg = params => post('reg', params);
