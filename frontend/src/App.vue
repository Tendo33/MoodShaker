<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
import { useHead } from '@vueuse/head'

useHead({
  title: '调酒师助手',
  meta: [
    {
      name: 'description',
      content: '智能调酒师助手，为您提供专业的调酒建议',
    },
  ],
})
</script>

<style>
.app-container {
  min-height: 100vh;
  width: 100%;
  background-color: var(--el-bg-color-page);
}
</style>
