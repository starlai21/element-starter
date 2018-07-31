import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router.js'
Vue.use(Vuex);

const store = new Vuex.Store({
    state : {
    	token: '',
        username: ''
    },
    getters :{
        isLogined(state){
            return state.token !== '';
        }
    },
    mutations : {
        // 保存jwt认证后的token和expire
        setToken(state,token) {
            // state.userInfo.expire = payload.expire;
            state.token = token;
            localStorage.setItem('token',token);
        },
        logout(state){
        	state.token = '';
        	localStorage.removeItem('token');
            localStorage.removeItem('username');
        	router.push({path:'/login'});
        },
        setUsername(state, name){
            state.username = name;
            localStorage.setItem("username", name);
        }

    }

});
export default store;