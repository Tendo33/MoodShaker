<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>用户登录</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="auth-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item name="captcha" label="验证码">
          <div class="captcha-container">
            <el-input v-model:value="form.captcha" placeholder="请输入验证码" />
            <img
              :src="captchaUrl"
              alt="验证码"
              class="captcha-img"
              @click="refreshCaptcha"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" block>登录</el-button>
          <el-button @click="goToRegister" block style="margin-top: 10px">注册账号</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { login, getCaptcha } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const captchaUrl = ref('')

const form = reactive({
  username: '',
  password: '',
  captcha: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

// 获取验证码
const refreshCaptcha = async () => {
  try {
    const res = await getCaptcha()
    // 从返回的JSON中获取base64图片数据
    if (res.data && res.data.image) {
      captchaUrl.value = `data:image/jpeg;base64,${res.data.image}`
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

const goToRegister = () => {
  router.push('/register')
}

const handleLogin = async (values: any) => {
  try {
    const res = await login(values)
    userStore.setToken(res.data.token)
    userStore.setUserInfo(res.data.userInfo)
    message.success('登录成功')
    router.push('/')
  } catch (error: any) {
    console.error('登录失败:', error)
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        message.error(data?.msg || '用户名、密码或验证码错误')
      } else {
        message.error(data?.msg || '登录失败，请稍后重试')
      }
    } else {
      message.error('网络错误，请检查网络连接')
    }
    refreshCaptcha() // 登录失败刷新验证码
  }
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--bg-color);
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}

.auth-box {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.auth-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--text-color);
  font-weight: 600;
}

.auth-form {
  margin-top: 20px;
}

.captcha-container {
  display: flex;
  gap: 10px;
}

.captcha-img {
  height: 32px;
  cursor: pointer;
  border-radius: 4px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  border-radius: var(--border-radius);
}

:deep(.el-button) {
  border-radius: var(--border-radius);
  height: 40px;
  font-size: 14px;
}

:deep(.el-button--primary) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.el-button--primary:hover) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  opacity: 0.9;
}
</style> 