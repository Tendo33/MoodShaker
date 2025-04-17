<template>
  <div
    class="message"
    :class="message.role === 'user' ? 'user-message' : 'assistant-message'"
  >
    <div class="message-header">
      <div class="message-avatar">
        <el-avatar :size="32" :src="message.role === 'user' ? userAvatar : '/bartender-avatar.png'" />
      </div>
      <div class="message-info">
        <span class="message-role">{{ message.role === 'user' ? '我' : '调酒师' }}</span>
        <span class="message-time">{{ formatTime(message.timestamp) }}</span>
      </div>
    </div>
    <div class="message-content">
      <div class="message-text" v-html="formatMessage(message.content)"></div>
      <div v-if="message.isStreaming" class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <CocktailCard v-if="message.cocktail" :cocktail="message.cocktail" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { marked } from 'marked'
import CocktailCard from './CocktailCard.vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  cocktail?: Cocktail
  isStreaming?: boolean
}

interface Cocktail {
  name: string
  image: string
  ingredients: Array<{
    name: string
    amount: string
  }>
  instructions: string[]
}

const props = defineProps<{
  message: Message
  userAvatar: string
}>()

const formatTime = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCN })
}

const formatMessage = (content: string) => {
  return marked(content)
}
</script>

<style scoped>
.message {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-large);
  background-color: var(--el-bg-color);
  box-shadow: var(--box-shadow-base);
  transition: all 0.3s ease;
  max-width: 80%;
}

.message:hover {
  box-shadow: var(--box-shadow-light);
}

.user-message {
  margin-left: 20%;
  background-color: var(--primary-color);
  color: white;
}

.assistant-message {
  margin-right: 20%;
  background-color: var(--el-bg-color);
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.message-avatar {
  margin-right: var(--spacing-sm);
}

.message-avatar :deep(.el-avatar) {
  border: 2px solid var(--border-color-light);
  transition: all 0.3s ease;
}

.message-avatar :deep(.el-avatar):hover {
  transform: scale(1.1);
}

.message-info {
  display: flex;
  flex-direction: column;
}

.message-role {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.user-message .message-role {
  color: white;
}

.message-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.message-content {
  line-height: 1.6;
}

.message-text {
  word-break: break-word;
}

.message-text :deep(p) {
  margin: 0;
}

.message-text :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
}

.message-text :deep(a):hover {
  text-decoration: underline;
}

.typing-indicator {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--background-color-light);
  border-radius: var(--border-radius-base);
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: var(--text-secondary);
  border-radius: var(--border-radius-circle);
  animation: typing 1s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message {
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
  }

  .user-message,
  .assistant-message {
    margin-left: auto;
    margin-right: auto;
  }
}
</style> 