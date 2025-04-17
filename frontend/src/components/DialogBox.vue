<template>
  <div class="dialog-box" :class="currentStyle">
    <div class="dialog-header">
      <div class="dialog-title">MoodShaker</div>
      <div class="dialog-actions">
        <el-button @click="toggleTheme" class="theme-toggle">
          <el-icon><component :is="currentStyle === 'light' ? 'Sunny' : 'Moon'" /></el-icon>
        </el-button>
        <template v-if="!isLoggedIn">
          <el-button type="primary" @click="handleOpenLogin">登录</el-button>
          <el-button @click="handleOpenRegister">注册</el-button>
        </template>
        <template v-else>
          <div class="user-info">
            <span>{{ username }}</span>
            <el-button @click="logout">退出</el-button>
          </div>
        </template>
      </div>
    </div>

    <!-- 登录对话框 -->
    <el-dialog
      v-model="showLogin"
      title="登录"
      width="400px"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      @close="handleLoginClose"
    >
      <el-form 
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="isLoading">登录</el-button>
          <el-button @click="showLogin = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 注册对话框 -->
    <el-dialog
      v-model="showRegister"
      title="注册"
      width="400px"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      @close="handleRegisterClose"
    >
      <el-form 
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister" :loading="isLoading">注册</el-button>
          <el-button @click="showRegister = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Sunny, Moon } from '@element-plus/icons-vue'

const isLoggedIn = ref(false)
const username = ref('')
const showLogin = ref(false)
const showRegister = ref(false)
const currentStyle = ref('light')
const isLoading = ref(false)
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能小于6位'))
  } else {
    callback()
  }
}

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ]
}

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ]
}

const handleOpenLogin = () => {
  showLogin.value = true
  showRegister.value = false
}

const handleOpenRegister = () => {
  showRegister.value = true
  showLogin.value = false
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    isLoading.value = true
    // 调用登录API
    isLoggedIn.value = true
    username.value = loginForm.username
    showLogin.value = false
    ElMessage.success('登录成功')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查用户名和密码')
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    isLoading.value = true
    // 调用注册API
    showRegister.value = false
    showLogin.value = true
    ElMessage.success('注册成功，请登录')
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败，请检查输入信息')
  } finally {
    isLoading.value = false
  }
}

const handleLoginClose = () => {
  if (loginFormRef.value) {
    loginFormRef.value.resetFields()
  }
}

const handleRegisterClose = () => {
  if (registerFormRef.value) {
    registerFormRef.value.resetFields()
  }
}

const logout = () => {
  isLoggedIn.value = false
  username.value = ''
  ElMessage.success('已退出登录')
}

const toggleTheme = () => {
  currentStyle.value = currentStyle.value === 'light' ? 'dark' : 'light'
  document.documentElement.classList.toggle('dark')
}

onUnmounted(() => {
  showLogin.value = false
  showRegister.value = false
})
</script>

<style scoped>
.dialog-box {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  z-index: 1000;
  margin: 20px;
}

.dialog-box.dark {
  background: var(--el-bg-color-overlay);
  color: var(--el-text-color-primary);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.dialog-title {
  font-size: 18px;
  font-weight: bold;
}

.dialog-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

:deep(.el-dialog) {
  z-index: 2000 !important;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style> 