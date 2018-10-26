import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router.js'
Vue.use(Vuex);

const store = new Vuex.Store({
    state : {
    	token: '',
        username: '',
        isAdmin:false
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
            localStorage.removeItem('isAdmin');
            state.isAdmin = false;
        	router.push({path:'/login'});
        },
        setUsername(state, name){
            state.username = name;
            localStorage.setItem("username", name);
        },
        setIsAdmin(state, isAdmin){
            state.isAdmin = isAdmin;
            localStorage.setItem("isAdmin",isAdmin);
        }


    }

});
export default store;