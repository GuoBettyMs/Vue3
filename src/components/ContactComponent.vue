<template>
    <div class="contact-container">
      <h2>📞 {{ message }}</h2>
      <p>这里是联系方式页面</p>
      <p>邮箱: contact@example.com ({{ state.user }})</p>
      <p>
        <!-- 使用 Font Awesome 图标 -->
        <i class="fas fa-home"></i>
        电话: 123-456-7890
      </p>
      
      <button @click="updateMsg">更新 Msg</button>
      <button @click="$router.push('/')">返回首页</button>
    </div>
</template>

<script setup>
// ---  使用 Composition API ---
import { ref, reactive } from 'vue'

// ---  数据定义 (ref 用于基本类型) ---
const message = ref('联系我们')
// 复杂对象，使用 reactive
const state = reactive({
  count: 0,
  user: null
})

// ---  方法定义 (直接定义函数即可，自动暴露给模板) ---
function updateMsg() {
  message.value = 'Updated!' // 注意：ref 需要 .value
  state.user = message.value
}


</script>