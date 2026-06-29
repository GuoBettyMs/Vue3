<template>
  <div>
    <div class="range-container" style="background: #e88bdc">
      <label for="file">File progress:</label>
      <progress id="file" max="100" value="70">70%</progress>
      <br/>
      <input type="range" 
        min="0" max="11" 
        value="7" step="1" 
        orient="vertical" 
        style="writing-mode: vertical-lr; direction: rtl"/>
      <br/>
      <label for="temp">选择一个适宜的温度：</label>
      <br/>
      <input type="range" id="temp" name="temp" list="tickmarks" />
      <datalist id="tickmarks">
        <option value="0" label="很冷！"></option>
        <option value="25" label="凉爽"></option>
        <option value="50" label="适中"></option>
        <option value="75" label="变得暖和了！"></option>
        <option value="100" label="很热！"></option>
      </datalist>
    </div>
  
    <form method="post" enctype="multipart/form-data" class="fileForm" @submit.prevent="uploadImage">
      <div style="display: flex; flex-wrap: wrap;">
        <label for="image_uploads">Choose images to upload (PNG, JPG)</label>
        <input
          type="file"
          :style="{ opacity: 0 }"
          name="images"
          ref="imageUploads"
          id="image_uploads" 
          accept=".jpg, .jpeg, .png"
          multiple 
          @change="updateImageDisplay"/>
      </div>
      <div ref="filePreview">
        <p>No files currently selected for upload</p>
      </div>
      <div>
        <button type="submit">Upload</button>
      </div>
    </form>

    <div style="
      padding: 8px 0 8px 0;
      background: rgb(188, 225, 219);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 25px;  /* 每个子元素之间的间距 */">
      <!-- 电子邮件部分 -->
      <div>
        <label for="emailAddress">电子邮件</label><br>
        <input id="emailAddress" type="email" placeholder="user@example.gov" list="defaultEmails" size="64" maxlength="256" multiple="">
        <datalist id="defaultEmails">
          <option value="jbond007@mi6.defence.gov.uk"></option>
          <option value="jbourne@unknown.net"></option>
          <option value="nfury@shield.org"></option>
          <option value="tony@starkindustries.com"></option>
          <option value="hulk@grrrrrrrr.arg"></option>
        </datalist>
      </div>
      
      <!-- 生日和日期部分 -->
      <div  class="input-date-container" style="display: flex; align-items: center; gap: 20px;">
        <label style="padding: 0 25px 0 0;">
          Enter your birthday:
        <input 
          max="2026-05-30" 
          min="2026-03-01" 
          required="" 
          name="bday" 
          type="date"> 
        <span class="validity"></span>
        <small style="display: block; color: #666; margin-top: 5px;">
            日期范围：2026年3月1日 - 2026年5月30日
        </small>
        </label>
      
        <label for="appt">Choose a time for your meeting:
        <input 
          type="datetime-local" 
          id="meeting-time" 
          name="meeting-time" 
          value="2018-06-12T19:30" 
          min="2018-06-07T00:00" 
          max="2018-06-14T00:00">
        <input 
          type="time" 
          id="appt" 
          name="appt" 
          min="09:00" 
          max="18:00" required />
        <br/>
        <small>Office hours are 9am to 6pm</small>
        </label>

        <label for="camp-week">Choose a week in May or June:

        <input
          type="week"
          name="week"
          id="camp-week"
          min="2026-W1"
          max="2026-W54"
          required />
          </label>
      </div>
      
      <!-- 颜色选择部分 -->
      <div>
        <p style="margin: 0 0 10px 0;" :style="{ color: selectedColor }">
          An example demonstrating the use of the
          <code>&lt;input type="color"&gt;</code> control.
        </p> 
        <label for="colorWell">change text Color:</label> 

        <!-- 加上 v-model, v-model 会自动处理“ DOM 元素变化 -> 更新变量”和“变量变化 -> 更新 DOM 元素”的过程，甚至不需要 watch -->
        <input type="color" id="colorWell" v-model="selectedColor">
      </div>
    </div>

    <div class="input-checkbox-container">
      <!-- 第一个表单：复选框 + 其他输入框 
          触发时机：表单提交时（点击提交按钮 或 按回车键）
          .prevent 修饰符：自动调用 event.preventDefault()，阻止页面刷新,执行 handleForm1Submit 方法
      -->
      <form ref="form1" id="form1" @submit.prevent="handleForm1Submit">
        <fieldset :style="{ color: selectedColor }">
          <legend>要订阅报纸吗？</legend>
          <div>
              <input type="checkbox" id="subscribeNews" name="subscribe" value="newsletter" />
              <label for="subscribeNews">要</label>
              
              <input type="checkbox" id="other" name="interest" value="other" @change="handleOtherChange" />
              <label for="other">其他</label>
              <input type="text" ref="otherInputRef" name="other" />
          </div>
        
          <div>
            <button type="submit">订阅</button>
          </div>
        </fieldset>
      </form>

      <!-- 第二个表单：单选框 -->
      <!-- 需要提交到服务器时用 form -->
      <form ref="form2" id="form2" @submit.prevent="handleForm2Submit">
        <fieldset>
            <legend>请选择首选的联系方式：</legend>
            <div>
                <input type="radio" id="contactChoice1" name="contact" value="email" />
                <label for="contactChoice1">电子邮件</label>
                
                <input type="radio" id="contactChoice2" name="contact" value="phone" />
                <label for="contactChoice2">电话</label>
                
                <input type="radio" id="contactChoice3" name="contact" value="mail" checked/>
                <label for="contactChoice3">邮件</label>
            </div>
            
            <div>
                <button type="submit">提交</button>
            </div>
        </fieldset>
      </form>

      <!-- 第三个：配方复选框 -->
      <fieldset>
          <legend>Complete the recipe</legend>
          <div>
            <!-- 
                1. 用 click 手动控制数据
                2. indeterminate 是一个 DOM 属性 (Property)，而不是 HTML 属性 (Attribute)。它不能通过 v-model 或 :indeterminate="..." 
                    直接绑定,所以用 ref 注册标记 enchantmentCheckbox,给这个输入框起了一个“内部代号”,用来处理 indeterminate 属性
            -->
            <input 
                type="checkbox" 
                id="enchantment" 
                ref="enchantmentCheckbox"
                @click="handleOverallClick"
            />
            <label for="enchantment">Enchantment table</label>
          </div>
        
          <div>
            <ul> 
              <!-- 
              : → v-bind 的简写
              Object.entries 将对象转为数组 [key, value],这样 v-for 可以同时拿到 key (名字) 和 value (是否选中)
              (value, key): key 是对象的属性名（例如 "book"）,在 :id 和 v-model 中动态生成唯一的标识
                            value 是对象的属性值（例如 true 或 false）
              :key="key": 告诉 Vue 用属性名作为唯一标识来追踪列表项，防止渲染错误
              -->
              <li v-for="(value, key) in recipeItems" :key="key">
              <input 
                  type="checkbox" 
                  :id="'recipe_' + key"
                  v-model="recipeItems[key]"
              />
              <label :for="'recipe_' + key">{{ key }}</label>
              </li>
            </ul> 
          </div>
        </fieldset> 

        <!-- 显示表单提交结果的区域, Vue数据绑定, formData变化时，视图自动更新 -->
        <pre id="log">{{ formData }}</pre>
    </div>

    <div class="input-button-container">
      <div>
        <p>输入文本（4~8 个字符）:</p>
        <input type="text" id="name" name="name" autocomplete="name" required="required" minlength="4" maxlength="8" size="10">
        <span></span>
      </div>
      <div>
        <label for="pass">Password (8 characters minimum):</label>
        <input type="password" id="pass" name="password" minlength="8" required="">
        <span></span>
      </div>
      <div>
        <label for="pin">PIN：</label>
        <input id="pin" type="password" inputmode="numeric" placeholder="only number" />   
      </div>
        
      <!-- 1. input 按钮 
        :value="buttonText" : 相当于v-model="buttonText",将按钮的 value 属性与 Vue 实例的 buttonText 数据关联起来
        :class="{ 'running': isRunning }" : 根据条件动态添加或移除 CSS 类。当 isRunning 为 true 时，自动添加 running 类；为 false 时自动移除
        用 @ 把 HTML 事件和 Vue 方法连接起来
        -->
      <input 
        type="button" 
        :value="buttonText" 
        @click="toggleMachine" 
        class="btn-input" 
        :class="{ 'running': isRunning }" 
      />
      <p v-if="isRunning">⚙️ 机器正在运行中...</p>
    
      <!-- 2. custom-btn 按钮 -->
      <button class="custom-btn">
        <span style="font-size: 20px;">✨</span>
        <span>悬浮试试</span>
        <span style="font-size: 12px;">→</span>
      </button>
  
      <!-- 3. 下划线按钮 -->
      <button class="underline-btn">
        <span style="margin-right: 5px;">📁</span>
        悬浮时出现下划线
        <span class="underline"></span>
      </button>
  
      <!-- 4. 提交按钮（带loading） -->
      <button 
        id="submitBtn" 
        @click="handleSubmit"
        :disabled="isSubmitting"
      >
        <span v-show="!isSubmitting">提交</span>
        <span v-show="isSubmitting">⏳ 提交中...</span>
      </button>
  
      <!-- 5. 下载按钮 -->
      <button class="download-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
        下载文件
        <span>v2.0</span>
      </button>
    </div>
  </div>
