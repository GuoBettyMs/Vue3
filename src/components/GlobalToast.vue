<template>
    <transition name="fade">
        <div v-if="toastState.visible" class="toast-container" :class="toastState.type">
            {{ toastState.message }}
        </div>
    </transition>
</template>

<script setup>
import { toastState } from '../utils/toast.js'
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  z-index: 9999;
}

.toast-container.success { background: #4CAF50; }
.toast-container.error { background: #f44336; }
.toast-container.warning { background: #ff9800; }
.toast-container.info { background: #2196F3; }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
