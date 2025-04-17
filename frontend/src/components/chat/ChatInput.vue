<template>
  <div class="input-container">
    <el-input
      v-model="inputValue"
      type="textarea"
      :rows="3"
      placeholder="请输入您的问题..."
      @keyup.enter.ctrl="handleSend"
      :resize="false"
    />
    <el-button
      type="primary"
      :loading="isLoading"
      @click="handleSend"
      :disabled="!inputValue.trim()"
      class="send-button"
    >
      <el-icon><Position /></el-icon>
      发送
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Position } from '@element-plus/icons-vue'

const props = defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const inputValue = ref('')

const handleSend = () => {
  if (!inputValue.value.trim() || props.isLoading) return
  emit('send', inputValue.value)
  inputValue.value = ''
}
</script>

<style scoped>
.input-container {
  display: flex;
  gap: 12px;
  padding: 16px;
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
}

.send-button {
  flex-shrink: 0;
}
</style> 