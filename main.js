import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import store from './store'

Vue.config.productionTip = false
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
  app.use(store)
  return {
    app,
    store
  }
}
// #endif