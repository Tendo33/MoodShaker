<template>
  <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <div class="sidebar-header">
      <img src="/logo.png" alt="Logo" class="logo" />
      <h2 v-if="!isCollapsed">MoodShaker</h2>
      <el-button
        class="collapse-btn"
        :icon="isCollapsed ? ArrowRight : ArrowLeft"
        @click="$emit('toggle')"
      />
    </div>
    <div class="sidebar-content">
      <div class="user-info">
        <el-avatar :size="40" :src="userAvatar" />
        <span v-if="!isCollapsed" class="username">{{ username }}</span>
      </div>
      <div class="quick-actions" v-if="!isCollapsed">
        <h3>快捷操作</h3>
        <el-button-group>
          <el-button @click="$emit('clear')">
            <el-icon><Delete /></el-icon>
            清空对话
          </el-button>
          <el-button @click="$emit('toggle-theme')">
            <el-icon><component :is="isDark ? Sunny : Moon" /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, ArrowLeft, Sunny, Moon, Delete } from '@element-plus/icons-vue'

defineProps<{
  isCollapsed: boolean
  isDark: boolean
  username: string
  userAvatar: string
}>()

defineEmits<{
  (e: 'toggle'): void
  (e: 'clear'): void
  (e: 'toggle-theme'): void
}>()
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100%;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--border-color-light);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: var(--box-shadow-light);
  position: relative;
  z-index: 10;
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-header {
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color-light);
  background-color: var(--background-color-light);
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-circle);
  object-fit: cover;
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.sidebar-content {
  padding: var(--spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  overflow-y: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-base);
  background-color: var(--background-color-light);
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: var(--border-color-lighter);
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.quick-actions h3 {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
}

.collapse-btn {
  margin-left: auto;
  padding: 4px;
  border-radius: var(--border-radius-circle);
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background-color: var(--border-color-lighter);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    transform: translateX(0);
  }

  .sidebar-collapsed {
    transform: translateX(-100%);
  }

  .sidebar-header h2,
  .username,
  .quick-actions {
    display: none;
  }
}
</style> 