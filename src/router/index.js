import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
   {
    path: '/grade',
    name: 'grade',
    component: () => import(/* webpackChunkName: "grade" */ '../views/Grade.vue')
  },  {
    path: '/api-golds',
    name: 'api-golds',
    component: () => import(/* webpackChunkName: "api-golds" */ '../views/Api_golds.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkExactActiveClass: 'active',
  routes
})


export default router
