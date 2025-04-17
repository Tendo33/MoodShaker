<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 初始化主题
const initTheme = () => {
  const isDark = localStorage.getItem('isDark') === 'true'
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

// 监听主题变化
watch(() => userStore.isDark, (newValue) => {
  document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light')
  localStorage.setItem('isDark', String(newValue))
})

onMounted(() => {
  initTheme()
})
</script>

<style>
@import './styles/theme.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--background-color-base);
  color: var(--text-primary);
}

#app {
  height: 100%;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}
</style>
