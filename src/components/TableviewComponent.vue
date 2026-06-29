// components/TableviewComponent.vue

<template>
    <div class="table-view-container">
        <!-- 直接通过 props 变量遍历所有分区 -->
        <div v-for="(section, sectionIndex) in props.sectionData" 
            :key="sectionIndex">

            <!-- 分区头部 -->
            <div class="section-header">{{ section.title }}</div>
            
            <!-- 分区内容 - 显示数据或空状态 -->
            <div class="table-view-content">
                <!-- 空状态显示 -->
                <div v-if="!section.items || section.items.length === 0"  class="empty-state">
                    暂无数据
                </div>
                
                <!-- 遍历分区内的行数据 -->
                <div v-for="(item, rowIndex) in section.items" 
                    :key="sectionIndex + '-' + rowIndex"
                    class="table-view-cell"
                    :class="{ 
                        selected: isSelected(sectionIndex, rowIndex),
                        [item.type]: item.type 
                    }"
                    @click="handleRowClick(sectionIndex, rowIndex, item, $event)">
                    <!-- 左侧图标 -->
                    <div class="cell-icon">{{ item.icon }}</div>
                    
                    <!-- 中间内容 -->
                    <div class="cell-content">
                        <div class="cell-title">{{ item.title }}</div>
                        <div class="cell-subtitle">{{ item.subtitle }}</div>
                    </div>
                    
                    <!-- 右侧辅助信息 -->
                    <div class="cell-accessory">{{ item.accessory }}</div>
                </div>
            </div>
        </div>
            
        <!-- 调试信息 -->
        <div v-if="props.debug" class="debug-info">
            当前选中：分区 {{ selectedRow.section }} - 行 {{ selectedRow.row }} | 多选计数：{{ selectedRows.length }}
        </div> 

    </div>
</template>

<script setup>
/********************************************* 
*  使用 Composition API
********************************************/
import { ref, computed, watch, defineProps, defineEmits, defineExpose, nextTick } from 'vue'

/********************************************* 
* 数据定义
********************************************/

const props = defineProps({
    // 数据源 - 类似 UITableView 的 dataSource
    sectionData: {
        type: Array,
        default: () => [] //如果父组件不传值，组件也能正常工作（显示为空列表）
    },
    // 是否启用调试模式
    debug: {
        type: Boolean,
        default: false
    },
    // 是否允许多选
    allowMultipleSelection: {
        type: Boolean,
        default: false
    }
})
// 正确使用 defineEmits（只调用一次，返回 emit 函数）
const emit = defineEmits(['update:sectionData', 'selection-change', 'row-click'])

// 当前选中的行 - 类似 UITableView 的 selectedRow
    // 单选模式：默认没有选中任何行
const selectedRow = ref({ section: null, row: null })

// 多选时存储所有选中行
// 多选模式：默认空数组, 数据结构为 { section, row, item }
const selectedRows = ref([])

/********************************************* 
* computed
    必须使用 const 变量名 = computed(() => { ... }) 的格式
********************************************/

// 是否有选中行,通常用于控制按钮的启用/禁用或显示/隐藏操作栏
const hasSelection = computed(() => {
    if (props.allowMultipleSelection) {
        return selectedRows.value.length > 0
    }
    return selectedRow.value.section !== null && selectedRow.value.row !== null;
})

// 提供一个计算属性方便父组件理解总数量
const selectionCount = computed(() => {
    return props.allowMultipleSelection ? selectedRows.value.length : (hasSelection.value ? 1 : 0)
})

/********************************************* 
* 方法定义
********************************************/

// 统一的状态同步方法，使用 nextTick 确保视图更新后再通知父组件
const syncSelectionState = async () => {
  await nextTick() // 等待 DOM 更新，确保 isSelected 计算正确
  emit('selection-change', {
    hasSelection: hasSelection.value,
    count: selectionCount.value,
    selectedRow: selectedRow.value,
    selectedRows: selectedRows.value
  })
}

//该方法用在模板中的 :class="{ selected: isSelected(...) }",只要组件挂载就会被调用
// 判断某行是否被选中
const isSelected = (sectionIndex, rowIndex) => {
    if (props.allowMultipleSelection) {
        // 只要有一个匹配，就返回 true
        return selectedRows.value.some(
            s => s.section === sectionIndex && s.row === rowIndex
        )
    }
    return selectedRow.value.section === sectionIndex && selectedRow.value.row === rowIndex
}

// 处理行点击 - 类似 UITableViewDelegate 的 didSelectRowAt
const handleRowClick = (sectionIndex, rowIndex, item, event) => {
    if (props.allowMultipleSelection) {
        // 多选模式
        handleMultipleSelection(sectionIndex, rowIndex, item)
    } else {
        // 单选模式
        handleSingleSelection(sectionIndex, rowIndex, item)
    }
    
     // 触发自定义事件 'row-click'，向父组件传递一个对象 {}; 父组件的 @row-click 方法中可获取到该对象
    emit('row-click', {
        section: sectionIndex,
        row: rowIndex,
        item: item,
        event: event
    })
    console.log('子组件事件-处理行点击 ')
    // 选中状态改变后，通知父组件
    syncSelectionState()
}

