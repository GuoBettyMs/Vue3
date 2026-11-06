<template>
  <div 
    class="modal-overlay" 
    :class="{ active: isVisible,'modal-overlay-eventNone':updateBool == 3 || title == 'loadingTip' }"
    @click.self="handleClose"
  >
    <div class="modal-container" >
      <div class="modal-header">
        <h3 class="modal-title" style="text-align:center">{{ title ? t(title) : ''  }}</h3>
      </div>
      <circle-component
        :progress="progress"
        :size="100"
        :strokeWidth="8"
        bgColor="#f3f4f6"
        progressColor="#2A7FFF"
        v-show="updateBool == 3"
      ></circle-component>
      <div class="modal-body" v-show="message != '' || updateBool == 2">
        <slot name="content">
          <p style="white-space: pre-line;text-align:center">{{ message ? t(message) : '' }}</p>
          <div class="spinner" v-show="connectBool && title != 'Connection successful' && updateBool == 0 || updateBool == 2">
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
          </div>
        </slot>
      </div>
      
      <div class="modal-footer" v-if="updateBool < 2 || updateBool == 4 ">
        <slot name="footer">
          <button class="modal-btn cancel" @click="handleClose" v-show="(title != 'Connection successful' && !connectBool && updateBool != 0) || updateBool == 4 || updateBool == 1">{{t('cancel')}}</button>
          <button v-show="!connectBool || updateBool == 1 || updateBool == 4  " class="modal-btn confirm" @click="handleConfirm">{{t('confirm')}}</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { verdictBrowser } from '../../utils/constant.js'
import CircleComponent from './circleComponent.vue'

const { t } = useI18n({ useScope: 'global' })

const props = defineProps({
  bleBool: {
    type: Boolean,
    default: false
  },
  updateBool: {
    type: Number //0,1:是否更新弹窗 2:下载固件 3：下载更新 4:rebind 5:提示发送数据状态
  },
  connectBool: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'updateFirmware'
  },
  title: {
    type: String,
    default: 'prompt'
  },
  progress: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'confirm'])

watch(() => props.isVisible, (val) => {
  // 控制背景滚动
  document.body.style.overflow = val ? 'hidden' : '';
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
})

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isVisible) {
    emit('close', false);
  }
}

const handleClose = (e) => {
  // this.connectBool = false; 
  emit('close', false)
}

const handleConfirm = (e) => {
  // console.log(this.bleBool);
  
  const browserSupport = verdictBrowser(); // 变量名语义化，避免简写obj
  
  // 合并所有满足"需要触发回调"的条件（逻辑或关系）
  if (
    (!browserSupport.hidBool && !browserSupport.bleBool) || // 浏览器既不支持HID也不支持BLE
    (!browserSupport.hidBool && !props.bleBool) || // 浏览器不支持HID，且当前未启用BLE
    (!browserSupport.bleBool && props.bleBool)     // 浏览器不支持BLE，但当前启用了BLE
  ) {
    emit('confirm', props.connectBool)

  } else {
    // console.log("test",this.connectBool);
    
    if (!props.connectBool) {
      emit('close');
      emit('confirm', props.connectBool)
      
    } else {
      // console.log("updateBool",this.updateBool == 1);
      emit('confirm', props.updateBool == 1)
      // this.$emit('confirm',this.updateBool)
    }
  }
}
</script>


<!-- 使用 src 属性引入外部样式, 加上 scoped 代表作用范围是当前组件 -->
<style scoped src="@/components/MP305/customDialog.css"></style>