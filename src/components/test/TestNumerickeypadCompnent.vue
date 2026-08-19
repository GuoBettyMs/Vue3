<template>
    <div>
        <select 
            name="numberInput" 
            id="number-input-select"
            @change="onConfigChange">
            <option value="">--Please choose a max input value--</option>
            <option 
                v-for="(config, index) in numberInputConfig"
                :key="index"
                :value="config.maxValue">
                {{ config.maxValue }} (整数:{{ config.maxIntegerPlaces }}位, 小数:{{ config.maxDecimalPlaces }}位)
            </option>
        </select>

        <input
            type="text"
            id="number-value"
            name="number"
            :value="finalvalue"
            @input="handleInput"
            placeholder="请输入数字">
        

        <!-- 自定义数字键盘 -->
        <div class="keyboard-container">
            <div class="group-list">
                <div 
                    v-for="group in groups" 
                    :key="group.id" 
                    class="group-item"
                    :class="{
                        'special': group.id == 10,
                        'disabled': keyStates[group.id]?.disabled
                    }"
                    @click="numberClick(group.id)">
                    <span>{{ group.name }}</span>
                </div>
            </div>

            <div class="keyboard-actions">
                <button @click="deleteNumber"> X </button>
                <button @click="clearNumber"> C </button>
                <button @click="confirmNumber"> √ </button>
            </div>
        </div>

        
        <!-- 自定义多列滚轮选择器 -->
        <div class="picker-multi-column">
            <div 
                v-for="(column, colIndex) in multiData" 
                :key="colIndex"
                class="picker-wheel-container">
                <div 
                    class="picker-wheel" 
                    :ref="el => setColumnRef(el, colIndex)"
                    @scroll="onMultiScroll(colIndex, $event)"
                    @wheel="onWheel(colIndex, $event)"
                    >

                    <div v-for="(num, idx) in column" 
                        :key="idx"
                        class="picker-wheel-item"
                        :class="{ selected: selectedMultiIndex[colIndex] === (num % 10) }">
                        {{ String(num % 10).padStart(1, '0') }}
                    </div>
                </div>
                <div class="picker-wheel-mask"></div>
                <div class="picker-wheel-highlight"></div>
            </div>

            <!-- 动态小数点 -->
            <div class="decimal-point" :class="{'three-decimal-dot': currentMode === 'three'}">
                <span>.</span>
            </div>
        </div>
        <div class="selected-value">当前选中: {{ selectedMultiText }}</div>
        

        <!-- 自定义单列滚轮选择器 -->
        <div class="picker-wheel-container">
            <div class="picker-wheel" 
                ref="wheel" 
                @scroll="single_onScroll">
                <div v-for="(num, idx) in loopData" :key="idx"
                    class="picker-wheel-item"
                    :class="{ selected: currentValue === (num % 10) }">
                    {{ String(num % 10).padStart(1, '0') }}
                </div>
            </div>
            <div class="picker-wheel-mask"></div>
            <div class="picker-wheel-highlight"></div>
        </div>
        <div class="selected-value">当前选中: {{ currentValue }}</div>

        <button @click="goBack" class="back-btn">返回</button>

    </div>
</template> 

<script setup>
/********************************************* 
*  使用 Composition API
********************************************/
import { ref, reactive } from 'vue'
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { nextTick } from 'vue'

/********************************************* 
* 数据定义
********************************************/
const selectedConfig = ref(null)
const numberInputConfig = ref([
    { maxValue: 30.5, maxIntegerPlaces: 2, maxDecimalPlaces: 2 },
    { maxValue: 5.1, maxIntegerPlaces: 1, maxDecimalPlaces: 3 },
    { maxValue: 10.1, maxIntegerPlaces: 2, maxDecimalPlaces: 3 } 
])

/**** Test-roller-selector(multiplus) ********************************************/


let delta = 0 //滚动方向,默认不滚动
// 动态模式：'three' 表示3位小数（<10），'two' 表示2位小数（≥10）
const currentMode = ref('three') 
//多列
const baseData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]// 基础数字 0-9
const repeatCount = 100      // 重复次数，总数 = 10 * 100 = 1000 项
let scrollTimer = null
let wheelTimer = null
let isAdjusting = false    // let 关键字用于声明一个可以被重新赋值的变量, 防止循环触发
const itemHeight = 50        // const 声明的变量是一个常量, 每个选项高度
const multiData = ref([]) // 存放生成的循环数据
const selectedMultiIndex = ref([]) // 当前选中的数字
const defaultSelections = ref([3, 8, 0, 0])// 初始选中值
const columnRefs = ref({})
let lastScrollValue = null; // 记录滚动前的值

/***** Test-roller-selector(single) ********************************************/

//单列
const wheel = ref(null)
const loopData = ref([])         // 展平后的超长数组
const currentValue = ref(4)      // 当前选中的数字
let single_scrollTimer = null
let single_isAdjusting = false    // 防止循环触发

