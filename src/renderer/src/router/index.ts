import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import routers from './modules/index'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@render/layout/index.vue'),
    children: [...routers],
    redirect: '/home',
    meta: {
      title: 'layout'
    }
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: {
      title: 'NotFound'
    },
    redirect: '/'
  }
]
const router = createRouter({
  history: createWebHashHistory(''),
  routes
})

export function setupRouter(app: App) {
  app.use(router)
}
export default router
