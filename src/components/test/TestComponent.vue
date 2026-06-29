<template>
    <div class="parent-container">
        <!-- 导航栏 -->
        <div class="nav-container">
            <button
                v-for="item in navItems"
                :key="item.id"
                :class="{btnSelected: currentNavitemId == item.id}"
                @click="selectNav(item.id)">
                    <i :class="item.icon"></i> 
                    <span 
                        v-show="currentNavitemId == item.id"
                        class="nav-text">
                        {{item.name}}
                    </span>
            </button>
        </div>

        <!-- 路由视图 - 显示子路由内容 -->
        <router-view></router-view>
    </div>
</template>

<script setup>
/********************************************* 
*  使用 Composition API
********************************************/
import { ref } from 'vue'
import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/********************************************* 
* 数据定义
********************************************/
const router = useRouter() //路由实例，它包含 push, replace, currentRoute 等方法/属性，但没有直接存放当前路径的 path 字段
const route = useRoute() // 获取当前路由对象
// 导航栏
const currentNavitemId = ref('home') // 默认选中首页
const navItems = ref([
    { id: 'home', name: '自定义表格', icon: 'fas fa-home', routeName: 'TestTableview', path: '/test/tableview' },
    { id: 'group', name: '自定义数字键盘和滚轮选择器', icon: 'fas fa-users', routeName: 'Group', path: '/test/group' },
    { id: 'settings', name: '自定义下拉菜单', icon: 'fas fa-cog', routeName: 'Settings', path: '/test/settings' },
    { id: 'star', name: '星标', icon: 'fas fa-star', routeName: 'Star', path: '/test/star' },
    { id: 'like', name: '喜欢', icon: 'fas fa-heart', routeName: 'Like', path: '/test/like' }
])

/********************************************* 
* computed
********************************************/

/********************************************* 
* 方法定义
********************************************/

// 封装一个更新选中状态的方法
const updateNavSelection = () => {
    const matchedItem = navItems.value.find(item => item.path === route.path)
    if (matchedItem) {
        currentNavitemId.value = matchedItem.id
        console.log('导航更新:', currentNavitemId.value)
    }
}

const selectNav = (selectedId) => {
    if (currentNavitemId.value != selectedId) {
        currentNavitemId.value = selectedId
        console.log('选中了:', selectedId)

        // 找到对应的路由路径
        const selectedItem = navItems.value.find(item => item.id === selectedId)
        if (selectedItem && selectedItem.path) {
            // 编程式导航
            router.push(selectedItem.path)
        }
    }
}


/********************************************* 
* watch
********************************************/

// 监听路由变化 (处理重定向后的状态更新)
watch(() => route.path, () => {
    updateNavSelection()
})

/********************************************* 
* mounted
********************************************/

onMounted(() => {

// 初始化执行一次
    updateNavSelection()
})

</script>


<style scoped>
.parent-container {
  padding: 20px;
}

/********************************************* 
 * 导航栏
 ********************************************/

.nav-container{
    padding: 16px 16px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
}

.nav-container button {
    border: none;
    padding: 16px;
    border-radius: 20px;
    color: #80808078;
    background-color: transparent;
}

.nav-container button i{
    color: #80808078;
}

.nav-container .btnSelected {
    background-color: #a2a6aac4;
    color: black;
    font-weight: 400;
}

.nav-container .btnSelected i{
   color: black;
}

.nav-text {
    margin-left: 5px;
    transition: all 0.3s ease;
}
/********************************************* 
 * 导航栏
 ********************************************/

.nav-container{
    padding: 16px 16px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
}

.nav-container button {
    border: none;
    padding: 16px;
    border-radius: 20px;
    color: #80808078;
    background-color: transparent;
}

.nav-container button i{
    color: #80808078;
}

.nav-container .btnSelected {
    background-color: #a2a6aac4;
    color: black;
    font-weight: 400;
}

.nav-container .btnSelected i{
   color: black;
}

.nav-text {
    margin-left: 5px;
    transition: all 0.3s ease;
}

</style>