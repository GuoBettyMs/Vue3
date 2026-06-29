<template>
    <div>
      <div class="table-container">
        <table id="table-4">
          <thead>
            <tr>
              <th>1<sup>3</sup> 等于：</th>
              <th>2<sup>3</sup> 等于：</th>
              <th>3<sup>3</sup> 等于：</th>
              <th>4<sup>3</sup> 等于：</th>
              <th>5<sup>3</sup> 等于：</th>
              <th>6<sup>3</sup> 等于：</th>
              <th>7<sup>3</sup> 等于：</th>
            </tr>
          </thead>  
          <tbody>
            <tr>
              <td>row 1: 1</td>
              <td>row 1: 8</td>
              <td>row 1: 27</td>
              <td>row 1: 64</td>
              <td>row 1: 125</td>
              <td>row 1: 216</td>
              <td>row 1: 343</td>
            </tr>
            <tr>
              <td>row 2: 1</td>
              <td>row 2: 8</td>
              <td>row 2: 27</td>
              <td>row 2: 64</td>
              <td>row 2: 125</td>
              <td>row 2: 216</td>
              <td>row 2: 343</td>
            </tr>
            <tr>
              <td>row 3: 1</td>
              <td>row 3: 8</td>
              <td>row 3: 27</td>
              <td>row 3: 64</td>
              <td>row 3: 125</td>
              <td>row 3: 216</td>
              <td>row 3: 343</td>
            </tr>
            <tr>
              <td>row 4: 1</td>
              <td>row 4: 8</td>
              <td>row 4: 27</td>
              <td>row 4: 64</td>
              <td>row 4: 125</td>
              <td>row 4: 216</td>
              <td>row 4: 343</td>
            </tr>
            <tr>
              <td>row 5: 1</td>
              <td>row 5: 8</td>
              <td>row 5: 27</td>
              <td>row 5: 64</td>
              <td>row 5: 125</td>
              <td>row 5: 216</td>
              <td>row 5: 343</td>
            </tr>
            <tr>
              <td>row 6: 1</td>
              <td>row 6: 8</td>
              <td>row 6: 27</td>
              <td>row 6: 64</td>
              <td>row 6: 125</td>
              <td>row 6: 216</td>
              <td>row 6: 343</td>
            </tr>
            <tr>
              <td>row 7: 1</td>
              <td>row 7: 8</td>
              <td>row 7: 27</td>
              <td>row 7: 64</td>
              <td>row 7: 125</td>
              <td>row 7: 216</td>
              <td>row 7: 343</td>
            </tr>
            <tr>
              <td>row 8: 1</td>
              <td>row 8: 8</td>
              <td>row 8: 27</td>
              <td>row 8: 64</td>
              <td>row 8: 125</td>
              <td>row 8: 216</td>
              <td>row 8: 343</td>
            </tr>
            <tr>
              <td>row 9: 1</td>
              <td>row 9: 8</td>
              <td>row 9: 27</td>
              <td>row 9: 64</td>
              <td>row 9: 125</td>
              <td>row 9: 216</td>
              <td>row 9: 343</td>
            </tr>
            <tr>
              <td>row 10: 1</td>
              <td>row 10: 8</td>
              <td>row 10: 27</td>
              <td>row 10: 64</td>
              <td>row 10: 125</td>
              <td>row 10: 216</td>
              <td>row 10: 343</td>
            </tr>
            <tr>
              <td>row 11: 1</td>
              <td>row 11: 8</td>
              <td>row 11: 27</td>
              <td>row 11: 64</td>
              <td>row 11: 125</td>
              <td>row 11: 216</td>
              <td>row 11: 343</td>
            </tr>
          </tbody>  
        </table>

        <table id="table-3" ref="table3">
          <caption>
            点击表头对行进行排序
          </caption>
          <thead>
            <tr>
              <th>数字</th>
              <th>字母</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3</td>
              <td>A</td>
            </tr>
            <tr>
              <td>2</td>
              <td>B</td>
            </tr>
            <tr>
              <td>1</td>
              <td>C</td>
            </tr>
          </tbody>
        </table>


        <table id="table-2">
          <!- 展示一个表格的标题 ->
          <caption>
            个人每周活动
          </caption>

          <!-- colgroup 定义了表格中的一组列
            span: 指定 <col> 元素跨列的连续列数。该值必须是大于 0 的正整数。如果不存在，其默认值为 1
            如果 <colgroup> 中存在一个或多个 <col> 元素，则不允许使用 span 属性
          -->
          <colgroup span="5" class="weekdays"></colgroup>
          <colgroup span="2" class="weekend"></colgroup>

          <thead>
            <!- tr 表格行 ->
            <tr>
              <th>周一</th>
              <th>周二</th>
              <th>周三</th>
              <th>周四</th>
              <th>周五</th>
              <th>周六</th>
              <th>周日</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>打扫房间</td>
              <td>足球训练</td>
              <td>舞蹈课</td>
              <td>历史课</td>
              <td>买饮料</td>
              <td>自习</td>
              <td>自由时间</td>
            </tr>
            <tr>
              <td>瑜伽</td>
              <td>棋类俱乐部</td>
              <td>见朋友</td>
              <td>体操</td>
              <td>生日派对</td>
              <td>钓鱼之旅</td>
              <td>自由时间</td>
            </tr>
          </tbody>
        </table>

        <table id="table-1" >
          <caption>
            Front-end web developer course 2021
          </caption>
          
          <!- thead 表头 ->
          <thead>
            <tr>

              <!- scope="col" 描述该单元格处于一列的顶部;th 定义表格内的表头单元格 ->
              <th scope="col">Person</th>
              <th scope="col">Most interest in</th>
              <th scope="col">Age</th>
            </tr>
          </thead>

          <!- tbody 表格主体 ->
          <tbody>
            <tr>
              <th scope="row">Chris</th>

              <!- td 表格中包含数据的单元格 -> 
              <td>HTML tables</td>
              <td>22</td>
            </tr>
            <tr>
              <th scope="row">Dennis</th>
              <td>Web accessibility</td>
              <td>45</td>
            </tr>
            <tr>
              <th scope="row">Sarah</th>
              <td>JavaScript frameworks</td>
              <td>29</td>
            </tr>
            <tr>
              <th scope="row">Karen</th>
              <td>Web performance</td>
              <td>36</td>
            </tr>
          </tbody>

          <!- tfoot 表尾 ->
          <tfoot>
            <tr>

              <!- scope="row" 描述该单元格是某一行的第一个;  colspan="2" 合并相邻的两列 ->
              <th scope="row" colspan="2">Average age</th>
              <td>33</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="select-container">
        <label for="pet-select">Choose a pet:</label>
        <select name="pets" id="pet-select">
            <option value="">--Please choose an option--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
        </select>

        <br>

        <label>Please choose one or more pets:
        <select name="pets" multiple size="7">
            <optgroup label="4-legged pets">
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster" disabled>Hamster</option>
            </optgroup>
            <optgroup label="Flying pets">
            <option value="parrot">Parrot</option>
            <option value="macaw">Macaw</option>
            <option value="albatross">Albatross</option>
            </optgroup>
        </select>
        </label>
      </div>

      <!-- 自定义多列滚轮选择器 -->
       <div>
          <div class="roller-selector-container">
              <div class="picker-toolbar">
                  <button class="cancel-btn" @click="cancelMultiSelection">取消</button>
                  
                  <select 
                      name="numberInput" 
                      id="number-input-select"
                      @change="onConfigChange">
                      <option value="">--Please choose a value--</option>
                      <option 
                          v-for="(config, index) in numberInputConfig"
                          :key="index"
                          :value="config.maxValue">
                          {{ config.maxValue }} 
                      </option>
                  </select>
                  
                  <button class="confirm-btn" @click="confirmMultiSelection">完成</button>
              </div>

              <div class="picker-multi-column">
                  <div 
                      v-for="(column, colIndex) in multiData" 
                      :key="colIndex"
                      class="picker-column">

                      <!-- 使用函数 ref 保存每一列的引用
                          :ref	Vue 的 ref 绑定指令（动态绑定）
                          el => setColumnRef(el, colIndex)	箭头函数，接收 DOM 元素作为参数
                          setColumnRef	自定义方法，用于保存 DOM 引用
                      -->
                      <div 
                          class="picker-wheel-column"
                          :ref="el => setColumnRef(el, colIndex)"
                          @scroll="onMultiScroll(colIndex, $event)">
                          
                          <div 
                              v-for="(item, rowIndex) in column" 
                              :key="rowIndex"
                              class="picker-item"
                              :class="{ 'selected': selectedMultiIndex[colIndex] === rowIndex }">
                              {{ item }}
                          </div>

                      </div>
                      <div class="picker-mask"></div>
                      <div class="picker-highlight"></div>
                  </div>
              </div>

              <div class="result">
                  <div class="result-label">当前选中</div>
                  <div class="result-value">{{ selectedMultiText }}</div>
              </div>
          </div>
      </div>
    </div>
