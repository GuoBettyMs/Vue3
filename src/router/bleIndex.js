//src/router/bleIndex.js

// 1. 导入方式变更
import { createRouter, createWebHistory } from 'vue-router'
    
const routes = [
  {
    path: '/',
    component: () => import('@/components/MP305/webLinkComponent.vue')
  },
  {
    path: '/mp305',
    component: { template: '<div>Like Page</div>' } // 临时占位
  },
  {
    path: '/bl8',
    component: { template: '<div>Like Page</div>' } // 临时占位
  },
    {
    path: '/flex-heat',
    component: { template: '<div>Like Page</div>' } // 临时占位
  }
]

const router = createRouter({
  history: createWebHistory(__BASE_PATH__),
  routes
})

export default router