// 单选处理
const handleSingleSelection = (sectionIndex, rowIndex, item) => {

    // 单选逻辑：如果点击已选中项，则取消选中
    if (selectedRow.value.section === sectionIndex && selectedRow.value.row === rowIndex) {
      selectedRow.value = { section: null, row: null }
    } else {
      selectedRow.value = { section: sectionIndex, row: rowIndex }
    }
    
    
    // 可以根据不同类型做不同处理
    switch(item.type) {
        case 'contact':
            // console.log(`打开联系人: ${item.title}`)
            break
        case 'group':
            // console.log(`打开群聊: ${item.title}`)
            break
        case 'system':
            // console.log(`系统消息: ${item.title}`)
            break
    }
}

// 多选处理
const handleMultipleSelection = (sectionIndex, rowIndex, item) => {
    //遍历数组，寻找第一个符合条件的元素,找到了，返回该元素的索引下标;没找到，返回 -1
    const index = selectedRows.value.findIndex(
        s => s.section === sectionIndex && s.row === rowIndex
    );
    
    if (index === -1) {
        // 如果没选中，添加
        selectedRows.value.push({ section: sectionIndex, row: rowIndex, item })
    } else {
        // 如果已选中，移除
        selectedRows.value.splice(index, 1)
    }
}

// 数据操作方法，通过 emit 通知父组件更新数据源，而不是直接修改 props
const updateData = (newData) => {
  emit('update:sectionData', newData) // 1. 更新父组件数据 (v-model 核心)
  //emit('data-changed', newData)  // 2. 触发额外的业务事件
}

// 取消所有选中
const deselectAll = () => {
    selectedRow.value = { section: null, row: null }
    selectedRows.value = []

    console.log('子组件事件-取消所有选中 ')
    // 清空时也通知父组件
    emitSelectionChange()
}

// 取消某行的选中
const deselectRow = (sectionIndex, rowIndex) => {
    let changed = false
    if (props.allowMultipleSelection) {
        const len = selectedRows.value.length
        selectedRows.value = selectedRows.value.filter(s => !(s.section === sectionIndex && s.row === rowIndex))
        changed = len !== selectedRows.value.length
    } else if (
        selectedRow.value.section === sectionIndex && 
        selectedRow.value.row === rowIndex
    ) {
        selectedRow.value = { section: null, row: null }
        changed = true
    }

    if (changed){
        console.log('子组件事件-取消某行的选中 ')
        syncSelectionState()
    } 
}

// 向父组件统一发送参数的方法
const emitSelectionChange = () => {
        // 触发自定义事件 'selection-change'，向父组件传递多个参数; 父组件的 @selection-change 方法中可获取到这些参数
    emit('selection-change', {
        hasSelection: hasSelection.value,
        count: selectionCount.value,
        selectedRow: selectedRow.value,
        selectedRows: selectedRows.value
    })
}

// 获取所有选中的数据
const getSelectedItems = () => {
    if (props.allowMultipleSelection) {
        return selectedRows.value
    }
    if (selectedRow.value.section !== null && selectedRow.value.row !== null) {
        const item = props.sectionData[selectedRow.value.section]?.items[selectedRow.value.row]
        //为了让父组件调用 getSelectedItems() 时，不管单选还是多选，拿到的数据结构都是一模一样的（都是包含 section, row, item 的对象数组）
        // [{ ...this.selectedRow, item }]创建一个全新的对象，
        // 这个新对象包含了 this.selectedRow 里的所有属性，并且额外添加了一个名为 item 的属性
        return item ? [{ ...selectedRow.value, item }] : []
    }
    return []
}


// 插入新行 - 类似 UITableView 的 insertRows
const insertRow = (sectionIndex, newItem, position = 'last') => {
    // 1. 深拷贝，避免直接修改 props
    const newData = JSON.parse(JSON.stringify(props.sectionData))
    if (!newData[sectionIndex]) return
    
    if (position === 'last'){
         //新数据追加到列表末尾
         newData[sectionIndex].items.push(newItem)
    }else if (typeof position === 'number') {
        //假如传入数字 2 时,splice(2, 0, newItem) 表示从索引 2 开始操作,删除 0 个元素,在这个位置插入新元素 newItem
        newData[sectionIndex].items.splice(position, 0, newItem)
    } 
    
    console.log('子组件事件-插入新行 ')
    updateData(newData)
}

// 删除行 - 类似 UITableView 的 deleteRows
const deleteRow = (sectionIndex, rowIndex) => {
    const newData = JSON.parse(JSON.stringify(props.sectionData))
    if (!newData[sectionIndex]?.items[rowIndex]) return
    
    // 如果删除的是选中的行，清除选中状态, 内部会触发 emitSelectionChange
    deselectRow(sectionIndex, rowIndex)
    
    //splice(rowIndex, 1)表示从索引 rowIndex 开始操作,删除 1 个元素
    newData[sectionIndex].items.splice(rowIndex, 1)
    
    // 触发更新事件
    console.log('子组件事件-删除行 ')
    updateData(newData)
}