</template>

<script setup>
/********************************************* 
  *  使用 Composition API
  ********************************************/
import { ref, reactive, toRefs } from 'vue'
import { computed, watch, onMounted } from 'vue'
import { nextTick } from 'vue'
import { toast } from '../utils/toast.js'

/********************************************* 
  * 数据定义
  ********************************************/
// ---  color   ---
//使用了v-model, 会自动处理“ DOM 元素变化 -> 更新变量”和“变量变化 -> 更新 DOM 元素”的过程
const selectedColor = ref('#ff0000')

// ---  checkbox   ---
// 配方数据 - 只存子项
const recipeItems = reactive({
  book: false,
  diamonds: false,
  obsidian: false
})
// 使用 toRefs 解构，确保 computed 能精确追踪每个属性的变化
const { book, diamonds, obsidian } = toRefs(recipeItems)

// 存储表单提交的数据
const formData = ref('')


// ---  button   ---
const isRunning = ref('false')// 初始状态：未运行
const isSubmitting = ref('false')


/********************************************* 
  * DOM 引用
  ********************************************/
// 定义一个 ref 变量，名字必须和模板中的 ref 属性一致
// ---  file   ---
const imageUploads = ref(null)
const filePreview = ref(null) 

// ---  checkbox   ---
//当组件挂载后，Vue 会自动把模板中的 <input ref="enchantmentCheckbox"> 赋值给这个变量。访问时要用 enchantmentCheckbox.value
const enchantmentCheckbox = ref(null)

