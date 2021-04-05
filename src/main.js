import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from '../htttp'
import ElementUI from 'element-ui';
import TreeTable from 'vue-table-with-tree-grid';
import 'element-ui/lib/theme-chalk/index.css';
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './global.css'
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueQuillEditor);
Vue.component('tree-table', TreeTable);
Vue.prototype.$http = http
Vue.filter('dateFormate', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')