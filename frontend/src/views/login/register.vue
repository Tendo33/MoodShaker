<template>
  <div class="register-container">
    <div class="register-box">
      <h2>用户注册</h2>
      <a-form
        :model="form"
        :rules="rules"
        @finish="handleRegister"
        layout="vertical"
        class="register-form"
      >
        <a-form-item name="username" label="用户名">
          <a-input v-model:value="form.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item name="password" label="密码">
          <a-input-password v-model:value="form.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item name="confirmPassword" label="确认密码">
          <a-input-password v-model:value="form.confirmPassword" placeholder="请再次输入密码" />
        </a-form-item>
        <a-form-item name="email" label="邮箱">
          <a-input v-model:value="form.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item name="nickname" label="昵称">
          <a-input v-model:value="form.nickname" placeholder="请输入昵称（选填）" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>注册</a-button>
          <a-button @click="goToLogin" block style="margin-top: 10px">返回登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { register } from '@/api/user'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  nickname: ''
})

const validatePass = async (_rule: any, value: string) => {
  if (value === '') {
    throw new Error('请输入密码')
  } else if (value.length < 6) {
    throw new Error('密码长度不能小于6位')
  }
}

const validatePass2 = async (_rule: any, value: string) => {
  if (value === '') {
    throw new Error('请再次输入密码')
  } else if (value !== form.password) {
    throw new Error('两次输入密码不一致')
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const handleRegister = async (values: any) => {
  try {
    await register({
      username: values.username,
      password: values.password,
      email: values.email,
      nickname: values.nickname || undefined
    })
    message.success('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}

.register-box {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.register-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
}

.register-form {
  margin-top: 20px;
}
</style> 