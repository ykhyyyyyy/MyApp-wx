import App from './App'
import config from './config'
import request from './utils/request'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import store from './store'

Vue.config.productionTip = false
// 挂载全局配置和请求工具
Vue.prototype.$config = config
Vue.prototype.$api = request

App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createStore } from 'vuex'
import storeOptions from './store'

export function createApp() {
  const app = createSSRApp(App)
  const store = createStore(storeOptions)
  
  // 挂载全局配置和请求工具
  app.config.globalProperties.$config = config
  app.config.globalProperties.$api = request
  
  app.use(store)
  return {
    app,
    store
  }
}
// #endif