/**** Test-numeric-keypad********************************************/
const finalvalue = ref('')
const groups = ref([
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
    { id: 6, name: '6' },
    { id: 7, name: '7' },
    { id: 8, name: '8' },
    { id: 9, name: '9' },
    { id: 10, name: '收起键盘' },
    { id: 11, name: '0' },
    { id: 12, name: '.' },
])
        

/********************************************* 
* computed
********************************************/

        // 当前选中的配置
const currentConfig = computed(() => {
    return selectedConfig.value || numberInputConfig.value[0]
})

        // 当前最大值
const currentMaxValue = computed(() => {
    return currentConfig.value.maxValue
})

// 当前最大小数位数
const currentMaxDecimalPlaces = computed(() => {
    return currentConfig.value.maxDecimalPlaces
})

// 当前最大整数位数
const currentMaxIntegerPlaces = computed(() => {
    return currentConfig.value.maxIntegerPlaces;
})

/**** Test-roller-selector(multiplus)********************************************/

//返回选择的多列文本
const selectedMultiText = computed(() => {
    if (!multiData.value.length) return ''
    return multiData.value.map((column, idx) => column[selectedMultiIndex.value[idx]]).join(' - ')
})

/*** Test-numeric-keypad ********************************************/

//计算每个数字键的状态（用于模板）
const keyStates = computed(() => {
    const states = {};
    groups.value.forEach(group => {
        if (group.id === 10) {
            // 收起键盘按钮，始终可用
            states[group.id] = { disabled: false, isSpecial: true }
        } else if (group.id === 11 || group.id === 12) {
            // 0 和小数点
            states[group.id] = { 
                disabled: isNumberKeyDisabled(group.id === 11 ? '0' : '.'),
                isSpecial: false
            }
        } else {
            // 数字 1-9
            states[group.id] = { 
                disabled: isNumberKeyDisabled(group.id.toString()),
                isSpecial: false
            }
        }
    })
    return states
})


/********************************************* 
* 方法定义
********************************************/

// 选择配置
const onConfigChange = (event) => {
    const maxValue = event.target.value
    if (maxValue === '') {
        selectedConfig.value = null

        //自定义数字键盘
        clearNumber()

        //自定义滚轮选择器
        initLoopData(selectedConfig.value)

        return
    }
    
    // 查找选中的配置
    const config = numberInputConfig.value.find(c => c.maxValue.toString() === maxValue)
    if (config) {
        selectedConfig.value = config

        //自定义数字键盘
        clearNumber()

        //自定义滚轮选择器
        initLoopData(selectedConfig.value)

    }
}

const goBack = () => {
    router.push('/test/tableview')
}

/** Test-roller-selector(multiplus) ********************************************/


/**
* 根据模式返回整数位和小数位数量（仅针对10.1配置）
* @param {Object} mode - 配置模式
* @returns {integerPlaces, decimalPlaces} - 整数位数,小数位数
*/
const getModeConfig = (mode) => {
    // 仅当当前配置是10.1时才启用动态模式
    if (currentMaxValue.value === 10.1) {
        return mode === 'three' 
            ? { integerPlaces: 1, decimalPlaces: 3 } 
            : { integerPlaces: 2, decimalPlaces: 2 }
    } else {
        // 其他配置使用固定位数
        return {
            integerPlaces: currentConfig.value.maxIntegerPlaces,
            decimalPlaces: currentConfig.value.maxDecimalPlaces
        }
    }
}

/**
* 根据模式生成列数据（每列是一个数字数组）
* @param {Object} mode - 配置模式
* @returns {number[]} - 数字数组
*/
const generateColumnsData = (mode) => {
    const { integerPlaces, decimalPlaces } = getModeConfig(mode)
    const maxDigits = valueToDigits(currentMaxValue.value, mode)
    const columns = []

    if (currentMaxValue.value === 10.1){
        //<10, 列0 支持0-9; >=10, 列0支持0-1
        for (let i = 0; i < integerPlaces; i++) {
            if (mode === 'three') {
                columns.push([...baseData])
            }else{
                for (let i = 0; i < integerPlaces; i++) {
                    let limit = 9
                    // 最高位限制为最大值的最高位
                    if (i === 0) limit = maxDigits[0]
                    columns.push(Array.from({ length: limit + 1 }, (_, k) => k))
                }
            }
            
        }
    }else{
        // 限制整数位范围（从高位到低位）
        for (let i = 0; i < integerPlaces; i++) {
            let limit = 9
            // 最高位限制为最大值的最高位
            if (i === 0) limit = maxDigits[0]
            columns.push(Array.from({ length: limit + 1 }, (_, k) => k))
        }
    }

    // 小数位（0-9）
    for (let j = 0; j < decimalPlaces; j++) {
        columns.push([...baseData])
    }

    return columns
}


/**
* 根据当前模式计算实际数值
* @param {Object} selections - 数字数组
* @returns {number} - 实际数值
*/
const computeCurrentValue = (selections) => {
    const mode = currentMode.value
    const { integerPlaces, decimalPlaces } = getModeConfig(mode)
    const total = integerPlaces + decimalPlaces
    // 取前 total 位，不足补0
    let numStr = selections.slice(0, total).map(v => v.toString()).join('')
    if (numStr.length < total) numStr = numStr.padStart(total, '0')
    const intPart = numStr.slice(0, integerPlaces)
    const decPart = numStr.slice(integerPlaces, total)
    return parseFloat(`${intPart}.${decPart}`) || 0
}

