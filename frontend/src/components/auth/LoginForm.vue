<template>
  <div class="login-form">
    <h2>登录</h2>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          prefix-icon="User"
        />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          show-password
        />
      </el-form-item>

      <el-form-item label="验证码" prop="captcha">
        <div class="captcha-container">
          <el-input
            v-model="form.captcha"
            placeholder="请输入验证码"
            prefix-icon="Key"
          />
          <img
            :src="captchaUrl"
            alt="验证码"
            class="captcha-image"
            @click="refreshCaptcha"
          />
        </div>
      </el-form-item>
      
      <div class="form-actions">
        <el-button type="primary" native-type="submit" :loading="loading">
          登录
        </el-button>
        <el-button @click="$emit('switch-to-register')">
          注册账号
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { getCaptcha } from '@/api/user'

const emit = defineEmits<{
  (e: 'login', data: { username: string; password: string; captcha: string }): void
  (e: 'switch-to-register'): void
}>()

const formRef = ref()
const loading = ref(false)
const captchaUrl = ref('')

const form = reactive({
  username: '',
  password: '',
  captcha: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度为4位', trigger: 'blur' }
  ]
}

const refreshCaptcha = async () => {
  try {
    const { data } = await getCaptcha()
    captchaUrl.value = data.url
  } catch (error) {
    ElMessage.error('获取验证码失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    emit('login', { ...form })
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  } finally {
    loading.value = false
  }
}

// 初始化时获取验证码
refreshCaptcha()
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
  text-align: center;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.captcha-container {
  display: flex;
  gap: 12px;
}

.captcha-image {
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
}

:deep(.el-form-item__label) {
  color: var(--text-secondary);
}

:deep(.el-input__wrapper) {
  background: var(--background-color-base);
}
</style> 