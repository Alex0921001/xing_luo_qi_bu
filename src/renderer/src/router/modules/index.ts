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
  },
  {
    path: 'settings',
    name: 'settings',
    component: () => import('@renderer/views/settings/index.vue'),
    redirect: '/settings/managestars',
    meta: {
      title: '设置'
    },
    children: [
      {
        path: 'managestars',
        name: 'managestars',
        component: () => import('@renderer/views/settings/managestars.vue')
      },
      {
        path: 'common',
        name: 'common',
        component: () => import('@renderer/views/settings/common.vue')
      }
    ]
  }
]
