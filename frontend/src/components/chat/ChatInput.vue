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
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--border-color-light);
  position: relative;
}

:deep(.el-textarea__inner) {
  border-radius: var(--border-radius-large);
  padding: var(--spacing-sm);
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  transition: all 0.3s ease;
}

:deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

:deep(.el-textarea__inner::placeholder) {
  color: var(--text-placeholder);
}

.send-button {
  flex-shrink: 0;
  border-radius: var(--border-radius-large);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: all 0.3s ease;
}

.send-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-base);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .input-container {
    padding: var(--spacing-sm);
  }

  :deep(.el-textarea__inner) {
    font-size: 13px;
  }

  .send-button {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style> 