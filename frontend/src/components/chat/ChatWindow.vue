<template>
  <div class="chat-window">
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <div class="message-content" v-html="message.formattedContent"></div>
        <div class="message-time">{{ formatTime(message.timestamp) }}</div>
      </div>
    </div>
    <div class="input-area">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="输入消息..."
        :disabled="isLoading"
        @keydown.enter.prevent="handleSendMessage"
      />
      <div class="input-actions">
        <el-button 
          type="primary" 
          @click="handleSendMessage" 
          :disabled="isLoading || !inputMessage.trim()"
          :loading="isLoading"
        >
          发送
        </el-button>
        <el-button 
          type="danger" 
          @click="clearMessages" 
          :disabled="messages.length === 0"
        >
          清空
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import request from '@/utils/request'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  formattedContent: string
}

const props = defineProps<{
  userAvatar: string
  assistantAvatar: string
}>()

const emit = defineEmits<{
  (e: 'send', message: string): void
  (e: 'clear'): void
}>()

const messages = ref<Message[]>([])
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)

const formatMessage = async (content: string) => {
  try {
    const html = await marked(content)
    return DOMPurify.sanitize(html)
  } catch (error) {
    console.error('格式化消息失败:', error)
    return content
  }
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString()
}

const handleSendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true
  
  try {
    // 添加用户消息
    messages.value.push({
      role: 'user',
      content: userMessage,
      formattedContent: await formatMessage(userMessage),
      timestamp: Date.now()
    })

    // 添加加载状态
    messages.value.push({
      role: 'assistant',
      content: '思考中...',
      formattedContent: '思考中...',
      timestamp: Date.now()
    })

    // 发送请求
    const { data } = await request({
      url: '/api/chat',
      method: 'POST',
      data: { message: userMessage }
    })
    
    // 移除加载状态
    messages.value.pop()
    
    // 添加助手回复
    messages.value.push({
      role: 'assistant',
      content: data.response,
      formattedContent: await formatMessage(data.response),
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('发送消息失败:', error)
    // 移除加载状态
    messages.value.pop()
    // 添加错误消息
    messages.value.push({
      role: 'assistant',
      content: '抱歉，发生了错误，请稍后重试。',
      formattedContent: '抱歉，发生了错误，请稍后重试。',
      timestamp: Date.now()
    })
    ElMessage.error('发送消息失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

const clearMessages = () => {
  messages.value = []
  ElMessage.success('聊天记录已清空')
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--background-color-base);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-assistant {
  align-self: flex-start;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--card-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message-user .message-text {
  background: var(--primary-color);
  color: white;
}

.message-time {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

.input-area {
  padding: 20px;
  border-top: 1px solid var(--border-color-light);
  background: var(--card-bg);
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  gap: 8px;
}

/* 滚动条样式 */
.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: transparent;
}

.messages::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}
</style> 