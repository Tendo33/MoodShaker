<template>
  <a-layout class="app-container">
    <!-- 导航栏 -->
    <a-layout-header class="header">
      <div class="logo">MoodShaker</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px', flex: 1 }"
      >
        <a-menu-item v-if="userStore.token" key="user">
          <router-link to="/user">用户管理</router-link>
        </a-menu-item>
      </a-menu>
      
      <!-- 未登录时显示登录注册按钮 -->
      <div v-if="!userStore.token" class="auth-buttons">
        <a-button type="link" @click="goToLogin">登录</a-button>
        <a-divider type="vertical" style="border-color: rgba(255, 255, 255, 0.3)" />
        <a-button type="primary" @click="goToRegister">注册</a-button>
      </div>
      
      <!-- 已登录时显示用户菜单 -->
      <div v-else class="user-menu">
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            <a-avatar :size="32" :src="userStore.userInfo?.avatar || '/default-avatar.png'" />
            <span class="username">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
            <down-outlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile" @click="handleCommand('profile')">
                <template #icon><user-outlined /></template>
                个人信息
              </a-menu-item>
              <a-menu-item key="resetPwd" @click="handleCommand('resetPwd')">
                <template #icon><key-outlined /></template>
                修改密码
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleCommand('logout')">
                <template #icon><logout-outlined /></template>
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>

    <!-- 主要内容 -->
    <a-layout-content class="main-content">
      <router-view />
    </a-layout-content>
    
    <!-- 页脚 -->
    <a-layout-footer style="text-align: center">
      MoodShaker ©2024 Created by MoodShaker
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Modal } from 'ant-design-vue'
import { DownOutlined, UserOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { logout } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const selectedKeys = ref<string[]>(['home'])

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push(`/user/${userStore.userInfo?.username}`)
      break
    case 'resetPwd':
      router.push('/user/reset-password')
      break
    case 'logout':
      try {
        await Modal.confirm({
          title: '提示',
          content: '确定要退出登录吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            await logout()
            userStore.clearUserInfo()
            router.push('/login')
          }
        })
      } catch {
        // 用户取消操作
      }
      break
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.logo {
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-right: 30px;
}

.user-menu {
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ant-dropdown-link {
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 14px;
  margin-right: 4px;
}

:deep(.ant-dropdown-menu-item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.main-content {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px - 70px);
}
</style>
