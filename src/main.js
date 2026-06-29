//src/main.js
import { createApp } from 'vue' // 1. 导入 createVNode 和 render
import './style.css'
import App from './App.vue' // 根组件
import i18n from './utils/i18n' //导入国际化
import router from './router/index.js' // 1. 导入 Vue Router v4


// 2. 创建应用并使用 router
const app = createApp(App)
app.use(router) // 挂载路由
app.use(i18n) //引入 i18n

/********************************************* 
 * 添加全局随机颜色方法
 ********************************************/
app.config.globalProperties.$randomColor = {
  // 使用十六进制方式
  hex() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
  // 使用 HSL 方式
  hsl() {
    const hue = Math.random() * 360;
    const saturation = 70 + Math.random() * 30;
    const lightness = 50 + Math.random() * 30;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  },
  // 使用 RGB 方式
  rgb() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

app.mount('#app') // 挂载到 DOM