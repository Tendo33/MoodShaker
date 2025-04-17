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
  width: 250px;
  height: 100%;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.logo {
  width: 32px;
  height: 32px;
}

.sidebar-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.collapse-btn {
  margin-left: auto;
}
</style> 