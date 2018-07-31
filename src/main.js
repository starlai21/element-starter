import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

import router from './router'
import Mock from './mock'
import store from './store'
import axios from 'axios'

// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (window.localStorage.getItem('token')) {
            config.headers.Authorization = localStorage.getItem('token');
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });


axios.interceptors.response.use(
    (response) => {
            // 判断一下响应中是否有 token，如果有就直接使用此 token 替换掉本地的 token。你可以根据你的业务需求自己编写更新 token 的逻辑
            var token = response.headers.authorization
            if (token) {
                // 如果 header 中存在 token，那么触发 refreshToken 方法，替换本地的 token
                // store.commit('refreshToken', token);
                console.log('token refreshed.');
            }
            return response
        }, (error) => {
            switch (error.response.status) {
                
                // 如果响应中的 http code 为 401，那么则此用户可能 token 失效了之类的，我会触发 logout 方法，清除本地的数据并将用户重定向至登录页面
                case 401:
                    // store.commit('logout');
                   	console.log('token expired');
                    // Swal({
                    //     type: 'error',
                    //     title: 'The token is expired, please log in again.'
                    // });
                    break
                // 如果响应中的 http code 为 400，那么就弹出一条错误提示给用户
                case 400:
                    //return this.$Message.error(error.response.data.error)
                    break
                default:
                    //console.log(error.response);
            }
            return Promise.reject(error)
        })


// Mock.init()

Vue.config.productionTip = false
Vue.use(ElementUI)


if (localStorage.getItem('token'))
	store.commit('setToken',localStorage.getItem('token'));
if (localStorage.getItem('username'))
	store.commit('setUsername',localStorage.getItem('username'));


new Vue({
  el: '#app',
  store: store,
  router: router,
  render: h => h(App)
})
