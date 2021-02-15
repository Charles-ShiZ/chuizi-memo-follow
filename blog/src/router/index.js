import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/Login' },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/Blog',
    name: 'Blog',
    component: () => import('../pages/Blog.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes,
  base: process.env.BASE_URL
})

export default router
