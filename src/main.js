import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

import router from './router'
import Mock from './mock'
import store from './store'




Mock.init()

Vue.config.productionTip = false
Vue.use(ElementUI)


if (localStorage.getItem('token'))
	store.commit('setToken',localStorage.getItem('token'));


new Vue({
  el: '#app',
  store: store,
  router: router,
  render: h => h(App)
})
