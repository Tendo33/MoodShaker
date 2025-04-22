<template>
  <div class="min-h-screen transition-colors duration-300" :class="theme === 'dark' ? 'bg-gradient-to-b from-black to-gray-900 text-white' : 'bg-gradient-to-b from-amber-50 to-white text-gray-900'">
    <header class="sticky top-0 z-10 border-b backdrop-blur transition-colors duration-300" :class="theme === 'dark' ? 'border-gray-800 bg-black/80' : 'border-amber-100 bg-white/80'">
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
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useErrorStore } from '@/stores/error'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'

const themeStore = useThemeStore();
const errorStore = useErrorStore();
const { theme } = storeToRefs(themeStore);

onMounted(() => {
  // 初始化主题
  themeStore.initTheme();
});
</script>