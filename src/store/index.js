import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router.js'
Vue.use(Vuex);

const store = new Vuex.Store({
    state : {
    	token: ''
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
        	router.push({path:'/login'});
        }

    }

});
export default store;