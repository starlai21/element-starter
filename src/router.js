import Vue from 'vue'
import VueRouter from 'vue-router'
import Auditing from './components/Auditing.vue'
import Audited from './components/Audited.vue'
Vue.use(VueRouter);

const routes = [
  { path: '/auditing', component: Auditing },
  { path: '/audited', component: Audited }
]


const router = new VueRouter({
  routes
})

export default router