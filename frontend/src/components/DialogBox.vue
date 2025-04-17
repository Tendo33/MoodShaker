<template>
  <div class="dialog-box" :class="currentStyle">
    <div class="dialog-header">
      <div class="dialog-title">MoodShaker</div>
      <div class="dialog-actions">
        <button @click="toggleTheme" class="theme-toggle">
          <i class="fas fa-palette"></i>
        </button>
        <button v-if="!isLoggedIn" @click="showLogin = true" class="login-btn">
          登录
        </button>
        <button v-if="!isLoggedIn" @click="showRegister = true" class="register-btn">
          注册
        </button>
        <div v-else class="user-info">
          <span>{{ username }}</span>
          <button @click="logout" class="logout-btn">退出</button>
        </div>
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
      <el-form @submit.prevent="handleLogin">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" type="text" required />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" required />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
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
      <el-form @submit.prevent="handleRegister">
        <el-form-item label="用户名">
          <el-input v-model="registerForm.username" type="text" required />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="registerForm.password" type="password" required />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="registerForm.confirmPassword" type="password" required />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">注册</el-button>
          <el-button @click="showRegister = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'

const isLoggedIn = ref(false)
const username = ref('')
const showLogin = ref(false)
const showRegister = ref(false)
const currentStyle = ref('light')

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const handleLogin = async () => {
  try {
    // 调用登录API
    isLoggedIn.value = true
    username.value = loginForm.username
    showLogin.value = false
  } catch (error) {
    console.error('登录失败:', error)
  }
}

const handleRegister = async () => {
  try {
    // 调用注册API
    showRegister.value = false
    showLogin.value = true
  } catch (error) {
    console.error('注册失败:', error)
  }
}

const handleLoginClose = () => {
  loginForm.username = ''
  loginForm.password = ''
}

const handleRegisterClose = () => {
  registerForm.username = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
}

const logout = () => {
  isLoggedIn.value = false
  username.value = ''
}

const toggleTheme = () => {
  currentStyle.value = currentStyle.value === 'light' ? 'dark' : 'light'
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
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin: 20px;
}

.dialog-box.dark {
  background: #333;
  color: #fff;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.dialog-title {
  font-size: 18px;
  font-weight: bold;
}

.dialog-actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #f0f0f0;
}

button:hover {
  background: #e0e0e0;
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