/**
* 将数值转换为指定位数的数字数组
* @param {Object} value - 数值
* @param {Object} mode - 配置模式
* @returns {number[]} - 数字数组
*/
const valueToDigits = (value, mode) => {
    const { integerPlaces, decimalPlaces } = getModeConfig(mode)
    const fixed = value.toFixed(decimalPlaces)
    const [intPart, decPart] = fixed.split('.')
    const intStr = intPart.padStart(integerPlaces, '0')
    const decStr = (decPart || '').padEnd(decimalPlaces, '0')
    const combined = intStr + decStr
    return combined.split('').map(ch => parseInt(ch, 10))
}


/**
* 根据当前选中的数字数组自动判断模式（仅针对10.1配置）
* @param {Object} selections - 数字数组
* @returns {String} - 配置模式
*/
const determineMode = (selections) => {
    // 用两位小数模式解析，看是否 >= 10
    const tempMode = 'two'
    const { integerPlaces, decimalPlaces } = getModeConfig(tempMode)
    const total = integerPlaces + decimalPlaces
    let numStr = selections.slice(0, total).map(v => v.toString()).join('')
    if (numStr.length < total) numStr = numStr.padStart(total, '0')
    const intPart = numStr.slice(0, integerPlaces)
    const decPart = numStr.slice(integerPlaces, total)
    const val = parseFloat(`${intPart}.${decPart}`) || 0
    console.log('val= ', val)
    if (val >= 10) return 'two'
    return 'three'
}


/**
* 初始化循环数据并处理越界
* @param {Object} config - 配置模式
* @returns {number[]} - 滚轮数据
*/
const initLoopData = (config) => {

    // 1. 判断模式
    if (config.maxValue !== 10.1) {
        currentMode.value = config.maxValue >= 10 ? 'two' : 'three'
    }else{
        const detectedMode = determineMode(defaultSelections.value)
        currentMode.value = detectedMode
    }

    // 2. 计算当前值
    let currentVal = computeCurrentValue(defaultSelections.value)

    // 3. 若超过最大值，重置为0
    if (currentVal > config.maxValue) {
        defaultSelections.value = Array(4).fill(0)
        currentMode.value = 'three'
        currentVal = 0
    }

    // 4. 确保长度始终为4
    const mode = currentMode.value
    const { integerPlaces, decimalPlaces } = getModeConfig(mode)
    let digits = defaultSelections.value.slice(0, integerPlaces + decimalPlaces)
    while (digits.length < integerPlaces + decimalPlaces) {
        digits.push(0)
    }
    defaultSelections.value = digits

    // 5. 生成列数据
    const baseColumns = generateColumnsData(mode)
    multiData.value = baseColumns.map(colData => {
        let loopArr = []
        for (let i = 0; i < repeatCount; i++) {
            loopArr.push(...colData)
        }
        return loopArr
    })
    console.log(`列[0]数据  = ${baseColumns[0]}`)
    // 6. 更新选中索引
    selectedMultiIndex.value = [...defaultSelections.value]

    // 7. 清空引用并对齐
    columnRefs.value = {}
    nextTick(() => {
        defaultSelections.value.forEach((val, idx) => {
            alignToHighlight(idx, val)
        })
    })
}


/**
* 找到目标数值在中间区域的索引,实现居中对齐
* @param {Object} colIndex - 当前列
* @returns {number} value - 目标数值
*/
const alignToHighlight = (colIndex, value) => {
    const container = columnRefs.value[colIndex]
    if (!container) return

    const total = multiData.value[colIndex].length
    const middleStart = Math.floor(total / 2) - 20
    let targetIndex = -1
    // 优先在中间区域找
    for (let i = middleStart; i < middleStart + 40; i++) {
        if (i >= 0 && i < total && (multiData.value[colIndex][i] % 10) === value) {
            targetIndex = i
            break
        }
    }
    // 若中间区域没有，再全局找第一个
    if (targetIndex === -1) {
        targetIndex = multiData.value[colIndex].findIndex(v => (v % 10) === value)
    }
    if (targetIndex === -1) return

    const containerHeight = container.clientHeight
    // 计算滚动位置：目标索引高度 - 容器半高 + 半项高 (居中)
    let targetScrollTop = targetIndex * itemHeight - (containerHeight / 2) + (itemHeight / 2)
    // 边界保护
    targetScrollTop = Math.min(Math.max(0, targetScrollTop), container.scrollHeight - containerHeight)
    container.scrollTop = targetScrollTop
}

