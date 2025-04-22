<template>
  <div class="min-h-screen transition-colors duration-300" :class="themeClasses">
    <header class="sticky top-0 z-10 border-b backdrop-blur transition-colors duration-300" :class="headerClasses">
      <div class="container flex h-16 items-center justify-between">
        <router-link to="/" class="font-bold text-xl bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
          {{ $t('app.name') }}
        </router-link>
        <div class="flex items-center gap-4">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
    
    <ErrorAlert 
      :message="errorStore.message" 
      @close="errorStore.clearError()" 
    />
    
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useErrorStore } from '@/stores/error'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'

const themeStore = useThemeStore();
const errorStore = useErrorStore();
const { theme } = storeToRefs(themeStore);

// 计算属性：主题相关样式
const themeClasses = computed(() => ({
  'bg-gradient-to-b from-black to-gray-900 text-white': theme.value === 'dark',
  'bg-gradient-to-b from-amber-50 to-white text-gray-900': theme.value === 'light'
}));

// 计算属性：头部样式
const headerClasses = computed(() => ({
  'border-gray-800 bg-black/80': theme.value === 'dark',
  'border-amber-100 bg-white/80': theme.value === 'light'
}));
</script>