<template>
  <!-- 
    这里的内容会替换 index.html 里的 <div id="app"> 
    所以把导航和路由出口放在这里 
  -->
  <nav class="nav">
    <router-link to="/">首页</router-link>
    <router-link to="/input">HTML input 元素</router-link>
    <router-link to="/select">HTML select 元素</router-link>
    <router-link to="/video">HTML video 元素</router-link>
    <router-link to="/home">主页</router-link>
    <router-link to="/about">关于我们</router-link>
    <router-link to="/contact">联系我们</router-link>
  </nav>

  <!-- 方法2：编程式导航按钮
  <div>
    <button class="navbtn" @click="goToAbout">点击方法跳转到About</button>
    <button class="navbtn" @click="$router.push('/about')">编程直接跳转到About</button>
    <button class="navbtn" @click="goToAboutWithParams">带参数跳转到About</button>
    <button class="navbtn" @click="goToAboutReplace">当前页面替换为About</button>
    <button class="navbtn" @click="goToAboutByName">带命名路由跳转到About</button>
  </div>  -->

  <!-- 路由出口：匹配到的组件会显示在这里 -->
  <router-view></router-view>

  <!-- 全局 Toast 组件 -->
  <GlobalToast /> 

</template>

<script setup>
// 使用 Composition API
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GlobalToast from './components/GlobalToast.vue' // 默认导入

// --- ref 响应式数据 ---
const userId = ref('123')
const router = useRouter() //返回的路由实例对象中，没有 path 这个直接属性。


// --- 方法 ---
// 方法1：直接操作 router 跳转
const goToAbout = () => {
  router.push('/about')
}

// 方法2：带查询参数、路由参数（:methods_id）跳转, 结果 URL： /about/789?tab=infosss&from=home&...
const goToAboutWithParams = () => {
  router.push({
    name: 'about', // 使用命名路由
    params: { methods_id: '2' }, // 👈 传 :methods_id
    query: {
      tab: 'infosss',
      from: 'home',
      userId: userId.value, //在 setup 中，ref 变量需要通过 .value 访问
      timestamp: Date.now()
    }
  })
}

      
// 方法3：替换当前路由（不记录历史）
const goToAboutReplace = () => {
  router.replace('/about');
}

// 方法4：带命名路由跳转（需要先定义路由名称）
const goToAboutByName = () =>  {
  router.push({ name: 'about' });
}

</script>


<style scoped>
/* 样式保持不变，加上 scoped 避免冲突 */
.nav {
  display: flex;
  padding: 20px;
  background: #f5f5f5;
}
.nav a {
  text-decoration: none;
  color: #333;
  padding: 8px 16px;
  border-radius: 4px;
}
.nav a:hover {
  background: #e0e0e0;
}
.nav a.active {
  background: #2575fc;
  color: white;
}

.navbtn {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>