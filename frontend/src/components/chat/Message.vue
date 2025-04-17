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
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--el-bg-color);
}

.user-message {
  margin-left: 20%;
  background-color: var(--el-color-primary-light-9);
}

.assistant-message {
  margin-right: 20%;
  background-color: var(--el-bg-color);
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.message-avatar {
  margin-right: 12px;
}

.message-info {
  display: flex;
  flex-direction: column;
}

.message-role {
  font-weight: bold;
  font-size: 14px;
}

.message-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.message-content {
  line-height: 1.6;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: var(--el-text-color-secondary);
  border-radius: 50%;
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
</style> 