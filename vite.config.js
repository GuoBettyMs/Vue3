// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')    //第三个参数 '' 表示不限制前缀，这样 VITE_APP_MODE 和普通变量都能读到
  const isBle = env.VITE_APP_MODE === 'ble'
  const BASE_PATH = '/my_vue3_app/'     // 基础路径配置
  const styleRelPath = isBle ? 'src/index.css' : 'src/style.css'
  const styleAbsPath = resolve(process.cwd(), styleRelPath)

  if (!existsSync(styleAbsPath)) {
    throw new Error(`[vite] 样式文件不存在: ${styleAbsPath}`)
  }

  return {
    plugins: [
      vue(),
      {
        name: 'inject-mode-specific-css',
        transformIndexHtml(html) {
          // 在 </head> 前插入对应的 CSS link
          const link = `    <link rel="stylesheet" href="${BASE_PATH}${styleRelPath}" />\n`
          return html.replace('</head>', `${link}  </head>`)
        },
      },
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      sourcemap: true,
    },
    server: {
      host: true,
      strictPort: true,
    },
    css: {
      devSourcemap: true,
    },
    base: BASE_PATH,
    // 定义全局变量，供其他文件引用
    define: {
      // 基础路径
      __BASE_PATH__: JSON.stringify(BASE_PATH),
      // API 基础 URL
      __API_BASE_URL__: JSON.stringify('https://api.example.com'),
      // 版本号
      __APP_VERSION__: JSON.stringify('1.0.0'),
      // 是否开发环境
      __IS_DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    }
  }
})