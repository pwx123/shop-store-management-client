const getters = {
  userInfo: state => {
    state.userInfo.avatarUrl = state.userInfo.avatarUrl ? state.userInfo.avatarUrl + '?=' + new Date().getTime() : state.userInfo.avatarUrl;
    console.log(state.userInfo)
    return state.userInfo;
  }
};
export default getters;
