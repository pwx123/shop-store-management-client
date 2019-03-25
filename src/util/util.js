import {
  Message
} from "element-ui";

export const mobileReg = /^1[3456789]\d{9}$/;
export const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
export const decimalReg = /^\d+(\.\d{0,2})?$/;


export function emailCheck(email) {
  let emailreg = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  return emailreg.test(email);
}

export function pwdCheck(pwd) {
  let pwdreg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
  return pwdreg.test(pwd);
}

export function phoneNumCheck(phoneNUm) {
  let phoneNumreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  return phoneNumreg.test(phoneNUm);
}

export function stringCheck(string) {
  let result = removeSpace(string);
  return result.length !== 0;
}

export function removeSpace(string) {
  var result;
  result = string.trim();
  result = result.replace(/\s/g, "");
  return result;
}

/**
 * 时间补0
 *
 * @export
 * @param {*} val
 * @returns
 */
export function set2(val) {
  return val > 10 ? val : "0" + val;
}

/**
 * 时间格式化 'yyyy-MM-dd HH:mm:ss'
 *
 * @export
 * @param {Date} time 可选 时间
 * @param {Boolean} showTime 是否显示时间
 * @returns string
 */
export function timeFormat(time, showTime) {
  let date = time ? new Date(time) : new Date();
  let year = date.getFullYear();
  let month = set2(date.getMonth() + 1);
  let day = set2(date.getDate());
  let hour = set2(date.getHours());
  let minutes = set2(date.getMinutes());
  let seconds = set2(date.getSeconds());
  let str = `${year}-${month}-${day}`;
  str += (showTime ? ` ${hour}:${minutes}:${seconds}` : "");
  return str;
}

/**
 * 获取距离今天x天的时间
 *
 * @export
 * @param {Number} num 前/后几天
 * @param {Boolean} showTime 是否显示时间
 * @returns string
 */
export function getSomeFormatTime(num, showTime) {
  let date = new Date();
  date.setDate(date.getDate() + num);
  return timeFormat(date, showTime);
}

/**
 * 获取datePicker 时间
 *
 * @param {Number} num 相差的天数
 * @returns Array
 */
export function getDatePickerTime(num) {
  let arr = [];
  arr[0] = getSomeFormatTime(-num) + " 00:00:00";
  arr[1] = timeFormat() + " 23:59:59";
  return arr;
}

/**
 * 错误处理
 *
 * @export
 * @param {*} error
 */
export function handleError(error) {
  let msg = "系统错误";
  if (error && error.errorMsg) {
    msg = error.errorMsg;
  }
  Message({
    message: msg,
    type: "error"
  });
}

/**
 * 去除空格
 *
 * @export
 * @param {*} str
 * @returns
 */
export function tirmAll(str) {
  return str.replace(/\s+/g, "");
}