/**
* 处理进位/借位
* @param {Object} colIndex - 当前列
* @param {Object} oldDigit - 当前列的旧值
* @param {Object} newDigit - 当前列的新值
* @returns {number[]} - 滚轮数据
*/
const applyCarryBorrow = (colIndex, oldDigit, newDigit) => {
    // 1. 构建新选中的数组（仅修改当前列）
    let newSelections = [...defaultSelections.value];
    newSelections[colIndex] = newDigit;

    if (delta === 1 && oldDigit !== 0 && newDigit === 0){
        // console.log('鼠标向下滚动,从 非0 变为 0, 进位操作')
        if (colIndex === 0){
            console.log('最高位进位到10, 动态模式: three -> two')
            currentMode.value = 'two'
            newSelections[3] = newSelections[2]
            newSelections[2] = newSelections[1]
            newSelections[1] = 0
            newSelections[0] = 1

            ////更改列0 范围
            // let newcol = Array.from({ length: 2 }, (_, k) => k)
            // let loopArr = []
            // for (let i = 0; i < repeatCount; i++) {
            //     loopArr.push(...newcol)
            // }
            // multiData.value[0] = loopArr
            // console.log(`列[0]数据  = ${newcol}`)

        }else{
            let carry = 1;
            for (let i = colIndex - 1; i >= 0; i--) {
                let newHigh = newSelections[i] + carry;
                console.log(`高位(${i})进1后 =${newHigh}`)
                if (newHigh <= 9) {
                    newSelections[colIndex] = 0
                    newSelections[i] = newHigh;
                    carry = 0;
                    break;
                } else {
                    //触发条件:连续进位
                    if (i === 0){
                        console.log(`连续进位到最高位, 动态模式: three -> two`)
                        currentMode.value = 'two'
                        newSelections[3] = newSelections[2]
                        newSelections[2] = newSelections[1]
                        newSelections[1] = 0
                        newSelections[0] = 1
                    }else{
                        newSelections[i] = 0;
                        carry = 1;
                    } 
                }   
            }
        }
    }else if (delta === -1 ) {
        // console.log('鼠标向上滚动,从 非0 变为 0, 借位操作')
        if (oldDigit === 0 && newDigit === 9){
            let borrow = 1;
            for (let i = colIndex - 1; i >= -1; i--) {
                let newHigh = i < 0 ? -1 : newSelections[i] - borrow;
                console.log(`高位(${i})被借1后 =${newHigh}`)
                if (newHigh >= 0) {
                    newSelections[i] = newHigh;
                    borrow = 0;
                    if (currentMaxValue.value === 10.1 && currentMode.value === 'two' && i === 0 && newHigh === 0){
                        console.log(`借位到最高位, two -> three`)
                        currentMode.value = 'three'
                        newSelections[0] = 9
                        newSelections[1] = newSelections[2]
                        newSelections[2] = newSelections[3]
                        newSelections[3] = 0
                    }
                    break;
                } else {
                    newSelections[i] = 9;
                    borrow = 1;
                }

                if (defaultSelections.value[0] === 0){
                    console.log(`最高位不够借,当前列${colIndex}, 前置列${i}恢复旧值 (${defaultSelections.value}), 清零后位`)
                    newSelections[i] = oldDigit;
                    newSelections[colIndex] = oldDigit;

                    for  (let afterI = colIndex + 1; afterI < defaultSelections.value.length; afterI++) {
                        if (defaultSelections.value[afterI] > 0){
                            console.log(`清零后置列${afterI}, ${defaultSelections.value[afterI]} -> 0 `)
                            newSelections[afterI] = 0
                        }
                    }
                }
            }
        }

    }
    return newSelections

}

/**
* 获取该列允许的最大值（根据模式)
* @param {Object} colIndex - 当前列
* @returns {number} - 最大值
*/
const getMaxDigitForColumn = (colIndex) => {
    const mode = currentMode.value;
    const { integerPlaces, decimalPlaces } = getModeConfig(mode);
    const maxDigits = valueToDigits(currentMaxValue.value, mode)
    // console.log(`maxvalue = ${currentConfig.value.maxValue}, maxDigits= ${maxDigits}`)

    // 整数位：从高位到低位，最高位可能受限
    if (colIndex < integerPlaces) {
        if (integerPlaces === 2 && colIndex === 0) return maxDigits[0]; // 十位最大
        return 9;
    }
    // 小数位：0-9
    return 9;
};

