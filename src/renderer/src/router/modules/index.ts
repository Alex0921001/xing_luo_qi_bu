export default [
  {
    path: '/home',
    name: 'home',
    component: () => import('@renderer/views/home/index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/noauto',
    name: 'noauto',
    component: () => import('@renderer/views/noAuto/index.vue'),
    meta: {
      title: '手动排盘'
    }
  }
]