// ---  button   ---
const form1 = ref(null)
const otherInputRef = ref(null)
const form2 = ref(null)

/********************************************* 
  * computed
  ********************************************/
// 必须使用 const 变量名 = computed(() => { ... }) 的格式

// 1. 计算是否“全选” (所有子项都为 true)
const overallChecked = computed(() => {
  // 方法A: 直接访问解构后的 ref 
  // 注意：这里需要 .value，因为在 setup 中 ref 需要 .value
  const values = [book.value, diamonds.value, obsidian.value]
  
  if (values.length === 0) return false
  return values.every(v => v === true)
})

// 2. 计算是否“半选” (部分为 true，部分为 false)
const overallIndeterminate = computed(() => {
  // 方法 B：用 Object.values，必须确保传入的是响应式对象
  const values = Object.values(recipeItems) 
  
  if (values.length === 0) return false
  
  //统计数组中有多少个 true
  const checkedCount = values.filter(v => v === true).length
  // 大于 0 且 小于 总数 = 半选
  return checkedCount > 0 && checkedCount < values.length
})

const buttonText = computed(() => {
  // 当 isRunning 变化时，buttonText 自动重新计算
  return isRunning.value ? "⏹️ 停止机器" : "▶️ 开动机器"
})

/********************************************* 
  * methods
  ********************************************/
// ---  file   ---
const uploadImage = () => {
  const input = imageUploads.value //获取到 DOM 元素
  const curFiles = input.files //获取 files 属性返回的该类型的对象
  if (curFiles.length !== 0) {
    alert('上传成功！');
  }else{
    console.log('文件为空！')
    toast.error('文件为空！')
  }
}

