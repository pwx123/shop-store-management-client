import {
  get,
  post
} from "./../util/http";

export const login = params => post("/admin/login", params);
export const register = params => post("/admin/register", params);
export const logout = () => post("/admin/logout");
export const updateNickname = params => post("/admin/updateNickname", params);
export const updatePassword = params => post("/admin/updatePassword", params);
export const updateAvatar = (params, config) => post("/admin/updateAvatar", params, config);
