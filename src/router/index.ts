import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/graphs/create',
      name: 'graph-create',
      component: () => import('@/components/Graph/create.vue')
    },
    {
      path: '/graphs/:id/edit',
      name: 'graph-edit',
      component: () => import('@/components/Graph/edit.vue')
    },
    {
      path: '/graphs/:id/statistics',
      name: 'graph-stats',
      component: () => import('@/components/Graph/statistics.vue')
    }
  ]
})

export default router