/**
* 用于监听滚轮操作，适合实时响应滚动方向并触发值变化
* @param {Object} colIndex - 当前滚动元素的索引,从0开始
* @param {Object} event - 滚轮事件,用于指示鼠标滚轮或触摸板的垂直滚动量
*/
const onWheel = (colIndex, event) => {
    event.preventDefault(); // 阻止默认滚动行为（preventDefault），消除惯性

    if (isAdjusting) return;
    if (wheelTimer) clearTimeout(wheelTimer);

    // 防抖，自定义滚动行为, 避免滚轮连续触发导致跳跃,将滚轮交互从触摸滑动中分离
    wheelTimer = setTimeout(() => {
        delta = event.deltaY > 0 ? 1 : -1; // 向下滚+1，向上滚-1
        const currentValue = defaultSelections.value[colIndex];
        let newValue = currentValue + delta;

        // 获取该列允许的最大值（根据模式）
        const maxDigit = getMaxDigitForColumn(colIndex);
        if (newValue < 0) newValue = 0;
        if (newValue > maxDigit) newValue = maxDigit;

        let newSelections = [...defaultSelections.value];

        if (newValue === currentValue) {
            let newdigit = newValue
            if (newValue === 9 || newValue === 0) {
                newdigit = newValue === 9 ? 0 : 9
            }
            console.log(`鼠标滚轮事件进位/借位, oldValue(${currentValue}) -> newValue(${newdigit}) `)
            newSelections = applyCarryBorrow(colIndex, currentValue, newdigit)

        }else{
            //普通递增或递减
            console.log(`---------- `)
            console.log(`鼠标滚轮事件普通递增或递减, oldValue(${currentValue}) -> newValue(${newValue}), currentConfig=${currentConfig.value} `)

            newSelections[colIndex] = newValue;
        }

        if (currentMaxValue.value === 10.1 && colIndex === 0 && currentMode.value === 'two' && currentValue === 1 && newValue === 0)
        {
            //10.10 -> 移动最高位(1->0) -> 0.1
            console.log(`10.xx -> 移动最高位(1->0), 最高位递减,动态模式: two -> three`)
            currentMode.value = 'three'
            newSelections[1] = newSelections[2]
            newSelections[2] = newSelections[3]
            newSelections[3] = 0
        }
        
        const finalSelections = applyMaxValueLimit(colIndex, newSelections);

        //记录旧值和需要同步滚动位置的所有被修改列
        const oldSelections = [...defaultSelections.value];
        const needSync = [];
        for (let i = 0; i < finalSelections.length; i++) {
            if (finalSelections[i] !== oldSelections[i]) {
                needSync.push(i);
            }
        }

        // 更新状态
        defaultSelections.value = [...finalSelections];
        selectedMultiIndex.value = [...finalSelections];

        console.log(`needSync = ${needSync}`)
        // 等待 DOM 更新后同步所有被修改列的滚动位置
        nextTick();
        for (const col of needSync) {
            console.log(`即将执行滚动事件,同步被修改列${col}=${finalSelections[col]}`)
            resetToMiddle(col, finalSelections[col]);
        }

    }, 50);
}


/**
* 获取滚动后当前列的中心位置的真实数字
* @param {Object} colIndex - 当前滚动元素的索引,从0开始
* @param {Object} event - 中心数值
*/
const getCenterValue = (colIndex) => {
    const container = columnRefs.value[colIndex]
    if (!container) return 0

    const containerRect = container.getBoundingClientRect()
    const centerY = containerRect.top + containerRect.height / 2
    const items = container.querySelectorAll('.picker-wheel-item')
    for (let i = 0; i < items.length; i++) {
        const rect = items[i].getBoundingClientRect()
        if (rect.top <= centerY && rect.bottom >= centerY) {
            return multiData.value[colIndex][i] % 10
        }
    }
    return defaultSelections.value[colIndex]
}

/**
* 用于监听元素的滚动位置变化，适合处理滚动结束后的对齐逻辑
* 不监听滚动方向, scroll 事件可能在滚动过程中频繁触发，无法精确区分用户滚轮还是程序触发的滚动
* @param {Object} colIndex - 当前滚动元素的索引,从0开始
* @param {Object} event - 元素的滚动事件, 当元素的滚动位置（scrollTop/scrollLeft）发生变化时触发
*/
const onMultiScroll = (colIndex, event) => {
    if (isAdjusting) return
    if (scrollTimer) clearTimeout(scrollTimer)

    // 滚动事件开始时,记录当前列滚动前的数字
    const oldDigit = defaultSelections.value[colIndex];
    console.log(`---------- `)

    scrollTimer = setTimeout(async () => {// 添加 async
        // 获取滚动后当前列的中心位置的真实数字
        const newDigit = getCenterValue(colIndex);
        if (newDigit === oldDigit) return;

        console.log(`元素的滚动位置发生变化, 当前位(${colIndex}), oldDigit=(${oldDigit}) ->  newDigit=(${newDigit})`)

        // 边界重置（仅当前列）
        const scrollTop = event.target.scrollTop
        const displayIndex = Math.round(scrollTop / itemHeight)
        const total = multiData.value[colIndex].length
        const threshold = 50
        if (displayIndex < threshold || displayIndex > total - threshold) {
            console.log(`${colIndex}边界重置`)
            resetToMiddle(colIndex, finalSelections[colIndex]);
        }
    }, 50)
}

/**
 * 应用最大值限制
 * @param {number[]} selections 当前各列选中的数字数组
 * @returns {number[]} 修正后的数字数组（若未超过则原样返回，否则返回最大值的各位数字）
 */