</template>

<script setup>
// 1. 使用 Composition API
import { ref, onMounted, computed } from 'vue'
import { nextTick } from 'vue'

//table-container
const table3 = ref(null)

//Test-roller-selector
const selectedConfig = ref(null)
const numberInputConfig = ref([ // 基础数据配置
  { 
      maxValue: '城市', 
      pickerData: {
          columns: [
              ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉'],
              ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '通州区'],
              ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号',
                  '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号'],
              ['0','1','2','3','4','5','6','7','8','9']
          ],
          defaultSelections: [0, 0, 0, 0]
      }
  },
  { 
      maxValue: '水果', 
      pickerData: {
          columns: [
              ['苹果', '香蕉', '橙子', '葡萄', '西瓜', '草莓', '芒果'],
              ['红色', '绿色', '蓝色', '黄色', '紫色', '橙色'],
              ['小号', '中号', '大号', '特大号'],
              ['1个', '2个', '3个', '4个', '5个']
          ],
          defaultSelections: [0, 0, 0, 0]
      }
  }
])
const multiData = ref([]) // 当前显示的多列数据
const selectedMultiIndex = ref([])
const columnRefs = ref({})
const initialMultiIndex = ref([])
const isResetting = ref(false) // 正在重置数据/初始化
const itemHeight = 44 // 不需要 ref，这是常量


