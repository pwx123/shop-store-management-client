import {
  get,
  post
} from "./../util/http";

// 登录
export const login = params => post("/admin/login", params);
// 注册
export const register = params => post("/admin/register", params);
// 注销
export const logout = () => post("/admin/logout");
// 更改管理员昵称
export const updateNickname = params => post("/admin/updateNickname", params);
// 更改密码
export const updatePassword = params => post("/admin/updatePassword", params);
// 更改头像
export const updateAvatar = (params, config) => post("/admin/updateAvatar", params, config);
