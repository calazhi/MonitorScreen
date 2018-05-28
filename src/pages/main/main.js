import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import Hkcomponents from './hk-packages'
import store from './store'

import '@/assets/css/common.css'
import '@/assets/css/main.css'
// import '@/pages/main/api/mocks/index.js'

import 'hdmap'
import 'hdmap/dist/hdmap.css'
import global_ from '@/assets/js/global'
import '@/assets/js/utils/justify-page-view'
import controller from './controller'

Vue.use(Hkcomponents)
Vue.prototype.GLOBAL = global_

const Bus = new Vue()

controller.init()

new Vue({
  // router
  store,
  data: {
    Bus
  },
  render: h => h(App)
}).$mount('#app')