/********************************************* 
  * computed
  ********************************************/

  //返回选择的多列文本
const selectedMultiText = computed(() => {
    if (!multiData.value.length) return ''
    return multiData.value.map((column, idx) => column[selectedMultiIndex.value[idx]]).join(' - ')
})

/********************************************* 
  * 方法定义
  ********************************************/
 // 选择配置
const onConfigChange = (event) => {
  const maxValue = event.target.value
  if (maxValue === '') {
      selectedConfig.value = null
      loadConfigData(numberInputConfig.value[0])// 重置为默认数据
      return
  }
            
  const config = numberInputConfig.value.find(c => c.maxValue.toString() === maxValue)
  if (config) {
      selectedConfig.value = config
      loadConfigData(config)// 根据选中的配置加载对应的数据
  }
}
       
// 加载配置对应的数据
const loadConfigData = (config) => {
  // 重置滚动标记
  isResetting.value = true
      
  // 获取配置中的数据
  const pickerData = config.pickerData
  if (pickerData) {
      // 深拷贝数据
      multiData.value = JSON.parse(JSON.stringify(pickerData.columns))
      selectedMultiIndex.value = [...pickerData.defaultSelections]
      initialMultiIndex.value = [...pickerData.defaultSelections]
  }
      
  // 清空旧的列引用
  columnRefs.value = {}
  
  // 等待 DOM 更新后重新初始化滚动位置
  nextTick(() => {
      initScrollPositions()
      setTimeout(() => {
          isResetting.value = false
      }, 200)
  })
}
        
 
        // 初始化所有列的滚动位置
const initScrollPositions = () => {
    Object.keys(columnRefs.value).forEach(colIndex => {
        const el = columnRefs.value[colIndex]
        if (el && selectedMultiIndex.value[colIndex] !== undefined) {
            const targetScrollTop = getTargetScrollTop(selectedMultiIndex.value[colIndex])
            el.scrollTop = targetScrollTop
        }
    })
}
        
        // 获取目标滚动位置
const getTargetScrollTop = (index) => {
  return index * itemHeight
}
        
        // 多列滚动处理
