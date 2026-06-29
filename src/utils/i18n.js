//src/util/i18n.js
import { createI18n } from 'vue-i18n'
import zhCN from '../locales/zh-CN'
import enUS from '../locales/en-US'

// 获取浏览器语言或本地存储的语言
const savedLocale = localStorage.getItem('locale') || 'zh-CN'

const i18n = createI18n({
    legacy: false,          // 使用 Composition API 风格
    locale: savedLocale,    // 当前语言
    fallbackLocale: 'en-US', // 回退语言
    messages: {
        'zh-CN': zhCN,
        'en-US': enUS,
    }
})

export default i18n
