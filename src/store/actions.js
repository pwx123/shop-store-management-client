import * as types from './mutations-types';
import {
  getUserInfo
} from './../api/common';

const actions = {
  getUserInfoActions({
    commit
  }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        if (res.errorCode === 200) {
          commit(types.SET_USERINFO, res.data);
          resolve();
        } else {
          reject(res);
        }
      }).catch(error => {
        reject(error);
      });
    })
  }
}

export default actions;
