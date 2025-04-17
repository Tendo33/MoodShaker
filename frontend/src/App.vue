<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <el-menu
      mode="horizontal"
      :router="true"
      class="nav-menu"
    >
      <el-menu-item index="/">调酒师助手</el-menu-item>
      
      <!-- 未登录时显示登录和注册按钮 -->
      <div v-if="!userStore.token" class="auth-buttons">
        <el-button type="primary" @click="goToLogin">登录</el-button>
        <el-button @click="goToRegister">注册</el-button>
      </div>
      
      <!-- 已登录时显示菜单 -->
      <template v-if="userStore.token">
        <el-menu-item index="/user">用户管理</el-menu-item>
        
        <!-- 用户菜单 -->
        <div class="user-menu">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userStore.userInfo?.username }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="resetPwd">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </el-menu>

    <!-- 主要内容 -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { logout } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

useHead({
  title: '调酒师助手',
  meta: [
    {
      name: 'description',
      content: '智能调酒师助手，为您提供专业的调酒建议',
    },
  ],
})

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
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await logout()
        userStore.clearUserInfo()
        router.push('/login')
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
  display: flex;
  flex-direction: column;
}

.nav-menu {
  padding: 0 20px;
  position: relative;
}

.user-menu {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.auth-buttons {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 10px;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--el-text-color-primary);
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: var(--el-bg-color-page);
}
</style>
