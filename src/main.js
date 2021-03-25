import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from '../htttp'
import ElementUI from 'element-ui';
import TreeTable from 'vue-table-with-tree-grid';
import 'element-ui/lib/theme-chalk/index.css';
import './global.css'
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.component('tree-table', TreeTable);
Vue.prototype.$http = http
new Vue({
  render: h => h(App),
  router
}).$mount('#app')