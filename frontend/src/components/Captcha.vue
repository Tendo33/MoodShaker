<template>
  <div class="captcha-container">
    <img
      v-if="captchaUrl"
      :src="captchaUrl"
      alt="验证码"
      @click="refreshCaptcha"
      class="captcha-img"
    />
    <div v-else class="captcha-loading">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCaptcha } from '@/api/user'

// 默认值为 null，表示尚未加载
const captchaUrl = ref<string | null>(null)

const refreshCaptcha = async () => {
  try {
    const response = await getCaptcha()
    if (response.data?.data?.image) {
      // 如果 API 返回的 image 字段不包含前缀，则手动添加
      const base64Prefix = response.data.data.image.startsWith('data:image') ? '' : 'data:image/png;base64,'
      captchaUrl.value = `${base64Prefix}${response.data.data.image}`
    } else {
      console.error('验证码数据格式错误:', response.data)
      captchaUrl.value = null
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
    captchaUrl.value = null // 重置为 null，显示加载状态
  }
}

// 组件挂载时加载验证码
onMounted(() => {
  refreshCaptcha()
})

// 暴露刷新方法给父组件
defineExpose({
  refresh: refreshCaptcha
})
</script>

<style scoped>
.captcha-container {
  display: inline-block;
}

.captcha-img {
  height: 40px;
  cursor: pointer;
}

.captcha-loading {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  color: #999;
}
</style>
