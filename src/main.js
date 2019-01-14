import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