const onMultiScroll = (colIndex, event) => {
    if (isResetting.value) return
            
    const scrollTop = event.target.scrollTop
    const index = Math.round((scrollTop) / itemHeight)
    const maxIndex = multiData.value[colIndex]?.length - 1 || 0
    const validIndex = Math.min(Math.max(0, index), maxIndex)
            
    if (validIndex !== selectedMultiIndex.value[colIndex]) {
      // 直接修改数组元素，Vue 3 会自动触发响应式
        selectedMultiIndex.value[colIndex] = validIndex
    }
}
        
        // 设置列引用
const setColumnRef = (el, colIndex) => {
  if (el && !columnRefs.value[colIndex]) {
      columnRefs.value[colIndex] = el
      
      if (selectedMultiIndex.value[colIndex] !== undefined) {
          const targetScrollTop = getTargetScrollTop(selectedMultiIndex.value[colIndex])
          if (Math.abs(el.scrollTop - targetScrollTop) > 1) {
              el.scrollTop = targetScrollTop
          }
      }
  }
}
        
// 保存当前选中状态
const saveInitialState = () => {
    initialMultiIndex.value = [...selectedMultiIndex.value]
}
        
// 重置到初始状态
const resetToInitial = () => {
    isResetting.value = true
    selectedMultiIndex.value = [...initialMultiIndex.value]
    
    nextTick(() => {
        selectedMultiIndex.value.forEach((index, colIndex) => {
            const el = columnRefs.value[colIndex]
            if (el) {
                const targetScrollTop = getTargetScrollTop(index)
                el.scrollTop = targetScrollTop
            }
        })
        
        setTimeout(() => {
            isResetting.value = false
        }, 150)
    })
}
        
// 多列确认
const confirmMultiSelection = () => {
    initialMultiIndex.value = [...selectedMultiIndex.value]
    console.log(`选中: ${selectedMultiText.value}(${selectedMultiIndex.value})`)
}

// 多列取消
const cancelMultiSelection = () => {
    console.log(`重置前选中: ${selectedMultiText.value}(${selectedMultiIndex.value})`)
    resetToInitial()
}

/********************************************* 
  * onMounted
  ********************************************/
onMounted(() => {
//Test-roller-selector
  // 初始化默认数据
  loadConfigData(numberInputConfig.value[0])
  saveInitialState()

//table-container
  // 1. 获取真实的 DOM 元素 (不要直接遍历 ref 对象)
  const tableElement = table3.value

  // 2. 增加一个安全检查，防止元素不存在报错
  if (!tableElement) return

  // ✅ 检查是否有 thead
  if (!tableElement.tHead) {
    console.warn('表格没有 thead，跳过排序功能')
    return
  }

  // ✅ 检查是否有 tbody
  if (!tableElement.tBodies || tableElement.tBodies.length === 0) {
    console.warn('表格没有 tbody，跳过排序功能')
    return
  }

  const tBody = tableElement.tBodies[0]
  const rows = Array.from(tBody.rows)

  // ✅ 检查 thead 是否有行
  if (!tableElement.tHead.rows || tableElement.tHead.rows.length === 0) return

  const headerCells = tableElement.tHead.rows[0].cells
  
  // 3. 遍历表头单元格
  for (const th of headerCells) {
    const cellIndex = th.cellIndex
    th.addEventListener("click", () => {
      rows.sort((tr1, tr2) => {
        const tr1Text = tr1.cells[cellIndex].textContent
        const tr2Text = tr2.cells[cellIndex].textContent
        return tr1Text.localeCompare(tr2Text)
      })
      tBody.append(...rows)
    })
  }
})
</script>

<style scoped>
/********************************************* 
 * select
 ********************************************/

.roller-selector-container{
    border-radius: 10px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    margin-top: 20px;
}

.roller-selector-container select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

/* 工具栏 */
.picker-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 12px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    gap: 20px;
}

.picker-toolbar button {
    border: none;
    background: none;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s;
}

.cancel-btn {
    color: #999;
}

.cancel-btn:hover {
    background-color: #f0f0f0;
}

.confirm-btn {
    color: #007aff;
}

.confirm-btn:hover {
    background-color: #e3f2fd;
}

.picker-title {
    font-weight: 500;
    color: #333;
    line-height: 36px;
}

