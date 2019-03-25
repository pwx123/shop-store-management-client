const getters = {
  userInfo: state => {
    state.userInfo.avatarUrl = state.userInfo.avatarUrl ? state.userInfo.avatarUrl + "?=" + new Date().getTime() : state.userInfo.avatarUrl;
    return state.userInfo;
  }
};
export default getters;