const applyMaxValueLimit = (colIndex, selections) => {
    const config = currentConfig.value
    const currentVal = computeCurrentValue(selections)
    const maxVal = config.maxValue

    console.log(`实际数值= ${currentVal}, max= ${maxVal}`)

    if (currentVal > maxVal) {
        // 重置为最大值，使用当前模式生成数字
        const mode = currentMode.value
        //防呆
        if (mode === 'three' && maxVal === 10.1){
            console.log('当前模式是 three，最大值10.1实际上是两位小数，应切到 two')
            return
        }
        const currentDigits = valueToDigits(currentVal, mode)
        const maxDigits = valueToDigits(maxVal, mode)
        
        console.log(`mode= ${mode}, ${currentDigits} -> ${maxDigits}`)
        for (let i = 0; i < currentDigits.length; i++) {
            if (currentDigits[i] !== maxDigits[i]){
                console.log(`滚动列 ${i} 时,超出最大值`)
                resetToMiddle(i, maxDigits[i]);
            }
        }
        return maxDigits
    }

    return selections
    
}

/**
 * 滚动元素滚动目标数字
 * @param {Object} colIndex - 当前滚动元素的索引,从0开始
 * @param {number} targetNumber 目标数字
 */
const resetToMiddle = (colIndex, targetNumber) => {
    const container = columnRefs.value[colIndex];
    if (!container) return;

    // 找到目标数字在中间区域附近的位置
    const data = multiData.value[colIndex];
    const middleStart = Math.floor(data.length / 2) - 20;
    let targetIndex = -1;
    for (let i = middleStart; i < middleStart + 40; i++) {
        if (data[i] % 10 === targetNumber) {
            targetIndex = i;
            break;
        }
    }
    if (targetIndex === -1) return;

    const containerHeight = container.clientHeight;
    let targetScrollTop = targetIndex * itemHeight - (containerHeight / 2) + (itemHeight / 2);
    targetScrollTop = Math.max(0, Math.min(targetScrollTop, container.scrollHeight - containerHeight));
    console.log('即将触发系统默认滚动事件, onMultiScroll')
    container.scrollTop = targetScrollTop;
};
  

/**
 * 设置列引用
 * @param {Object} el - 滚动元素
 * @param {Object} colIndex - 当前滚动元素的索引,从0开始
 */
const setColumnRef = (el, colIndex) => {
    if (el && !columnRefs.value[colIndex]) {
        columnRefs.value[colIndex] = el
    }
}

/** Test-roller-selector(single)********************************************/
            // 生成超长循环数据
const single_initLoopData = () => {
    loopData.value = []
    for (let i = 0; i < repeatCount; i++) {
        loopData.value.push(...baseData)
    }
}

const single_alignToHighlight = (value) => {
    if (single_isAdjusting) return
    single_isAdjusting = true

    // 找到第一个真实数字等于 value 的索引（取模后相等）
    const targetIndex = loopData.value.findIndex(v => (v % 10) === value)
    if (targetIndex === -1) {
        single_isAdjusting = false
        return
    }

    const container = wheel.value
    const containerHeight = container.clientHeight
    // 计算滚动位置使该项居中
    let targetScrollTop = targetIndex * itemHeight - (containerHeight / 2) + (itemHeight / 2)
    targetScrollTop = Math.max(0, targetScrollTop)
    container.scrollTop = targetScrollTop


    // 强制设置 currentValue
    currentValue.value = value
        
    setTimeout(() => {
        single_isAdjusting = false
    }, 100)
}

const single_getCenterValue = () => {
    const container = wheel.value
    const containerRect = container.getBoundingClientRect()
    const centerY = containerRect.top + containerRect.height / 2
    const items = container.querySelectorAll('.picker-wheel-item')
    for (let i = 0; i < items.length; i++) {
        const rect = items[i].getBoundingClientRect()
        if (rect.top <= centerY && rect.bottom >= centerY) {
            return loopData.value[i] % 10
        }
    }
    return currentValue.value
}

const single_onScroll = (event) => {
    if (single_isAdjusting) return
    if (single_scrollTimer) clearTimeout(single_scrollTimer)
    single_scrollTimer = setTimeout(() => {
        //找到位于容器中心点的那个 .picker-item 元素
        const realValue = single_getCenterValue()
        if (realValue !== currentValue.value) {
            currentValue.value = realValue
        }

        // 边界重置逻辑
        const scrollTop = event.target.scrollTop
        const displayIndex = Math.round(scrollTop / itemHeight)
        const total = loopData.value.length
        const threshold = 50
        if (displayIndex < threshold || displayIndex > total - threshold) {
            single_resetToMiddle(currentValue.value)
        }
    }, 50)
}

const single_resetToMiddle = (value) => {
    single_isAdjusting = true
    // 找到中间区域中值为 value 的索引
    const middleStartIndex = Math.floor(loopData.value.length / 2)
    let targetIndex = -1
    for (let i = middleStartIndex - 20; i <= middleStartIndex + 20; i++) {
        if (i >= 0 && i < loopData.value.length && (loopData.value[i] % 10) === value) {
            targetIndex = i
            break
        }
    }
    if (targetIndex === -1) {
        targetIndex = middleStartIndex
    }
    const container = wheel.value
    const containerHeight = container.clientHeight
    let targetScrollTop = targetIndex * itemHeight - (containerHeight / 2) + (itemHeight / 2)
    targetScrollTop = Math.max(0, targetScrollTop)
    container.scrollTop = targetScrollTop

    // 确保当前值不变
    if (currentValue.value !== value) {
        currentValue.value = value
    }

    setTimeout(() => {
        single_isAdjusting = false
    }, 50)
}
    


