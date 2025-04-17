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
import { getCaptcha } from '@/api/auth'

const captchaUrl = ref('')

const refreshCaptcha = async () => {
  try {
    const response = await getCaptcha()
    // 将 blob 数据转换为 base64 URL
    const reader = new FileReader()
    reader.onload = () => {
      captchaUrl.value = reader.result as string
    }
    reader.readAsDataURL(response.data)
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

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