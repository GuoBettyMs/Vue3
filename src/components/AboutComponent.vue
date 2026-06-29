<template>
  <div class="about-container">
    <h2>📄 关于我们</h2>
    <p>这是通过路由切换过来的关于页面</p>
    <!-- props 直接通过 props 变量访问 -->
    <p>参数ID: {{ props.methods_id }}</p>
    
    <!-- 路由参数直接通过 useRoute() 返回的对象访问 -->
    <p>当前路由参数: {{ $route.query }}</p>
    <p>查询 “tab” 参数: {{ $route.query.tab }}</p>
    
    <div class="actions">
      <button @click="goBack">← 返回上一页</button>
      <button @click="goHome">🏠 回首页</button>
    </div>
  </div>
</template>

<script setup>
/********************************************* 
  *  使用 Composition API
  ********************************************/
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

/********************************************* 
  * 数据定义
  ********************************************/
// 1. 定义 Props
// 在 <script setup> 中，defineProps 是宏函数，无需导入即可直接使用
// 但为了代码清晰，这里演示导入（实际开发中不导入也能用）
const props = defineProps({
  methods_id: {
    type: [String, Number],
    required: false
  }
})

// 2. 获取路由实例
const router = useRouter()


/********************************************* 
  * 方法定义
  ********************************************/
// 3. 定义方法 (直接定义函数，无需 methods 对象)
const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>
