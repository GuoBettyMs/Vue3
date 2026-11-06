// src/main.js
import { createApp } from 'vue'
import i18n from './utils/i18n'
import { checkIpLocation } from './utils/ipLocation.js'

// Vite 在构建时会把 import.meta.env.VITE_APP_MODE 替换成字面量，
// 未命中的分支会被 Rollup tree-shake 掉，不会打进产物
const isBle = import.meta.env.VITE_APP_MODE === 'ble'

const [{ default: App }, { default: router }] = await Promise.all([
  isBle ? import('./BleApp.vue')      : import('./App.vue'),
  isBle ? import('./router/bleIndex.js') : import('./router/index.js'),
])

async function bootstrap() {
  const ipLocation = await checkIpLocation();   // 改名，避免遮蔽全局 location
  // PHP IP接口地址
  const NON_MAINLAND_JUMP_URL = 'https://isdt.co';
  const MAINLAND_JUMP_URL = 'https://szisd.com';
  const isMainland = ipLocation.isChina;
  const fullNonDomain2 = window.location.href.replace(window.location.origin, '');

  // console.log("ip location:", ipLocation);

  //允许本地端口‘192.168.xx.xx' 在线调试,若不添加,打开 url 时会自动跳转到国内网址端口/国外网址端口
  const isDevHost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    /^192\.168\./.test(window.location.hostname) ||
    /^10\./.test(window.location.hostname);

  if (!isDevHost) {
      if (isMainland && window.location.origin !== MAINLAND_JUMP_URL) {
          window.location.href = MAINLAND_JUMP_URL + fullNonDomain2;
          return;   
      } else if (!isMainland && window.location.origin !== NON_MAINLAND_JUMP_URL) {
          window.location.href = NON_MAINLAND_JUMP_URL + fullNonDomain2;
          return;
      }
  }

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

  app.mount('#app'); // 挂载到 DOM
}
bootstrap();
