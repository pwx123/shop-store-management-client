import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueClipboard from 'vue-clipboard2'
import App from './App';
import router from './router';
import store from './store';


Vue.config.productionTip = false
Vue.prototype.$basePath = 'http://127.0.0.1'

Vue.use(ElementUI);
Vue.use(VueClipboard)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
