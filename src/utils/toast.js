// src/utils/toast.js
import { reactive } from 'vue'

const state = reactive({
    visible: false,
    message: '',
    type: 'success'
})

let timeoutId = null

export const toast = {
    show(msg, type = 'success') {
        if (timeoutId) clearTimeout(timeoutId)
        state.message = msg
        state.type = type
        state.visible = true
        timeoutId = setTimeout(() => {
            state.visible = false
        }, 2000)
    },
    // 方便调用不同样式
    success(msg) { this.show(msg, 'success') },
    error(msg) { this.show(msg, 'error') },
    warning(msg) { this.show(msg, 'warning') },
    info(msg) { this.show(msg, 'info') }
}

// 同时导出状态，以便在全局 Toast 组件中使用
export const toastState = state