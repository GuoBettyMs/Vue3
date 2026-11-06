<template>
  <div class="circle-progress" :style="{ width: size + 'px', height: size + 'px' }">
    <svg viewBox="0 0 100 100" class="progress-svg">
      <circle
        class="progress-bg"
        cx="50"    
        cy="50"    
        r="45"     
        fill="none"
        :stroke="bgColor"  
        :stroke-width="strokeWidth"  
      />

      <circle
        class="progress-bar"
        cx="50"
        cy="50"
        r="45"
        fill="none"
        :stroke="progressColor"  
        :stroke-width="strokeWidth"
        stroke-linecap="round"  
        :stroke-dasharray="circleLength"  
        :stroke-dashoffset="circleLength - (progress / 100) * circleLength"
        transform="rotate(-90 50 50)"  
      />
    </svg>

    <div class="progress-text" :style="{ fontSize: (size * 0.15) + 'px' }">
      {{ progress }}%
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (val) => val >= 0 && val <= 100, // 进度范围限制 0-100
  },
  size: {
    type: Number,
    default: 200, // 圆形进度条整体大小（默认200px）
  },
  strokeWidth: {
    type: Number,
    default: 6, // 圆环厚度（默认6px）
  },
  bgColor: {
    type: String,
    default: "#e5e7eb", // 背景环颜色（默认浅灰）
  },
  progressColor: {
    type: String,
    default: "#3b82f6", // 进度条颜色（默认蓝色）
  },
})

// 计算属性
const circleLength = computed(() => {
  return 2 * Math.PI * 45;
})
</script>

<style scoped>
.circle-progress {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-svg {
  width: 100%;
  height: 100%;
}

.progress-bar {
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  position: absolute;
  font-weight: 600;
  color: #1f2937;
}
</style>