/***** Test-numeric-keypad********************************************/
        
// 判断数字键是否可用（用于键盘按钮）
const isNumberKeyDisabled = (inputValue) => {

    const predictvalue = finalvalue.value + inputValue

    // 只能有一个小数点,若当前值已含小数点,循环到“.”键时返回true,令“.”不可用
    if (inputValue === '.' && finalvalue.value.includes('.')) {
        return true
    }

    if (predictvalue.includes('.')) {
        const [integerPart, decimalPart] = predictvalue.split('.')
        // 限制整数位数
        if (integerPart.length > currentMaxIntegerPlaces.value) {
            return true
        }
        //限制小数位数
        let places = currentMaxValue.value === 10.1 && integerPart.length === 2 ? 2 : currentMaxDecimalPlaces.value
        if (decimalPart && decimalPart.length > places) {
            return true
        }
    } else {
        // 没有小数点的纯整数
        if (predictvalue.length > currentMaxIntegerPlaces.value) {
            return true
        }
    }
    
    //检查数值范围
    const testNumber = parseFloat(predictvalue);
    if (!isNaN(testNumber) && testNumber > currentMaxValue.value) {
        return true
    }
    
    return false
}

// 外键盘手动输入处理
const handleInput = (event) => {
    let value = event.target.value
    
    // 允许空值
    if (value === '') {
        finalvalue.value = ''
        return
    }
    
    // 只允许数字和小数点
    const regex = /^\d*\.?\d*$/
    if (!regex.test(value)) {
        event.target.value = finalvalue.value
        return
    }
    
    // 应用所有限制
    let formattedValue = applyNumberRestrictions(value)
    
    // 验证范围
    const number = parseFloat(formattedValue)
    if (!isNaN(number)) {
        if (number <= currentMaxValue.value) {
            finalvalue.value = formattedValue
            // 同步输入框的值
            if (event.target.value !== formattedValue) {
                event.target.value = formattedValue
            }
        } else {
            alert(`数值不能超过 ${currentMaxValue.value}`)
            event.target.value = finalvalue.value //恢复旧值
        }
    } else {
        event.target.value = finalvalue.value
    }
}
        
//数字键点击输入
const numberClick = (number) => {
    // 获取输入值
    let inputValue = ''
    switch(number) {
        case 10: 
            closeKeyboard()
            return;  // 特殊符号直接返回
        case 11: 
        inputValue = '0' 
        break
        case 12: 
        inputValue = '.' 
        break
        default: inputValue = number.toString()
    }

    // 检查当前键是否可用
    const isDisabled = isNumberKeyDisabled(inputValue)
    if (isDisabled) {
        return  // 不可用，不处理
    }
    
    // 构建新值
    let newValue = finalvalue.value + inputValue
    
    // 应用所有限制
    newValue = applyNumberRestrictions(newValue)
    
    // 验证数值范围
    const newnumber = parseFloat(newValue)
    if (!isNaN(newnumber)) {
        if (newnumber <= currentMaxValue.value) {
            finalvalue.value = newValue
        } else {
            alert(`数值不能超过 ${currentMaxValue.value}`)
        }
    }
}
 
const applyNumberRestrictions = (value) => {
    let result = value
    
    // 1. 处理多个小数点
    const dotCount = (result.match(/\./g) || []).length
    if (dotCount > 1) {
        const firstDotIndex = result.indexOf('.')
        result = result.substring(0, firstDotIndex + 1) + 
                    result.substring(firstDotIndex + 1).replace(/\./g, '')
    }
    
    if (result.includes('.')) {
        const [integerPart, decimalPart] = result.split('.')

        // 2. 限制整数位数
        if (integerPart.length > currentMaxIntegerPlaces.value) {
            // 整数部分超长，截断
            const truncatedInteger = integerPart.substring(0, currentMaxIntegerPlaces.value)
            result = truncatedInteger + '.' + decimalPart
        }

        // 3. 限制小数位数//限制小数位数
        let places = currentMaxValue.value === 10.1 && integerPart.length === 2 ? 2 : currentMaxDecimalPlaces.value
        if (decimalPart && decimalPart.length > places) {
            result = integerPart + '.' + decimalPart.substring(0, places)
        }
    } else {
        // 没有小数点的纯整数
        if (result.length > currentMaxIntegerPlaces.value) {
            result = result.substring(0, currentMaxIntegerPlaces.value)
        }
    }
    
    // 4. 处理前导零
    if (result.startsWith('0') && result.length > 1 && !result.startsWith('0.')) {
        result = result.replace(/^0+/, '')
        if (result === '' || result === '.') {
            result = '0'
        }
    }
    
    // 处理以小数点开头
    if (result === '.') {
        result = '0.'
    }
    
    return result
}