/* 多列布局主容器 */
.picker-multi-column {
    display: flex;
    height: 240px;
}

/* Picker 主容器 */
.picker-column {
    flex: 1;
    position: relative;
    overflow: hidden;
    border-right: 1px solid #e0e0e0;
    height: 100%;
}

.picker-column:last-child {
    border-right: none;
}

/* 滚动容器 */
.picker-wheel-column {
    height: 100%;
    overflow-y: auto; /* 允许垂直滚动 */
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth; /* 避免惯性动画干扰*/
    will-change: scroll-position;
    padding: 100px 0;  /* 添加上下 padding，增加滚动空间，让首尾选项能滚动到中间 */
}

/* 隐藏滚动条 */
.picker-wheel-column::-webkit-scrollbar {
    display: none;
}


/* 选项 */
.picker-item {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #333;
    scroll-snap-align: center;/* 吸附到中间 */
    scroll-snap-stop: always;/* 强制停止 */
    transition: all 0.2s;
}


.picker-item.selected {
    font-size: 22px;
    font-weight: 600;
    color: #007aff;
}

/* 遮罩层 */
.picker-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.6) 20%,
        rgba(255, 255, 255, 0) 40%,
        rgba(255, 255, 255, 0) 60%,
        rgba(255, 255, 255, 0.6) 80%,
        rgba(255, 255, 255, 0.95) 100%
    );
}

/* 高亮指示器 */
.picker-highlight {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 44px;
    transform: translateY(-50%);
    background: linear-gradient(
        to bottom,
        rgba(0, 122, 255, 0.05),
        rgba(0, 122, 255, 0.1),
        rgba(0, 122, 255, 0.05)
    );
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    pointer-events: none;
}

/* 结果显示 */
.result {
    padding: 20px;
    background: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    text-align: center;
}

.result-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 8px;
}

.result-value {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

/********************************************* 
 * table
 ********************************************/
.table-container table {
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-family: sans-serif;
  letter-spacing: 1px;
}

.table-container caption {
  padding: 10px;
  font-weight: bold;
}

.table-container thead,
.table-container tfoot {
  background-color: rgb(228 240 245);
}

.table-container th,
.table-container td {
  border: 1px solid rgb(160 160 160);
  padding: 8px 10px;
  text-align: center;
}

#table-1 caption{
  caption-side: bottom;
}


#table-1 tbody td:first-of-type {
  text-align: start;
}

/* 给表格的偶数行添加背景色，实现斑马纹（zebra striping）效果

  .table-container	选中 class 为 table-container 的元素
  tbody	选中该容器内的 <tbody> 元素
  >	子代选择器，只选直接子元素
  tr	选中 <tr> 元素
  :nth-of-type(even)	选中偶数位置的同类元素

  总结:在 class 为 table-container 的元素内部，找到 <tbody> 元素，然后选中它下面所有的直接子元素 <tr>，
      最后在这些 <tr> 中，挑出第偶数个，给它们设置背景色
  ⚠️  tbody tr 表示所有在 tbody 内的 tr（包括嵌套的）
      tbody > tr	表示只有 tbody 的直接子元素 tr
*/
#table-1 tbody > tr:nth-of-type(even) {
  background-color: rgb(237 238 242);
}

#table-1 tfoot th {
  text-align: right;
}

#table-1 tfoot td {
  font-weight: bold;
}


.weekdays {
  background-color: #d7d9f2;
}

.weekend {
  background-color: #ffe8d4;
}

#table-4{
  width: 100%;
  max-width: 400px;
  height: 240px;
  margin: 0 auto;
  display: block; /* 视觉显示为宽400高240的可滚动块 */
  overflow-x: auto;
}


#table-4 tbody {
  white-space: nowrap;  
}

#table-4 th,
#table-4 td {
  padding: 5px 10px;/* 紧凑型表格 */
  border-top-width: 0;
  border-left-width: 0;
}

#table-4 th {
  position: sticky; 
  top: 0;
  background: #fff;
  vertical-align: bottom;
}

#table-4 th:last-child,
#table-4 td:last-child {
  border-right-width: 0;
}

#table-4 tr:last-child td {
  border-bottom-width: 0;
}

</style>