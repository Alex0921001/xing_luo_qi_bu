export default [
  {
    path: '/home',
    name: 'home',
    component: () => import('@render/views/home/index.vue'),
    meta: {
      title: '首页'
    }
  }
]
