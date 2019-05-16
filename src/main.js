import Vue from "vue";
// import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueClipboard from "vue-clipboard2";
import VueSocketio from "vue-socket.io";
import socketIOClient from "socket.io-client";
import App from "./App";
import router from "./router";
import store from "./store";


Vue.config.productionTip = false;
Vue.prototype.$basePath = "http://127.0.0.1";

Vue.use(new VueSocketio({
  connection: socketIOClient("http://127.0.0.1:3000/", {
    autoConnect: false
  })
}));

Vue.filter("money", function (value) {
  let val = parseFloat(value);
  if (isNaN(val)) {
    return val;
  } else {
    return `￥${val.toFixed(2)}`;
  }
});

// Vue.use(ElementUI);
Vue.use(VueClipboard);

new Vue({
  el: "#app",
  router,
  store,
  components: {
    App
  },
  template: "<App/>"
});
