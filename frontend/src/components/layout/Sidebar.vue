<template>
  <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="/logo.png" alt="Logo" class="logo" />
        <h2 v-if="!isCollapsed">MoodShaker</h2>
      </div>
      <el-button
        class="collapse-btn"
        :icon="isCollapsed ? ArrowRight : ArrowLeft"
        @click="$emit('toggle')"
      />
    </div>
    
    <div class="sidebar-content">
      <div class="user-section">
        <template v-if="isAuthenticated">
          <div class="user-info" @click="$emit('profile')">
            <el-avatar :size="40" :src="userAvatar" />
            <div v-if="!isCollapsed" class="user-details">
              <span class="username">{{ username }}</span>
              <span class="user-status">在线</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="auth-buttons" v-if="!isCollapsed">
            <el-button type="primary" @click="$emit('login')">登录</el-button>
            <el-button @click="$emit('register')">注册</el-button>
          </div>
        </template>
      </div>

      <div class="quick-actions" v-if="!isCollapsed">
        <h3>快捷操作</h3>
        <div class="action-buttons">
          <el-button-group>
            <el-button @click="$emit('clear')" class="action-btn">
              <el-icon><Delete /></el-icon>
              清空对话
            </el-button>
            <el-button @click="$emit('toggle-theme')" class="action-btn">
              <el-icon><component :is="isDark ? Sunny : Moon" /></el-icon>
              切换主题
            </el-button>
          </el-button-group>
        </div>
      </div>

      <div class="menu-section" v-if="!isCollapsed">
        <h3>功能菜单</h3>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="chat">
            <el-icon><ChatDotRound /></el-icon>
            <span>聊天</span>
          </el-menu-item>
          <el-menu-item index="history">
            <el-icon><Clock /></el-icon>
            <span>历史记录</span>
          </el-menu-item>
          <el-menu-item index="favorites">
            <el-icon><Star /></el-icon>
            <span>收藏</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="stats-section" v-if="!isCollapsed && isAuthenticated">
        <h3>使用统计</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <el-icon><ChatDotRound /></el-icon>
            <span class="stat-value">{{ stats.conversations }}</span>
            <span class="stat-label">对话次数</span>
          </div>
          <div class="stat-item">
            <el-icon><Star /></el-icon>
            <span class="stat-value">{{ stats.favorites }}</span>
            <span class="stat-label">收藏</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, ArrowLeft, Sunny, Moon, Delete, ChatDotRound, Clock, Star } from '@element-plus/icons-vue'
import { ref } from 'vue'

defineProps<{
  isCollapsed: boolean
  isDark: boolean
  isAuthenticated: boolean
  username: string
  userAvatar: string
  stats: {
    conversations: number
    favorites: number
  }
}>()

defineEmits<{
  (e: 'toggle'): void
  (e: 'clear'): void
  (e: 'toggle-theme'): void
  (e: 'profile'): void
  (e: 'login'): void
  (e: 'register'): void
}>()

const activeMenu = ref('chat')

const handleMenuSelect = (index: string) => {
  // 处理菜单选择
  console.log('Selected menu:', index)
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100%;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color-light);
  background: var(--sidebar-header-bg);
  color: var(--sidebar-header-color);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--sidebar-header-color);
}

.collapse-btn {
  background: transparent;
  border: none;
  color: var(--sidebar-header-color);
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.user-section {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: var(--user-info-bg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: var(--user-info-hover-bg);
  transform: translateX(4px);
}

.auth-buttons {
  display: flex;
  gap: 8px;
  padding: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-status {
  font-size: 12px;
  color: var(--success-color);
}

.quick-actions, .menu-section, .stats-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
}

.quick-actions h3, .menu-section h3, .stats-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sidebar-menu {
  border: none;
  background: transparent;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  border-radius: 8px;
  margin-bottom: 4px;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: var(--primary-gradient);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: var(--stat-item-bg);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  background: var(--stat-item-hover-bg);
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 4px 0;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 滚动条样式 */
.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}
</style> 