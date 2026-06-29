// components/test/TestSelectdropdownComponent.vue

<template>
    <div>
        <div class="stack-view">
            <div class="stack-view-first-item">
                <div class="stack-view-first-item-left">
                    <span>1</span>
                    <input 
                        type="text" 
                        id="title-input"
                        name="title"
                        v-model="titleValue"
                        placeholder="请输入标题（最多16字节，不支持特殊符号）">
                </div> 


                    <!-- 自定义下拉菜单 -->
                <div class="custom-select" @click.stop>
                    <div ref="dropdownRef"
                        class="custom-select-trigger" 
                        @click="toggleDropdown"
                        :class="{'selected' : dropdownOpen}">
                        <span :class="{ 'has-value': selectedPet }">
                            {{ getSelectedPetLabel() }}
                        </span>
                        <i class="fas fa-chevron-down" :class="{ 'rotate': dropdownOpen }"></i>
                    </div>

                    <div class="custom-select-dropdown" v-show="dropdownOpen">
                        <div 
                            v-for="option in petOptions" 
                            :key="option.id"
                            class="custom-select-option"
                            :class="{ 'selected': selectedPet === option.id }"
                            @click="selectOption(option)">
                            {{ option.value }}
                        </div>
                    </div>
                </div>

                <div @click="toggleList">
                    <i class="fas fa-arrow-down fa" v-show="!isClick"></i>
                    <i class="fas fa-arrow-up fa" v-show="isClick"></i>
                </div>
            </div>

            <!-- 动态渲染设置项 -->
            <div 
                v-show="isClick"
                v-for="(task, index) in petTasks[selectedPet]" 
                :key="index" 
                class="stack-view-item" >
                <input 
                    type="checkbox" 
                    :id="'task-' + index"
                    name="task"
                    :value="task"
                    v-model="selectedTasks[selectedPet]">
                <!-- label 的 for 属性也要对应修改，否则点击文字无法触发勾选 -->
                <label :for="'task-' + index">{{ task }}</label>
            </div>
        </div>

        <div class="control-btn">
            <h1>{{ $t('home.title') }}</h1>
            <p>{{ t('home.description') }}</p>
            <button @click="changeLanguage('zh-CN')">中文</button>
            <button @click="changeLanguage('en-US')">English</button>
            <button @click="goBack" class="back-btn">返回</button>
        </div>

    </div>
</template>

<script setup>
/********************************************* 
*  使用 Composition API
********************************************/
import { ref, reactive } from 'vue'
import { watch, onMounted, onUnmounted } from 'vue'
import { StringValidator } from '../../utils/stringValidator.js'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

/********************************************* 
* 数据定义
********************************************/
const router = useRouter()
const titleValue = ref('Pet to-do list')
const dropdownOpen = ref(false) //是否打开 custom-select-dropdown
const isClick = ref(true) //是否展开 stack-view
const selectedPet = ref('dog') // 默认选中 Dog

//reactive 不支持整体替换,会失去响应性
const petOptions = reactive([
    { id: 'dog', value: 'Dog'},
    { id: 'cat', value: 'Cat'},
    { id: 'hamster', value: 'Hamster'},
    { id: 'parrot', value: 'Parrot'},
    { id: 'spider', value: 'Spider'},
    { id: 'goldfish', value: 'Goldfish'}
]) 
const petTasks = reactive({
    dog: ['遛狗', '喂食', '洗澡', '训练'],
    cat: ['喂食', '清理猫砂', '逗猫'],
    hamster: ['喂食', '清理笼子', '放风运动'],
    parrot: ['喂食', '清理鸟笼', '教说话'],
    spider: ['喂食昆虫', '清理饲养箱', '温度控制'],
    goldfish: ['喂食', '换水', '清洗过滤器']
})

// 存储选中的任务
const selectedTasks = ref({
    dog: [],
    cat: [],
    hamster: [],
    parrot: [],
    spider: [],
    goldfish: []
})
    
const { t, locale } = useI18n()

/********************************************* 
  * DOM 引用
  ********************************************/

const dropdownRef = ref(null)


/********************************************* 
* 方法定义
********************************************/

// 获取选中的宠物标签
const getSelectedPetLabel = () => {
    const option = petOptions.find(opt => opt.id === selectedPet.value)
    return option ? option.value : '请选择'
}

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
}

const selectOption = (option) => {
    selectedPet.value = option.id
    dropdownOpen.value = false
    onPetChange()
}

const toggleList = () => {
    isClick.value = !isClick.value
    console.log(isClick.value)
}

const onPetChange = () => {
    //console.log(`选中的宠物: ${selectedPet.value}`)
    //console.log(`当前宠物任务:`, petTasks[selectedPet.value])
    console.log(`已选任务:`, selectedTasks.value[selectedPet.value])
}

