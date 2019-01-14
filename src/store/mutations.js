import * as types from './mutations-types';

const mutations = {
  [types.SET_GOOD_MUTATION](state, payload) {
    state.good = payload;
  }
};

export default mutations;