// 重新加载数据 - 类似 UITableView 的 reloadData
const reloadData = (newData) => {
    // 重置选中状态
    selectedRow.value = { section: null, row: null }
    selectedRows.value = []

    
    // 注意：这里不需要 emit 数据，因为数据源在父组件，父组件刷新数据后会自动传入
    console.log('子组件事件-重新加载数据 ')
    emitSelectionChange()

}


/********************************************* 
* watch
********************************************/
//对于 props 中的响应式数据，始终使用 getter 函数形式是最安全的做法
// 监听数据变化，检查选中的行是否还存在
watch(() => props.sectionData, (newVal) => {
    let needSync = false
        // 检查单选
    if (!props.allowMultipleSelection && selectedRow.value.section !== null) {
        if (!newVal[selectedRow.value.section]?.items[selectedRow.value.row]) {
            selectedRow.value = { section: null, row: null }
            needSync = true
        }
        console.log('watch => props.sectionData, 检查单选')
    }

    // 检查多选 
    if (props.allowMultipleSelection && selectedRows.value.length > 0) {
        console.log('watch => props.sectionData, 检查多选')
    }
    
    if (needSync) syncSelectionState()
},{ deep: true })


//对于 props 中的响应式数据，始终使用 getter 函数形式是最安全的做法
// 监听模式切换，如果从多选切单选，需要清理状态并通知
watch(() => props.allowMultipleSelection, (newVal) => {
    if (!newVal) {
        console.log('watch => props.allowMultipleSelection, 切换到单选')
        // 切换到单选时，清空
        if (selectedRows.value.length > 0) {
            const first = selectedRows.value[0]
            selectedRow.value = { section: first.section, row: first.row }
            selectedRows.value = []   // 清空多选
        }
    } else {
         console.log('watch => props.allowMultipleSelection, 切换到多选')
        // 切换到多选，如果当前有单选，将其加入多选数组
        if (selectedRow.value.section !== null) {
            const item = props.sectionData[selectedRow.value.section]?.items[selectedRow.value.row]
            if (item) {
                selectedRows.value.push({ ...selectedRow.value, item })
            }
            selectedRow.value = { section: null, row: null }
        }
    }
    syncSelectionState()
})

defineExpose({ insertRow, deleteRow, deselectRow, reloadData, getSelectedItems, selectedRow, selectedRows })

</script>


<style scoped>

/* 列表容器 - 类似 UITableView
    overflow: hidden //当内容超出容器（盒子）的大小时,超出的部分会被直接切掉，看不见
*/
.table-view-container {
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow: hidden; 
}

.table-view-content {
  background: white;
}

/* 列表头部 - 类似 UITableView 的 section header */
.section-header {
    background: #f0f0f0;
    padding: 8px 16px;
    font-weight: 600;
    font-size: 14px;
    color: #555;
    border-bottom: 1px solid #ddd;
}

/* 列表项容器 - 类似 UITableViewCell */
.table-view-cell {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    background: white;
    transition: background-color 0.2s ease;
}

/* 最后一项去掉边框 */
.table-view-cell:last-child {
    border-bottom: none;
}

/* 悬停效果（桌面端） */
.table-view-cell:hover {
    background-color: #f9f9f9;
}

/* 选中状态 - 类似 UITableView 的 selection style */
.table-view-cell.selected {
    background-color: #e3f2fd;
    border-left: 4px solid #2196f3;
}

/* 不同类型可以有不同的样式 */
.table-view-cell.contact.selected {
  border-left-color: #4caf50;
}

.table-view-cell.group.selected {
  border-left-color: #ff9800;
}

.table-view-cell.system.selected {
  border-left-color: #f44336;
}

/* 左侧图标区域 - 类似 UITableViewCell 的 imageView */
.cell-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    font-size: 20px;
}

/* 内容区域 - 类似 UITableViewCell 的 textLabel 和 detailTextLabel 
    flex: 1 是 flex-grow: 1, flex-shrink: 1, flex-basis: 0% 的简写,让 .cell-content 占据剩余的所有可用空间
*/
.cell-content {
    flex: 1;
}

.cell-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
}

.cell-subtitle {
    font-size: 13px;
    color: #666;
} 

/* 右侧辅助视图 - 类似 UITableViewCell 的 accessoryView */
.cell-accessory {
    text-align: right;
    color: #999;
    font-size: 14px;
    margin-left: 8px;
}

/* 空状态提示 */
.empty-state {
    padding: 40px 20px;
    text-align: center;
    color: #999;
    font-size: 14px;
}

/* 当前选中行的调试信息 */
.debug-info {
  padding: 8px;
  background: #f0f0f0;
  font-size: 12px;
  color: #666;
  border-top: 1px solid #ddd;
}
</style>