import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    children: [
      {
        path: 'index',
        name: '首咨数据',
        component: () => import('@/views/clue'),
        meta: { title: '首咨数据', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/lunzhuan',
    component: Layout,
    redirect: '/lunzhuan/index',
    children: [
      {
        path: 'index',
        name: '轮转数据',
        component: () => import('@/views/clue'),
        meta: { title: '轮转数据', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/collect',
    component: Layout,
    redirect: '/collect/index1',
    name: '转化跟进',
    meta: { title: '转化跟进', icon: 'dashboard' },
    children: [
      // {
      //   path: 'index',
      //   name: '所有跟进',
      //   component: () => import('@/views/collect'),
      //   meta: { title: '所有跟进', icon: 'dashboard' },
      // },
      // {
      //   path: 'index1',
      //   name: 'A类数据',
      //   component: () => import('@/views/collect1'),
      //   meta: { title: 'A类数据', icon: 'dashboard' }
      // },
      // {
      //   path: 'index2',
      //   name: 'B类数据',
      //   component: () => import('@/views/collect1'),
      //   meta: { title: 'B类数据', icon: 'dashboard' }
      // },
      // {
      //   path: 'index3',
      //   name: 'C类数据',
      //   component: () => import('@/views/collect1'),
      //   meta: { title: 'C类数据', icon: 'dashboard' }
      // },
      // {
      //   path: 'index4',
      //   name: 'D类客户',
      //   component: () => import('@/views/collect1'),
      //   meta: { title: 'D类客户', icon: 'dashboard' }
      // },
      // {
      //   path: 'index5',
      //   name: '停机/空号',
      //   component: () => import('@/views/collect1'),
      //   meta: { title: '停机/空号', icon: 'dashboard' }
      // },
      // {
      //   path: 'index6',
      //   name: '未接通/挂断/拒接/关机',
      //   component: () => import('@/views/collect1'),
      //   meta: { title: '未接通/挂断/拒接/关机', icon: 'dashboard' }
      // },
      {
        path: 'index7',
        name: '已成交',
        component: () => import('@/views/collect1'),
        meta: { title: '已成交', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/public',
    component: Layout,
    redirect: '/public/public',
    name: '数据池',
    meta: { title: '数据池', icon: 'dashboard' },
    children: [
      {
        path: 'public',
        name: '公海列表',
        component: () => import('@/views/public'),
        meta: { title: '公海列表', icon: 'dashboard' }
      },
      {
        path: 'all',
        name: '所有数据',
        component: () => import('@/views/public'),
        meta: { title: '所有数据', icon: 'dashboard' },
        roles: ['SUPER_ADMIN']
      },
      {
        path: 'library',
        name: '在库数据',
        component: () => import('@/views/public'),
        meta: { title: '在库数据', icon: 'dashboard' },
        roles: ['SUPER_ADMIN', 'COMMON_ADMIN']
      }
    ]
  },

  {
    path: '/depart',
    component: Layout,
    redirect: '/depart/index',
    children: [
      {
        path: 'index',
        name: '部门管理',
        component: () => import('@/views/depart'),
        meta: { title: '部门管理', icon: 'dashboard' }
      }
    ],
    roles: ['SUPER_ADMIN', 'COMMON_ADMIN']
  },

  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/index',
    children: [
      {
        path: 'index',
        name: '员工管理',
        component: () => import('@/views/admin'),
        meta: { title: '员工管理', icon: 'dashboard' }
      }
    ],
    roles: ['SUPER_ADMIN', 'COMMON_ADMIN']
    // roles: 向下管理
  },

  {
    path: '/admintab',
    component: Layout,
    redirect: '/admintab/index',
    children: [
      {
        path: 'index',
        name: '管理看板',
        component: () => import('@/views/admintab'),
        meta: { title: '管理看板', icon: 'dashboard' }
      }
    ],
    roles: ['SUPER_ADMIN']
  },

  {
    path: '/usertab',
    component: Layout,
    redirect: '/usertab/index',
    children: [
      {
        path: 'index',
        name: '员工看板',
        component: () => import('@/views/usertab'),
        meta: { title: '员工看板', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/message',
    component: Layout,
    redirect: '/message/index',
    children: [
      {
        path: 'index',
        name: '通知中心',
        component: () => import('@/views/message'),
        meta: { title: '通知中心', icon: 'dashboard' }
      }
    ]
  },

  // {
  //   path: '/achieve',
  //   component: Layout,
  //   redirect: '/achieve/index',
  //   children: [
  //     {
  //       path: 'index',
  //       name: '业绩管理',
  //       component: () => import('@/views/achieve'),
  //       meta: { title: '业绩管理', icon: 'dashboard' }
  //     }
  //   ],
  //   roles: ['SUPER_ADMIN']
  // },

  // {
  //   path: '/rank',
  //   component: Layout,
  //   redirect: '/rank/today',
  //   name: '业绩排行',
  //   meta: { title: '业绩排行', icon: 'dashboard' },
  //   roles: ['SUPER_ADMIN'],
  //   children: [
  //     {
  //       path: 'today',
  //       name: '今日排行',
  //       component: () => import('@/views/todayrank'),
  //       meta: { title: '今日排行', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'rank',
  //       name: '业绩详情',
  //       component: () => import('@/views/rank'),
  //       meta: { title: '业绩详情', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'detail',
  //       name: '业绩明细',
  //       component: () => import('@/views/rankdetail'),
  //       meta: { title: '业绩明细', icon: 'dashboard' },
  //       roles: ['SUPER_ADMIN']
  //     }
  //   ]
  // },

  { path: '/', redirect: '/dashboard/index' },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
