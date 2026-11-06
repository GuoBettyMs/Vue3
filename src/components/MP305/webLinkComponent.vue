<template>
  <div class="weblink-con" :class="{'both-nosupport':!supportObj.hidBool && !supportObj.bleBool}">
    <modal-component :is-visible="showModal" :title="alertInfo.title" :message="alertInfo.message"
                :ble-bool = "bleBool" :connect-bool="connectBool" :update-bool="updateBool" :progress="0" @confirm="showModal = false"
                @close="showModal = false"></modal-component>
                <head-component :currentComponent="'weblink'"></head-component>
                <div class="page list-page">
        <div  class="link-con">
          <div v-for="(item,index) in deviceList" :key="index" class="link-box" @click="goToDetail(item.link)">
            <img :src="getImageUrl(item.link, item.icon)" style="width:100%"  />
            <span>{{item.name}}</span>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { verdictBrowser } from '../../utils/constant.js'
import ModalComponent from './customDialog.vue'
import HeadComponent from './headComponent.vue'

const { t } = useI18n({ useScope: 'global' })

const router = useRouter()

const supportObj = ref({
  hidBool: false,
  bleBool: false
})

const bleBool = ref(false)
const isConnected = ref(false)
const connectBool = ref(false)
const updateBool = ref(0)
const showModal = ref(false)
const alertInfo = ref({
  title: "",
  message: ""
})

const deviceList = ref([
  {
    icon: "mp305_index_0303",
    name: "MP305",
    link: 'mp305'
  },
  {
    icon: "bl8_index_0303",
    name: "BL8",
    link: 'bl8'
  },
    {
    icon: "bl8_index_0303",
    name: "FlexHeat",
    link: 'flex-heat'
  }
])

onMounted(() => {
  supportObj.value = verdictBrowser()
  if (!supportObj.value.hidBool && !supportObj.value.bleBool) {
    showModal.value = true
    alertInfo.value.message = 'noSupport' //'Your browser does not support Web HID and BLE. Please use Chrome 89+ or a similar browser.'//您的浏览器不支持 Web HID 和 BLE，请使用 Chrome 89+ 或同类浏览器
  }
})

const goToDetail = (link) => {  
  // 跳转到详情页
  router.push(`/${link}`);
  // 也可使用命名路由：this.$router.push({ name: 'Detail', params: { id } });
}

const getImageUrl = (link, icon) => {
  // 使用 new URL() 处理动态图片路径
  return new URL(`../../assets/image/${link}/${icon}.png`, import.meta.url).href
}
</script>

<style scoped>
</style>