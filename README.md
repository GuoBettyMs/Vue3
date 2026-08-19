# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

1. 创建 Vite 项目并选择 Vue((JavaScript) )
npm create vite@latest my-vue3-app -- --template vue

| 模板名称 | 说明 | 命令示例 |
| vue | Vue 3 + JavaScript | `npm create vite@latest project-name -- --template vue` |
| vue-ts | Vue 3 + TypeScript | `npm create vite@latest project-name -- --template vue-ts` |
| react | React + JavaScript | `npm create vite@latest project-name -- --template react` |
| react-ts | React + TypeScript | `npm create vite@latest project-name -- --template react-ts` |
| vanilla | 原生 JavaScript (无框架) | `npm create vite@latest project-name -- --template vanilla` |


2. 进入目录
cd my-vue3-app

3. 安装依赖
npm install

4. 安装 Vue Router v4 (非常重要，Vue 3 不兼容 Vue Router v3)
npm install vue-router@4

5. 创建 src/main.js
import { createApp } from 'vue'
import App from './App.vue' // 你的根组件

// 1. 导入 Vue Router v4
import router from './router'

// 2. 创建应用并使用 router
createApp(App)
  .use(router) // 挂载路由
  .mount('#app') // 挂载到 DOM

6.修改 src/router/index.js：
// 1. 导入方式变更
import { createRouter, createWebHistory } from 'vue-router'

// 2. 导入组件 (注意：Vue 3 推荐使用异步组件)
const Home = () => import('../views/Home.vue')
const Input = () => import('../views/Input.vue')
// ... 其他组件

// 3. 创建路由实例 (语法与 v3 不同)
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 history 模式
  routes: [
    { path: '/', component: Home, exact: true },
    { path: '/input', component: Input },
    { path: '/select', component: () => import('../views/Select.vue') },
    // ... 其他路由
  ]
})

export default router

7.组件语法升级 (Vue 3 Composition API)
将你原本的 .vue 文件（如 HomeComponent）从 Options API 改为 <script setup> 语法。

## 功能特点
- 开发模式: Vue 单文件组件（.vue）
- 开发方式: Vite 软件自动处理代码转换、路径解析和 CSS 加载，浏览器只负责展示结果
    当运行 npm run dev 时，Vite 启动了一个本地服务器（比如 http://localhost:5173）。
    浏览器请求 App.vue。
    Vite 拦截这个请求，在内存中把 App.vue 编译成标准的 JavaScript。
    Vite 把编译好的 JS 发给浏览器, 浏览器完美执行

## 运行项目
方案一：使用 Vite 开发服务器
    - 开发模式: Vue 单文件组件（.vue）
    - 不要直接用 Live Server 打开 HTML 文件。Vite 自带了更强大的开发服务器，它能自动处理模块导入和打包。
    1.停止 Live Server：如果右下角显示 "Port 5500 in use" 或类似提示，先关掉 Live Server。
    2.在 VS Code 终端执行：
        npm run dev

        终端会显示一个地址，通常是 http://localhost:5173/。按住 Ctrl 点击这个链接，或者在浏览器中输入这个地址。

方案二：使用 CDN 引入（仅限快速测试）
    - 如果不想启动终端，只想快速在浏览器里跑一下代码，需要把 HTML 中的导入方式改成 CDN 链接
    - 开发模式:  "内联模板" 或 "纯 JavaScript 对象组件" 的模式
    1.修改 index.html：
        新增
        <!-- 1. 定义 Vue 的 CDN 地址 -->
        <script type="importmap">
        {
            "imports": {
            "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
            "vue-router": "https://unpkg.com/vue-router@4/dist/vue-router.esm-browser.js"
            }
        }
        </script>

    2.必须把组件逻辑写成 JavaScript 对象（如上面的 const Home = { template: '...' }），或者使用 .js 文件导出对象
        不要在代码中写 import App from './App.vue'。浏览器不认识 .vue 后缀。

    3.原生 ES Modules 不支持 import './style.css'。
    不要在 <script type="module"> 中写 import './style.css'。
    可以在 <head> 中使用传统的 <link rel="stylesheet" href="style.css"> 引入 CSS

### debug 模式
1.修改 vite.config.js
如果用 Vite：检查项目根目录下的 vite.config.js 或 vite.config.ts，确保 build.sourcemap 设置为 true 或 'inline'。

export default defineConfig({
  // ...
  build: {
    sourcemap: true, // 或 'inline'
  },
  server: {
    sourcemap: true, // 开发环境也建议开启
  }
})
修改配置后，务必重新启动开发服务器（npm run dev 或 yarn dev）

2.配置 VSCode 调试器 (launch.json)
在项目根目录下创建 .vscode/launch.json 文件，这是告诉 VSCode 如何启动和连接调试器的关键。
对于 Vite 项目（默认端口 5173）：
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173", // 必须与项目实际地址完全一致[reference:10][reference:11]
      "webRoot": "${workspaceFolder}", // Vite 项目通常指向项目根目录[reference:12]
      "sourceMapPathOverrides": {
        "/src/*": "${webRoot}/src/*"
      }
    }
  ]
}
关键点：url 必须和 npm run dev 启动后的地址（包括端口）完全一致。sourceMapPathOverrides 是解决断点变灰最常见的配置，需要根据项目结构调整

3.运行
VS Code 终端执行: 
    npm i
    npm run dev
按 F5 快捷键开始调试

## 形象的比喻
1. CDN + Import Map (“生吃食材”)
你（开发者）必须自己把菜洗好、切好、煮熟（把 Vue 组件拆成 JS 字符串，把 CSS 用 link 引入），然后直接端给客人（浏览器）吃。如果端上去的是生的（.vue 文件），客人会拉肚子（报错）。

2. Vite 开发服务器 (“去餐厅点餐”) 
你（开发者）写好菜单（代码），交给厨师（Vite）。厨师负责洗菜、切菜、烹饪（编译 .vue 和处理 CSS），最后端给客人的是精美的菜肴（标准 JS）。客人只需要吃就行了。

