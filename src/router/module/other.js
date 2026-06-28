import { TEST_PLATFORM } from '@/config'
import NoWallet from '@/views/other/no-wallet.vue'
import AppDownload from '@/views/other/app-download.vue'

/*
 * 其他页面 例如 404
 */
const routes = [
  // 非钱包进入
  {
    path: '/no-wallet',
    name: 'NoWallet',
    component: NoWallet
  },
  // APP下载
  {
    path: '/app',
    name: 'AppDownload',
    component: AppDownload
  }
]

if (TEST_PLATFORM.includes(import.meta.env.VITE_APP_ENV)) {
  // 允许测试平台
  routes.push({
    path: '/platform',
    name: 'Platform',
    component: () => import('@/views/other/platform.vue')
  })
}
export default routes