const deleteNumber = () => {
    if (finalvalue.value && finalvalue.value.length > 0) {
        finalvalue.value = finalvalue.value.slice(0, -1)
    }
}

const clearNumber = () => {
    finalvalue.value = ''
}

const confirmNumber = () => {
    // 确认输入
    if (finalvalue.value === '' || finalvalue.value === null) {
        alert('请输入数值')
        return
    }

    const number = parseFloat(finalvalue.value)
    if (!isNaN(number) && number <= 30.5) {
        console.log('确认数值:', number)
        this.$emit('confirm', number)
    } else {
        alert(`请输入不超过 ${currentMaxValue.value} 的有效数值`)
    }
}

const closeKeyboard = () => {
    console.log('close-keyboard')
}


/********************************************* 
* watch
********************************************/
// 1. 数据源：如果是 ref，直接写 selectedConfig；如果是 reactive 对象属性，用箭头函数 () => selectedConfig
watch(selectedConfig, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        console.log('配置发生了变化')
        // 重置默认选择为全0，避免旧值影响
        defaultSelections.value = Array(4).fill(0)
        initLoopData(newVal)
    }
},
{
    deep: true // 3. 深度监听配置
})


/********************************************* 
* mounted
********************************************/
onMounted(() => {
    /***** Test-roller-selector(multiplus) **********/
    // initLoopData(numberInputConfig.value[0])
    const config = numberInputConfig.value[2] // 直接使用10.1配置
    selectedConfig.value = config
    initLoopData(config)

    /***** Test-roller-selector(single) **********/
    single_initLoopData()
    nextTick(() => {
        // 初始对齐
        single_alignToHighlight(currentValue.value)
    })
})

onUnmounted(() => {
    if (scrollTimer) clearTimeout(scrollTimer);
    if (wheelTimer) clearTimeout(wheelTimer);
});
</script>


<style scoped>
.parent-container select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.parent-container input {
    margin: 10px 0px;
}

/* 数字键盘容器 */
.keyboard-container{
    display: flex;
    border: 2px solid #0cb04c;
    border-radius: 8px;
}

.group-list {
    background-color: transparent;
    width: 80%; 
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3列等宽 */
    gap: 8px; /* 设置行间距和列间距 */
    overflow-y: auto;
    padding: 8px;
    background-color: inherit;
    border-radius: 8px;
}

.group-item{
    border: 1px solid #ddd;
    border-radius: 5px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s;
}

.group-item.special{
    background-color: #a7a7a7ae;
}

.group-item.disabled{
    background-color: #e0e0e0;
    color: #999;
    cursor: not-allowed;
    opacity: 0.6;
}

.keyboard-actions{
    width: 20%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 8px 8px 0;
    border-radius: 8px;
}

.keyboard-actions button{
    background-color: #a7a7a7ae;
    border: none;
    height: 30px;
    border-radius: 5px;
}

.keyboard-actions button:last-child{
    flex: 1;
}

/* 滚轮容器 */
/* 多列布局主容器 */
.picker-multi-column {
    position: relative;
    /* background-color: #d9d9d9; */
    width: 100%;
    height: 240px;
    flex: 1;
    display: flex;
    border-radius: 0.5vw;
    overflow: hidden;
    box-sizing: border-box;
    justify-content: space-around;
}

.picker-wheel-container {
    background: #2c2c2e;
    border-radius: 16px;
    width: 120px;
    height: 240px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 滚动区域 */
.picker-wheel {
    height: 100%;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
}

/* 隐藏滚动条 */
.picker-wheel::-webkit-scrollbar {
    display: none;
}

/* 每个选项 */
.picker-wheel-item {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 500;
    color: #ffffff;
    scroll-snap-align: center;
    transition: all 0.1s;
}

/* 选中样式 */
.picker-wheel-item.selected {
    color: #ff9f0a;
    font-size: 32px;
    font-weight: 600;
}

/* 上下渐变遮罩，模拟 iOS 风格 */
.picker-wheel-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(
        to bottom,
        rgba(44, 44, 46, 0.95) 0%,
        rgba(44, 44, 46, 0.6) 20%,
        rgba(44, 44, 46, 0) 40%,
        rgba(44, 44, 46, 0) 60%,
        rgba(44, 44, 46, 0.6) 80%,
        rgba(44, 44, 46, 0.95) 100%
    );
}

/* 高亮指示器 */
.picker-wheel-highlight {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 50px;
    transform: translateY(-50%);
    background: rgba(255, 159, 10, 0.1);
    border-top: 1px solid #3a3a3c;
    border-bottom: 1px solid #3a3a3c;
    pointer-events: none;
}

.selected-value {
    text-align: center;
    margin-top: 20px;
    font-size: 28px;
    font-weight: 600;
    color: #ff9f0a;
}

.decimal-point{
    position: absolute;
    height: 48px;
    /* background-color: #0B8CE8; */
    border-radius: 0.5vw;
    top: 50%;
    transform: translateY(-50%);
    font-family: Bahnschrift;
    font-size: 48px;
    left: 49%;
}

.three-decimal-dot{
    left: 24%;
}
</style>