import {
  get,
  post
} from "./../util/http";

export const getPublicKey = () => post("/getPublicKey");
export const getUserInfo = () => post("/getUserInfo");
export const getProvince = () => post("/getProvince");
export const getCityByProvince = params => post("/getCityByProvince", params);
export const getCountryByCity = params => post("/getCountryByCity", params);
