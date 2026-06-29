// components/test/TestTableviewComponent.vue

<template>
    <div>
        <!-- 顶部控制栏：增加模式切换按钮 -->
        <div class="mode-switcher">
            <span class="label">当前模式:</span>
            
            <!-- 动态显示当前模式文本 -->
            <span :class="{ selected: !allowMultipleSelection }">
                单选
            </span>
            &nbsp;|&nbsp;
            <span :class="{ selected: allowMultipleSelection }">
                多选
            </span>

            <!-- 切换按钮 -->
            <button 
                @click="toggleSelectionMode">
                {{ allowMultipleSelection ? '切换到单选模式' : '切换到多选模式' }}
            </button>

            <button
                @click="toggleDebuginfo">
                {{ allowDebug ? '隐藏调试信息' : '显示调试信息'  }}
            </button>
        </div>

        <!-- 使用 TableviewComponent 组件 -->
        <!-- 使用 v-model:sectionData 实现双向绑定 -->
        <TableviewComponent 
            ref="tableView"
            v-model:sectionData="myData"
            :debug="allowDebug"
            :allowMultipleSelection="allowMultipleSelection"
            @row-click="onRowClick"
            @selection-change="onSelectionChange"/>

        <!-- TableView 事件 -->
        <div class="actions">
            <button @click="insertNewRow">插入新行</button>

            <!-- 直接使用本地的 hasSelection 和 selectedCount，保证响应式 -->
            <button 
                :disabled="!selectionState.hasSelection"
                @click="deleteSelectedRow">
                删除选中行 ({{ selectionState.count }})
            </button>

            <button v-if="selectionState.hasSelection" @click="getSelection">获取选中数据</button>
            <button v-else @click="getSelection" disabled>请先选中数据</button>
            <button @click="reloadData">重新加载数据</button>
        </div>

        <div v-if="allowDebug && lastClicked" class="last-click">
            <!--显示当前选中的数量 -->
            <div v-if="selectionState.hasSelection" style="margin-top: 10px; color: green;">
                已选中 {{ selectionState.count }} 项
            </div>
            上次点击: 分区 {{ lastClicked.section }} - 行 {{ lastClicked.row }}
            <br>
            数据: {{ JSON.stringify(lastClicked.item) }}
        </div>
    </div>  
</template>

<script setup>
/********************************************* 
*  使用 Composition API
********************************************/
import { ref, nextTick } from 'vue'
import { toast } from '../../utils/toast.js' //具名导入
//默认导入,TableViewComponent.vue 文件没有通过 export 导出任何具名变量，它只是一个单文件组件，默认导出是组件本身
import TableviewComponent from '../../components/TableViewComponent.vue' 

/********************************************* 
* 数据定义
********************************************/
const myData = ref([
    {
        title: '常用联系人',
        items: [
            { icon: '👤', title: '张三', subtitle: '在线', accessory: '3分钟前', type: 'contact' },
            { icon: '👩', title: '李四', subtitle: '离线', accessory: '昨天', type: 'contact' },
            { icon: '🧑', title: '王五', subtitle: '忙碌', accessory: '2小时前', type: 'contact' }
        ]
    },
    {
        title: '最近聊天',
        items: [
            { icon: '💬', title: '产品讨论组', subtitle: '李明：好的', accessory: '12:30', type: 'group' },
            { icon: '📢', title: '系统通知', subtitle: '订单已发货', accessory: '10:15', type: 'system' },
            { icon: '👥', title: '项目团队', subtitle: '张伟：会议改到3点', accessory: '昨天', type: 'group'}
        ]
    }
])
const lastClicked = ref(null)
const allowMultipleSelection = ref(false)
const allowDebug = ref(false)

// 存储子组件的选中状态，由子组件事件驱动更新, 确保状态同步
const selectionState = ref({
  hasSelection: false,
  count: 0,
  selectedRow: null,
  selectedRows: []
})

/********************************************* 
  * DOM 引用
  ********************************************/

const tableView = ref(null)

/********************************************* 
* computed
    必须使用 const 变量名 = computed(() => { ... }) 的格式
********************************************/

/********************************************* 
* 方法定义
********************************************/
const toggleDebuginfo = () => {
    allowDebug.value = !allowDebug.value
    console.log('allowDebug: ',allowDebug.value)
}

// 处理子组件传来的选中变化事件
const onSelectionChange = (payload) => {
    selectionState.value = payload
    console.log('Selection Updated:', payload)
}

const toggleSelectionMode = () => {
    allowMultipleSelection.value = !allowMultipleSelection.value
    // 切换模式时，子组件的 watch 会自动处理状态转换并触发 @selection-change
    // 所以这里不需要手动调用 onSelectionChange，子组件会通知
    console.log(`模式已切换为: ${allowMultipleSelection.value ? '多选' : '单选'}`);
}

