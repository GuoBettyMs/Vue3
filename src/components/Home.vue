//components/Home.vue
<template>
  <!-- 接收 props -->
  <div>参数ID: {{ props.userId }} </div>
  
  <!-- 关键点：动态绑定 class，当 theme 为 'dark' 时，div 会拥有 'dark' 类名 -->
  <div class="home-container" :class="theme">
    <header>
      <h1>🤖 AI 文案生成器</h1>
      <p>输入主题，一键生成营销文案（模拟 AI）</p>
    </header>

    <div class="form-group">
      <label for="topic" class="home-label">🎯 主题/关键词</label>

      <!-- 没有使用 v-model 或 :value 绑定,不会更新输入框实时值,打印结果永远为空 -->
      <input
        id="topic1"
        type="text1"
        ref="topicRef"
        placeholder="打印结果不会自动更新输入框实时值"
        @keyup.enter="generate"
      />

      <!-- 会更新输入框实时值,打印结果不为空 -->
      <input
        id="topic"
        type="text"
        v-model.trim="topic"
        placeholder="例如：情人节、咖啡、健身、开学季..."
        @keyup.enter="generate"
      />
    </div>

    <div class="form-group">
      <label for="typeselect" class="home-label">📝 文案类型</label>
      <select id="typeselect" v-model="type">
        <option value="slogan">广告语 / Slogan</option>
        <option value="social">社交媒体文案</option>
        <option value="email">邮件标题</option>
        <option value="product">产品描述</option>
      </select>
    </div>

    <button class="btn" @click="generate" :disabled="!topic || loading">
      {{ loading ? '生成中...' : '🚀 生成 AI 文案' }}
    </button>

    <button class="btn" style="margin-top: 2vh;" @click="toggleTheme">
      切换{{theme === 'dark' ? '浅色' : '深色' }}模式
    </button>

    <!-- 结果区域 -->
    <div v-if="results.length > 0" class="results">
      <h2>💡 生成结果（{{ results.length }} 条）</h2>
      <div class="result-item" v-for="(item, index) in results" :key="index">
        <p>{{ item }}</p>
        <button @click="copyText(item)" class="copy-btn">📋 复制</button>
      </div>
    </div>

    <!-- 提示 -->
    <p v-if="!results.length && !loading" class="hint">
      输入主题并点击“生成”，即可获得 AI 风格文案！
    </p>
  </div>
</template>

<script setup>
// 使用 Composition API
import { ref, watch, onMounted  } from 'vue'


// --- 1. ref 响应式数据 (替代 data) ---
// 使用 ref 定义基本类型数据
const topic = ref('')
const type = ref('slogan')
const results = ref([])
const loading = ref(false)
const theme = ref('light')// 定义局部主题状态
const props = defineProps({
  userId: String 
})

// --- 定义引用---
const topicRef = ref('topicRef')// 初始值为 'topicRef'

// --- 2. 方法 (替代 methods) ---
// 直接定义函数，无需放在 methods 对象中
const generate = () => {
  //topicRef.value 的值被替换成了 <input> 这个 DOM 元素本身,初始值 'topicRef' 就被覆盖掉了,打印为 [object HTMLInputElement]
  //可通过 topicRef.value 获取 DOM 元素，再通过 .value 获取其值
  console.log(`用户输入的内容是: ${topicRef.value}(${topic.value})`)
  if (!topic.value.trim()) return

  loading.value = true
  results.value = []

  // 模拟网络延迟
  setTimeout(() => {
    const templates = getTemplates(type.value)
    // 注意：在函数内部访问 ref 变量需要加 .value
    results.value = templates.map(tpl =>
      tpl.replace(/\{topic\}/g, topic.value)
         .replace(/\{action\}/g, getActionVerb())
    )
    loading.value = false
  }, 800)
}

const getTemplates = (type) => {
  const common = [
    '让{topic}更简单，从今天开始！',
    '{topic}新体验，你值得拥有！',
    '为什么大家都在谈论{topic}？',
    '告别平庸，拥抱{topic}的全新可能！'
  ]

  switch (type) {
    case 'slogan':
      return [
        '{topic}，就现在！',
        '专注{topic}，成就非凡。',
        '{topic} · 极简 · 高效',
        '你的{topic}，你的规则。'
      ]
    case 'social':
      return [
        '刚刚尝试了{topic}，简直太惊艳了！🔥 #好物分享',
        '还在为{topic}烦恼？试试这个，效率翻倍！✨',
        '今天被{topic}圈粉了，忍不住安利给大家～',
        '一条关于{topic}的小建议，希望对你有用 ❤️'
      ]
    case 'email':
      return [
        '📣 重磅更新：{topic}现已上线！',
        '你有一份关于{topic}的专属福利待领取',
        '如何用{topic}提升你的工作效率？',
        '别错过：{topic}限时优惠最后3天！'
      ]
    case 'product':
      return [
        '采用先进{action}技术，打造极致{topic}体验。',
        '轻巧设计，强大性能，专为{topic}而生。',
        '用户好评如潮的{topic}解决方案，现在入手正当时！',
        '无论是新手还是专家，{topic}都能满足你的需求。'
      ]
    default:
      return common
  }
}

const getActionVerb = () => {
  const verbs = ['创新', '智能', '高效', '极简', '沉浸式', '一站式']
  return verbs[Math.floor(Math.random() * verbs.length)]
}

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('✅ 已复制到剪贴板！')
  } catch (err) {
    console.error('复制失败:', err)
    // 兼容旧浏览器
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('✅ 已复制（兼容模式）')
  }
}

//切换函数
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}


// --- 3. watch 监听器 (替代 watch) ---
// 监听 theme 变化并写入 localStorage,刷新页面后，Home 组件依然记得它是深色模式
watch(theme, (val) => {
  localStorage.setItem('home-component-theme', val)
})


// --- 4. 初始化 (替代 mounted()) ---
// 页面加载时读取
onMounted(() => {
  const saved = localStorage.getItem('home-component-theme')
  if (saved) theme.value = saved
})

</script>

<!-- 使用 src 属性引入外部样式, 加上 scoped 代表作用范围是当前组件 -->
<style scoped src="../css/HomeComponent.css"></style>

