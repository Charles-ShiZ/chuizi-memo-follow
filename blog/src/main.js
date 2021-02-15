import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './quasar'
// import './vue-quill-editor'
// import './highlight'

Vue.prototype.$axios = axios.create({
  baseURL: 'http://182.61.19.98:3000'
})
Vue.prototype.$baseURL = 'http://182.61.19.98:3000'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
