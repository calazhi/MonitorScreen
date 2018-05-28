import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'

import '@/assets/css/common.css'
import '@/assets/js/utils/justify-page-view'

new Vue({
  render: h => h(App)
}).$mount('#app')
