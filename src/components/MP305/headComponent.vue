<template>
  <div class="mp305-header">
    <header id="DP3005_header" v-show="currentComponent == 'weblink' || (currentComponent != 'weblink' && !isMobile)">
      <h2 v-if="currentComponent == 'weblink'">{{$t('deviceList')}}</h2>
      <img v-else class="DP-logo" :src="getImageUrl(currentComponent, logo)" style="max-height:22px" alt="">
      <img @click="handleBackClick"  src="@/assets/image/mp305/WebLink.svg" alt="" style="max-height:22px">
      <div v-show="!isMobile" @click="langActive = !langActive" @mouseenter="handleMouseEnter"
       @mouseleave="handleMouseLeave"   class="language-con" :class="{ 'language-con-active': langActive }">
        <div class="language-icon"></div>
        <span v-show="!langActive" class="language-span">{{currentLang.indexOf('zh') !== -1 ? 'CN' : 'EN'}}</span>
        <ul v-show="langActive">
          <li @click="handleLanguage('zh')" :class="{'lang-active':currentLang.indexOf('zh') !== -1}">简体中文</li>
          <li @click="handleLanguage('en')" :class="{'lang-active':currentLang.indexOf('en') !== -1}">English</li>
        </ul>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  currentComponent: {
    type: String
  },
  logo: {
    type: String
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  onBackEvent: {
    type: Function,
    default: () => {} // 兜底默认值，避免undefined
  },
  onLanguageEvent: {
    type: Function,
    default: () => {} // 兜底默认值，避免undefined
  }
})

const { locale } = useI18n()

const langActive = ref(false)
const isMouseInContainer = ref(false)

const currentLang = computed(() => {
  return locale.value
})

const handleBackClick = () => {
  // 显式判断+安全执行
  if (props.currentComponent !== 'weblink') {
    props.onBackEvent && props.onBackEvent(); // 先判断是否为函数，再执行
  }
}

const handleLanguage = (lang) => {
  locale.value = lang
  isMouseInContainer.value = false;
  props.onLanguageEvent(lang);
  // // 延迟关闭，避免快速移动鼠标时的闪烁
  setTimeout(() => {
    if (!isMouseInContainer.value) {
      langActive.value = false;
    }
  }, 100);
}

const handleMouseEnter = () => {
  isMouseInContainer.value = true;
}

// 鼠标离开容器时
const handleMouseLeave = () => {
  isMouseInContainer.value = false;
  // // 延迟关闭，避免快速移动鼠标时的闪烁
  setTimeout(() => {
    if (!isMouseInContainer.value) {
      langActive.value = false;
    }
  }, 100);
}
const getImageUrl = (currentComponent, logo) => {
  // 使用 new URL() 处理动态图片路径  
  return new URL(`../../assets/image/${props.currentComponent}/${props.logo}` , import.meta.url).href
}
</script>

<style scoped>
</style>