const updateImageDisplay = () => {

  //清空预览区 <div> 留下的内容
  while (filePreview.value.firstChild) {
    filePreview.value.removeChild(filePreview.value.firstChild);
  }

  const input = imageUploads.value //获取到 DOM 元素
  const curFiles = input.files; //获取 files 属性返回的该类型的对象
  if (curFiles.length === 0) {
    const para = document.createElement("p");
    para.textContent = "No files currently selected for upload";
    filePreview.value.appendChild(para);
  } else {
    //<ol> 元素表示有序列表，通常渲染为一个带编号的列表
    const list = document.createElement("ol");
    filePreview.value.appendChild(list);

    for (const file of curFiles) {
      const listItem = document.createElement("li");
      const para = document.createElement("p");
      if (validFileType(file)) {
        para.textContent = `File name ${file.name}, file size ${returnFileSize(
          file.size,
        )}.`;

        //调用 URL.createObjectURL(curFiles[i]) 来生成图片的一张缩略预览图。
        //通过创建一个新的 <img> 来将这张图片也插入到列表项，并且将它的 src 设置为缩略图
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);

        listItem.appendChild(image);
        listItem.appendChild(para);
      } else {
        para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
        listItem.appendChild(para);
      }

      list.appendChild(listItem);
    }
  }

  //检查文件的类型是否正确
  function validFileType(file) {
      const fileTypes = [
      "image/apng",
      "image/bmp",
      "image/gif",
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/svg+xml",
      "image/tiff",
      "image/webp",
      "image/x-icon",
    ];
    return fileTypes.includes(file.type);
  }

  //返回一个用 bytes/KB/MB 表示的可读性良好的文件大小（默认情况下，浏览器以绝对字节数报告大小）。
  function returnFileSize(number) {
    if (number < 1024) {
      return `${number} bytes`;
    } else if (number >= 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)} KB`;
    } else if (number >= 1048576) {
      return `${(number / 1048576).toFixed(1)} MB`;
    }
  }

}


// ---  checkbox   ---
// 处理全选框点击
// 逻辑：如果当前已经是“全选”状态，点击后变为“全不选”；否则变为“全选”(半选状态下取反逻辑要定义为“全选”)
const handleOverallClick = async () => {
  const shouldBeChecked = !overallChecked.value; //计算 overallChecked,取反后赋值给变量 shouldBeChecked
  // 使用 Object.keys 遍历,统一设置为新状态
  Object.keys(recipeItems).forEach(key => {
    recipeItems[key] = shouldBeChecked
  })

// 强制刷新 DOM 状态 (虽然 watch 会做，但在 click 瞬间手动设置可以避免闪烁)
  await nextTick()
  if (enchantmentCheckbox.value) {
    enchantmentCheckbox.value.checked = shouldBeChecked
    enchantmentCheckbox.value.indeterminate = false
  }
}


// ---  button   ---
// 处理第一个表单提交
const handleForm1Submit = () => {
  // 检查 form1.value 是否存在
  if (!form1.value) return

  // 获取表单元素
  const data = new FormData(form1.value);
  
  let output = '📋 表单1提交的数据：\n';
  for (const [key, value] of data.entries()) {
    output += `${key} = ${value}\n`;
  }
  
  // 自动显示在 pre 里
  formData.value = output;
}

// 处理第二个表单提交
const handleForm2Submit = () => {
  const data = new FormData(form2.value);
  
  let output = '📋 表单2提交的数据：\n';
  for (const [key, value] of data.entries()) {
    output += `${key} = ${value}\n`;
  }
  
  formData.value = output;
}

// 处理“其他”复选框变化
const handleOtherChange = (e) => {
  if (otherInputRef.value) { //若存在DOM元素
    otherInputRef.value.style.visibility = e.target.checked ? 'visible' : 'hidden';
    if (e.target.checked) otherInputRef.value = '';
  }
}


const handleSubmit = () => {
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    // 提交成功后的逻辑
  }, 2000);
}


const toggleMachine = () => {
  isRunning.value = !isRunning.value
  // 可以添加更多逻辑
  if (isRunning.value) {
    console.log('机器启动成功')
    // 启动定时器等
  } else {
    console.log('机器已停止')
    // 清理定时器
  }
}


/********************************************* 
  * watch
  ********************************************/
// ---  checkbox   ---
// 监听 overallChecked
watch(overallChecked, (newVal) => {
  // 检查 DOM 元素是否存在
  if (enchantmentCheckbox.value) {
    // 设置 checked 状态
    enchantmentCheckbox.value.checked = newVal
    
    // 如果是全选或全不选，必须关闭 indeterminate (去除横线)
    enchantmentCheckbox.value.indeterminate = false
  }
}, { immediate: true }) // 组件初始化时立即执行一次

// 监听 overallIndeterminate
///实现“子项变动 自动更新全选框视觉状态”
///当变为 true (部分选中) 时,checked 是什么不重要（通常保持为 false 或之前的状态），开启 indeterminate
///当变为 false 时（不再是部分选中），不需要做额外操作，因为 overallChecked 的 watcher 会接管并清理状态。
watch(overallIndeterminate, (newVal) => {
  if (enchantmentCheckbox.value) {
    // 只有当处于半选状态时，才设置 indeterminate 为 true
    enchantmentCheckbox.value.indeterminate = newVal
  }
}, { immediate: true })


/********************************************* 
  * mounted
  ********************************************/
onMounted(() => {
  //若存在DOM元素
  if (otherInputRef.value) {
    otherInputRef.value.style.visibility = 'hidden'
  }
})


</script>

<style scoped src="../css/InputComponent.css"></style>