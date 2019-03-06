import * as types from './mutations-types';

const mutations = {
  [types.SET_USERINFO](state, payload) {
    state.userinfo = payload;
  }
};

export default mutations;