const onRowClick = (eventData) => {
    if (lastClicked.value && 
        lastClicked.value.section === eventData.section && 
        lastClicked.value.row === eventData.row) {

        tableView.value.deselectRow(eventData.section, eventData.row)
        lastClicked.value = null  // 清空选中记录
    } else {
        lastClicked.value = eventData
        // 对应 this.$emit('row-click', object)
        //console.log('父组件收到子组件的自定义事件 row-click 传递的负责对象:', eventData)
    }
}
        
const onDataChanged = (newData) => {
    // 对应子组件的 this.$emit('data-changed', this.sectionData)
    console.log('子组件的自定义事件 data-changed:', newData)
}

const insertNewRow = () => {
    const newItem = {
        icon: '🧔',
        title: `赵六 ${new Date().toLocaleTimeString()}`,
        subtitle: '请勿打扰',
        accessory: '刚刚',
        type: 'contact'
    }

    //通过 ref 访问子组件实例，然后调用子组件的方法 insertRow()
    tableView.value.insertRow(0, newItem, 'last')
}
        
// 删除选中的行
const deleteSelectedRow = () => {
    if (!selectionState.value.hasSelection) {
        toast.info('请先选中要删除的行')
        return
    }
    
    // 根据当前模式处理删除,倒序删除以避免索引错乱
    if (allowMultipleSelection.value) {
        // 注意：这里需要深拷贝一份索引列表，因为删除操作会改变原数组结构
        const rowsToDelete = [...selectionState.value.selectedRows]
        
        // 按 section 分组，每个 section 内按 row 倒序排序，排序后调用子组件的删除方法, 确保删除时索引正确
        //let deleteQueue = rowsToDelete.map(sel => ({ section: sel.section, row: sel.row }))

        // 排序：先按 section 降序，再按 row 降序。这样删除时不会影响前面的索引
        deleteQueue.sort((a, b) => {
            if (b.section !== a.section) return b.section - a.section
            return b.row - a.row
        })

        deleteQueue.forEach(item => {
            tableView.value.deleteRow(item.section, item.row)
        })
        
        console.log(`批量删除了 ${rowsToDelete.length} 行`)
    } else {
        // 单选模式
        const { section, row } = selectionState.value.selectedRow
        if (section !== null) {
        tableView.value.deleteRow(section, row)
        }
    }
}
 
// 获取选中的数据
const getSelection = () => {
    if (!selectionState.value.hasSelection) {
        toast.info('请先选中数据')
        return
    }
    
    // 统一调用子组件的 getSelectedItems 方法，它已经处理了单选转数组的逻辑
    const selected = tableView.value.getSelectedItems()
    
    if (selected.length > 0) {
        console.log('选中的数据:', selected)
        alert(`已选中 ${selected.length} 项:\n` + JSON.stringify(selected.map(s => s.item.title), null, 2))
    }
}
    
    //刷新数据并重置界面状态
const reloadData = () => {
    // 关键：必须重新赋值 myData，触发 Vue 的响应式更新
    // 如果数据是从服务器获取的，这里应该是 myData.value = res.data
    myData.value = JSON.parse(JSON.stringify(myData.value)) 
    if (tableView.value) {
        tableView.value.reloadData()
    }
    console.log('数据已刷新')
}

</script>


<style scoped>

/* 模式切换栏 */
.mode-switcher {
    background: #f5f5f5;
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 8px;
}

.mode-switcher .label {
    margin-right: 10px;
    font-weight: bold;
}

/* 针对 class=mode-switcher 后续不是 class=label 的 span,被选中的样式 */
.mode-switcher span:not(.label).selected{
    color: blue;
    font-weight: bold;
}

.mode-switcher span:not(.label) {
    color: gray;
    font-weight: normal;
}

.mode-switcher button{
    margin-left: 15px;
    padding: 5px 10px;
    cursor: pointer;
}


/* 操作按钮区域 */
.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.actions button {
  padding: 8px 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background: #1976d2;
}

.actions button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
}


.actions button:hover:not(:disabled) {
    background-color: #0056b3;
    transform: translateY(-1px);
}


/* 最后点击行的调试信息 */
.last-click {
  margin-top: 20px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
}

/* 模式切换栏 */
.mode-switcher {
    background: #f5f5f5;
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 8px;
}

.mode-switcher .label {
    margin-right: 10px;
    font-weight: bold;
}

/* 针对 class=mode-switcher 后续不是 class=label 的 span,被选中的样式 */
.mode-switcher span:not(.label).selected{
    color: blue;
    font-weight: bold;
}

.mode-switcher span:not(.label) {
    color: gray;
    font-weight: normal;
}

.mode-switcher button{
    margin-left: 15px;
    padding: 5px 10px;
    cursor: pointer;
}


/* 操作按钮区域 */
.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.actions button {
  padding: 8px 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background: #1976d2;
}

.actions button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
}


.actions button:hover:not(:disabled) {
    background-color: #0056b3;
    transform: translateY(-1px);
}


/* 最后点击行的调试信息 */
.last-click {
  margin-top: 20px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
}

</style>