const goBack = () => {
    router.push('/test/tableview')
}

// 处理点击外部的逻辑
const handleClickOutside = (event) => {
  // 如果下拉菜单是打开的，且点击的目标不在下拉菜单元素内部
  if (dropdownOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}

//切换语言
const changeLanguage = (lang) => {
    locale.value = lang
    console.log(`输出当前语言(${locale.value}) 的 hello: `, t('common.hello')) // 输出当前语言的 hello
    //存储本地化语言
    //localStorage.setItem('locale', lang)
}

/********************************************* 
* watch
********************************************/

//监听标题不含特殊符号且长度限制16字节
watch(titleValue, (newVal) => {
    const sanitized = StringValidator.sanitize(newVal, 16)
    if (sanitized !== newVal) {
        titleValue.value = sanitized
    }
})

//语言切换后重新加载某些数据
watch(locale, (newLocale) => {
    console.log(`newLocale=${newLocale}`)
    //存储本地化语言
    localStorage.setItem('locale', newLocale)
    //重新加载某些数据
})

/********************************************* 
* mounted
********************************************/
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除监听 
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>


<style scoped>
.stack-view {
    display: flex;
    flex-direction: column;  /* axis = .vertical */
    gap: 2px;               /* spacing */
    padding: 0px;           /* layoutMargins */
    align-items: stretch;    /* alignment = .fill */
    justify-content: flex-start; /* distribution = .fill */
    margin-bottom: 10px;  /* 与父视图的约束 */
    border-radius: 10px;
    overflow: visible; /* 允许下拉菜单溢出 */
}

.stack-view-item {
    background-color: #f0f0f0;
    height: 40px;
    display: flex;
    align-items: center;
}

/* 最后一项保持圆角 */
.stack-view-item:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

.stack-view-item input[type="checkbox"]{
    height: 28px;
    width: 28px;
    margin: 0 10px;
}

.stack-view-item span{
    padding: 16px;
    font-size: 16px;
}


/* 第一项保持圆角 */
.stack-view-first-item {
    display: flex;
    align-items: center;
    background-color: gainsboro;
    height: 40px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.stack-view-first-item-left{
    display: flex;
    align-items: center;
    flex: 1; /* 自动填满剩余区域 */
}

.stack-view-first-item-left span{
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;  /* 垂直居中 */
    justify-content: center;  /* 水平居中 */
    color: black;
    font-size: 16px;
    margin: 0 10px;
}

.stack-view-first-item-left input[type="text"]{
    border: none;
    flex: 1;
    background-color: transparent;
    color: black;
    font-size: 16px;
    cursor: pointer;
    outline: none; /* 去除默认聚焦边框 */
}

.stack-view-first-item-left input[type="text"]:hover{
    background-color: white;
    padding-left: 5px;
}


.stack-view-first-item i{
    color: gray;
    margin: 0 20px;
    cursor: pointer;
}


/* 自定义下拉菜单容器 */
.custom-select {
    position: relative;
    min-width: 120px;
}

/* 下拉列表触发器 */
.custom-select-trigger {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 12px;
    background-color: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.custom-select-trigger.selected {
    background-color: white;
}


.custom-select-trigger span {
    color: gray;
    font-size: 16px;
}


.custom-select-trigger i {
    margin: 0;
    transition: transform 0.2s;
}

.custom-select-trigger i.rotate {
    transform: rotate(180deg);
}

/* 下拉列表本体 */
.custom-select-dropdown {
    position: absolute; /* 相对定位,相对于父视图位置而决定自身的具体定位 */
    top: 100%;   /* 自身顶部与父视图顶部的距离是 100%, 支持负数 */
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-height: 150px;
    overflow-y: auto; /* 当下拉列表实际高度大于下拉菜单容器,下拉列表允许内部滚动 */
}

.custom-select-option {
    height: 30px;
    padding: 4px 12px;
    cursor: pointer;
    transition: all 0.2s;
    color: gray;
    font-size: 14px;
    border-top: 1px solid;
}

.custom-select-option:first-child {
    border-top: none;
}

.custom-select-option:hover {
    background-color: #ed9b18;
    color: #333;
    font-weight: bold;
}

.custom-select-option.selected {
    background-color: #ed9b18;
    color: #333;
    font-weight: bold;
}

.custom-select-option.selected::before {
    content: "✓ ";
    font-weight: bold;
}


.control-btn{
    display: flex;
    border: dashed;
    border-color: #2196f3;
    margin-top: 10px;
}

.back-btn{
    height: 40px;
    flex: 1;
}
</style>
