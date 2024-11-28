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
        path: 'managegongs',
        name: 'managegongs',
        component: () => import('@renderer/views/settings/managegongs.vue')
      },
      {
        path: 'managegans',
        name: 'managegans',
        component: () => import('@renderer/views/settings/managegans.vue')
      },
      {
        path: 'managedizhis',
        name: 'managedizhis',
        component: () => import('@renderer/views/settings/managedizhis.vue')
      },
      {
        path: 'common',
        name: 'common',
        component: () => import('@renderer/views/settings/common.vue')
      }
    ]
  }
]
