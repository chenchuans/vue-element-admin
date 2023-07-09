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
        name: '线索列表',
        component: () => import('@/views/clue'),
        meta: { title: '线索列表', icon: 'dashboard' }
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
      {
        path: 'index1',
        name: '未接通/关机/空号/挂断',
        component: () => import('@/views/collect1'),
        meta: { title: '未接通/关机/空号/挂断', icon: 'dashboard' }
      },
      {
        path: 'index2',
        name: '明确不需要',
        component: () => import('@/views/collect1'),
        meta: { title: '明确不需要', icon: 'dashboard' }
      },
      {
        path: 'index3',
        name: '待会联系',
        component: () => import('@/views/collect1'),
        meta: { title: '待会联系', icon: 'dashboard' }
      },
      {
        path: 'index4',
        name: '加微未通过',
        component: () => import('@/views/collect1'),
        meta: { title: '加微未通过', icon: 'dashboard' }
      },
      {
        path: 'index5',
        name: '加微信未下载',
        component: () => import('@/views/collect1'),
        meta: { title: '加微信未下载', icon: 'dashboard' }
      },
      {
        path: 'index6',
        name: '已下载',
        component: () => import('@/views/collect1'),
        meta: { title: '已下载', icon: 'dashboard' }
      },
      {
        path: 'index7',
        name: '苹果手机',
        component: () => import('@/views/collect1'),
        meta: { title: '苹果手机', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/public',
    component: Layout,
    redirect: '/public/index',
    name: '数据池',
    meta: { title: '数据池', icon: 'dashboard' },
    children: [
      {
        path: 'index',
        name: '公海列表',
        component: () => import('@/views/public'),
        meta: { title: '公海列表', icon: 'dashboard' },
        roles: ['SUPER_ADMIN']
      },
      {
        path: 'all',
        name: '所有数据',
        component: () => import('@/views/alldata'),
        meta: { title: '所有数据', icon: 'dashboard' }
      },
      {
        path: 'library',
        name: '在库数据',
        component: () => import('@/views/libraryData'),
        meta: { title: '在库数据', icon: 'dashboard' },
        roles: ['SUPER_ADMIN']
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
    roles: ['SUPER_ADMIN']
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
    roles: ['SUPER_ADMIN']
    // roles: 向下管理
  },

  {
    path: '/achieve',
    component: Layout,
    redirect: '/achieve/index',
    children: [
      {
        path: 'index',
        name: '业绩管理',
        component: () => import('@/views/achieve'),
        meta: { title: '业绩管理', icon: 'dashboard' }
      }
    ],
    roles: ['SUPER_ADMIN']
  },

  {
    path: '/rank',
    component: Layout,
    redirect: '/rank/today',
    name: '业绩排行',
    meta: { title: '业绩排行', icon: 'dashboard' },
    roles: ['SUPER_ADMIN'],
    children: [
      {
        path: 'today',
        name: '今日排行',
        component: () => import('@/views/todayrank'),
        meta: { title: '今日排行', icon: 'dashboard' }
      },
      {
        path: 'rank',
        name: '业绩详情',
        component: () => import('@/views/rank'),
        meta: { title: '业绩详情', icon: 'dashboard' }
      },
      {
        path: 'detail',
        name: '业绩明细',
        component: () => import('@/views/rankdetail'),
        meta: { title: '业绩明细', icon: 'dashboard' },
        roles: ['SUPER_ADMIN']
      }
    ]
  },

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
