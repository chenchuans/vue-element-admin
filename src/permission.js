import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const { userName = '' } = JSON.parse(localStorage.getItem('loginInfo') || '{}')
  // userRole  SUPER_ADMIN
  // if (userName) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/dashboard/index' })
  //   } else {
  //     const jumpto = () => {
  //       let routeState = false
  // 业绩管理、员工管理 只有普通员工不可见
  // if (userRole === 'COMMON_USER' && (to.path.includes('/rank/detail') || to.path.includes('/admin'))) {
  //   routeState = true
  // }
  //       if (userRole !== 'SUPER_ADMIN' && (
  //         to.path.includes('/depart') ||
  //         to.path.includes('/rank/detail') ||
  //         to.path.includes('/admin')
  //       )) {
  //         routeState = true
  //       }
  //       return routeState
  //     }
  //     if (jumpto()) {
  //       next({ path: '/dashboard/index' })
  //     } else {
  //       next()
  //     }
  //   }
  // } else {
  //   if (to.path !== '/login') {
  //     next({ path: '/login' })
  //   } else {
  //     next()
  //   }
  // }

  if (!userName && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
