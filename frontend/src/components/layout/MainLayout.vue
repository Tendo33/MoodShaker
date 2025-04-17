<template>
  <div class="main-layout" :class="{ 'is-dark': isDark }">
    <Sidebar
      :is-collapsed="isSidebarCollapsed"
      :is-dark="isDark"
      :is-authenticated="isAuthenticated"
      :username="username"
      :user-avatar="userAvatar"
      :stats="userStats"
      @toggle="toggleSidebar"
      @clear="clearChat"
      @toggle-theme="toggleTheme"
      @profile="showProfile"
      @login="showLogin"
      @register="showRegister"
    />
    
    <div class="main-content">
      <router-view v-if="isAuthenticated" />
      <div v-else class="auth-container">
        <LoginForm
          v-if="showAuthForm === 'login'"
          @login="handleLogin"
          @switch-to-register="showAuthForm = 'register'"
        />
        <RegisterForm
          v-else
          @register="handleRegister"
          @switch-to-login="showAuthForm = 'login'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Sidebar from './Sidebar.vue'
import LoginForm from '../auth/LoginForm.vue'
import RegisterForm from '../auth/RegisterForm.vue'

const router = useRouter()

const isSidebarCollapsed = ref(false)
const isDark = ref(false)
const isAuthenticated = ref(false)
const showAuthForm = ref<'login' | 'register'>('login')
const username = ref('')
const userAvatar = ref('')
const userStats = ref({
  conversations: 0,
  favorites: 0
})

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

const clearChat = () => {
  // 实现清空聊天记录的逻辑
}

const showProfile = () => {
  // 实现显示用户资料的逻辑
}

const showLogin = () => {
  showAuthForm.value = 'login'
}

const showRegister = () => {
  showAuthForm.value = 'register'
}

const handleLogin = async (credentials: { username: string; password: string }) => {
  try {
    // 实现登录逻辑
    isAuthenticated.value = true
    username.value = credentials.username
    ElMessage.success('登录成功')
    router.push('/chat')
  } catch (error) {
    ElMessage.error('登录失败，请检查用户名和密码')
  }
}

const handleRegister = async (data: { username: string; email: string; password: string }) => {
  try {
    // 实现注册逻辑
    ElMessage.success('注册成功，请登录')
    showAuthForm.value = 'login'
  } catch (error) {
    ElMessage.error('注册失败，请稍后重试')
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  background: var(--background-color-base);
  transition: background-color 0.3s ease;
}

.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

.is-dark {
  background: var(--background-color-base);
}
</style> 