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
    <div v-if="showLogin" class="modal">
      <div class="modal-content">
        <h2>登录</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="loginForm.username" type="text" required>
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="loginForm.password" type="password" required>
          </div>
          <div class="form-actions">
            <button type="submit">登录</button>
            <button type="button" @click="showLogin = false">取消</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 注册对话框 -->
    <div v-if="showRegister" class="modal">
      <div class="modal-content">
        <h2>注册</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="registerForm.username" type="text" required>
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="registerForm.password" type="password" required>
          </div>
          <div class="form-group">
            <label>确认密码</label>
            <input v-model="registerForm.confirmPassword" type="password" required>
          </div>
          <div class="form-actions">
            <button type="submit">注册</button>
            <button type="button" @click="showRegister = false">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

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
  // TODO: 实现登录逻辑
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
  // TODO: 实现注册逻辑
  try {
    // 调用注册API
    showRegister.value = false
    showLogin.value = true
  } catch (error) {
    console.error('注册失败:', error)
  }
}

const logout = () => {
  isLoggedIn.value = false
  username.value = ''
}

const toggleTheme = () => {
  currentStyle.value = currentStyle.value === 'light' ? 'dark' : 'light'
}
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style> 