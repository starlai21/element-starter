import Vue from 'vue'
import VueRouter from 'vue-router'
import Auditing from './components/Auditing.vue'
import Audited from './components/Audited.vue'
import AbnormalCall from './components/AbnormalCall.vue'
import ChangePassword from './components/ChangePassword.vue'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import store from './store'

Vue.use(VueRouter);

const routes = [


  { path: '/', 
    component: Home, 
    meta: { requireAuth: true},
    children: [
      {
        path: 'auditing',
        component: Auditing
      },
      {
        path: 'audited',
        component: Audited
      },
      {
        path: 'changePassword',
        component: ChangePassword
      },
      {
        path: 'abnormalCall',
        component: AbnormalCall
      }
    ]

  },

  { path: '/login', 
    component: Login 
  },
  {
    path: '*',
    redirect:'/'
  }
]


const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next) => {
    if(to.matched.some(m => m.meta.requireAuth)){

        if (store.getters.isLogined){
            next();
        }else {
            next({
                path : '/login',
                query : {redirect : to.fullPath}
            })
        }
    }else {
        next()
    }
});

export default router