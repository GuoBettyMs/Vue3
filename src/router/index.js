//src/router/index.js

// 1. 导入方式变更
import { createRouter, createWebHistory } from 'vue-router'

// 2. 导入组件
//如果项目结构是单文件组件（.vue），文件名本身就是组件名
const Home = () => import('../components/Home.vue')
const TestComponent= () => import('../components/test/TestComponent.vue')

// 3. 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 history 模式
  routes: [
    // { path: '/', component: Home }, //Vue 3 Router 中，exact 被移除了。'/' 现在默认只匹配 '/'
    { path: '/input', component: () => import('../components/InputComponent.vue') },
    { path: '/select', component: () => import('../components/SelectComponent.vue') },
    { path: '/contact', component: () => import('../components/ContactComponent.vue')  },
    { path: '/video', component: () => import('../components/VideoComponent.vue') },
    {
      path: '/home', 
      component: Home,
      //当访问 http://.../home?userId=888 时，Home 组件接收到的 userId 为 888
      //当访问 http://.../home (无参数) 时，Home 组件接收到的 userId 为默认值 111
      props: route => ({ userId: route.query.userId || '111' }) // 传递props到Home组件
    },
    { 
      path: '/about/:methods_id?',  // 可选参数
      component: () => import('../components/AboutComponent.vue') ,
      name: 'about',  // 命名路由
      props: true  // 启用props传递
    },
    {
      path: '/',
      redirect: '/test' //当用户访问根路径 / 时，自动将其重定向到 /test,这样用户的浏览器地址栏会变成 xxx/test
    }, 
    { path: '/test', 
      component: TestComponent,//当用户访问路径 /test 时，显示组件 Test
      children: [
        {
            // 默认子路由, 访问 /test 时自动跳到 /test/tableview, 返回 TestTableviewComponent.js 里的 default 组件
            path: '',
            redirect: '/test/settings' //  重定向到 'group'
        },
        {
            // 访问 /test/tableview 时显示, 文件使用的是 export default { ... }
            //如果该文件使用的是 export const TestTableview = { ... } (具名导出)，则路由配置必须改为：
            //component: () => import('../components/TestTableviewComponent.js').then(m => m.TestTableview)
            path: 'tableview',
            name: 'TestTableview',
            component: () => import('../components/test/TestTableviewComponent.vue')// 懒加载
        },
        {
            path: 'group',
            name: 'Group',
            // 动态导入并选择特定的导出
            component: () => import('../components/test/TestNumerickeypadCompnent.vue')
        },
        {
            path: 'settings',
            name: 'Settings',
            component: () => import('../components/test/TestSelectdropdownComponent.vue')
        },
        {
            path: 'star',
            name: 'Star',
            component: { template: '<div>Star Page</div>' } // 临时占位，防止报错
        },
        {
            path: 'like',
            name: 'Like',
            component: { template: '<div>Like Page</div>' } // 临时占位
        }
      ]
    }, 
  ]
})
    
export default router
