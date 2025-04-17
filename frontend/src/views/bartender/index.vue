<template>
	<div class="bartender-container">
		<Sidebar
			:is-collapsed="isSidebarCollapsed"
			:is-dark="isDark"
			:username="username"
			:user-avatar="userAvatar"
			@toggle="toggleSidebar"
			@clear="clearChat"
			@toggle-theme="toggleTheme"
		/>

		<div class="main-content" :class="{ 'main-content-expanded': isSidebarCollapsed }">
			<div class="chat-container">
				<div class="chat-messages" ref="messagesContainer">
					<transition-group name="message-fade">
						<Message
							v-for="(message, index) in messages"
							:key="index"
							:message="message"
							:user-avatar="userAvatar"
						/>
					</transition-group>
					<div v-if="isLoading" class="loading-indicator">
						<el-skeleton :rows="3" animated />
					</div>
				</div>

				<ChatInput :is-loading="isLoading" @send="sendMessage" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { chatWithBartender } from '@/api/bartender'
import { ElMessage } from 'element-plus'
import Sidebar from '@/components/layout/Sidebar.vue'
import Message from '@/components/chat/Message.vue'
import ChatInput from '@/components/chat/ChatInput.vue'

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

const userStore = useUserStore()
const username = ref(userStore.userInfo?.username || '游客')
const userAvatar = ref(userStore.userInfo?.avatar || '/default-avatar.png')
const isDark = ref(false)
const isSidebarCollapsed = ref(false)
const messages = ref<Message[]>([])
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const toggleSidebar = () => {
	isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleTheme = () => {
	isDark.value = !isDark.value
	document.documentElement.classList.toggle('dark')
}

const scrollToBottom = async () => {
	await nextTick()
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
	}
}

const clearChat = () => {
	messages.value = []
}

const sendMessage = async (userMessage: string) => {
	messages.value.push({
		role: 'user',
		content: userMessage,
		timestamp: new Date()
	})

	await scrollToBottom()

	try {
		isLoading.value = true
		const assistantMessage: Message = {
			role: 'assistant',
			content: '',
			timestamp: new Date(),
			isStreaming: true
		}
		messages.value.push(assistantMessage)
		await scrollToBottom()

		const response = await chatWithBartender({
			message: userMessage,
			user_id: userStore.userInfo?.id?.toString(),
			session_id: userStore.sessionId
		})

		assistantMessage.content = response.content
		if (response.cocktail) {
			assistantMessage.cocktail = response.cocktail
		}
		assistantMessage.isStreaming = false
	} catch (error) {
		ElMessage.error('发送消息失败，请重试')
		messages.value.pop() // 移除失败的助手消息
	} finally {
		isLoading.value = false
		await scrollToBottom()
	}
}

watch(messages, () => {
	scrollToBottom()
}, { deep: true })

onMounted(() => {
	isDark.value = document.documentElement.classList.contains('dark')
})
</script>

<style scoped>
.bartender-container {
	display: flex;
	height: 100vh;
	background-color: var(--background-color-base);
	position: relative;
	overflow: hidden;
}

.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	transition: margin-left 0.3s ease;
	position: relative;
	overflow: hidden;
}

.main-content-expanded {
	margin-left: -216px;
}

.chat-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	position: relative;
	max-width: 1200px;
	margin: 0 auto;
	width: 100%;
}

.chat-messages {
	flex: 1;
	overflow-y: auto;
	padding: var(--spacing-lg);
	scroll-behavior: smooth;
}

.chat-messages::-webkit-scrollbar {
	width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
	background: var(--background-color-light);
}

.chat-messages::-webkit-scrollbar-thumb {
	background: var(--border-color-light);
	border-radius: var(--border-radius-base);
}

.chat-messages::-webkit-scrollbar-thumb:hover {
	background: var(--text-secondary);
}

.loading-indicator {
	padding: var(--spacing-md);
	background-color: var(--background-color-light);
	border-radius: var(--border-radius-base);
	margin: var(--spacing-md) 0;
}

.message-fade-enter-active,
.message-fade-leave-active {
	transition: all 0.3s ease;
}

.message-fade-enter-from,
.message-fade-leave-to {
	opacity: 0;
	transform: translateY(10px);
}

/* 响应式设计 */
@media (max-width: 768px) {
	.main-content {
		margin-left: 0;
	}

	.main-content-expanded {
		margin-left: 0;
	}

	.chat-messages {
		padding: var(--spacing-sm);
	}

	.loading-indicator {
		padding: var(--spacing-sm);
		margin: var(--spacing-sm) 0;
	}
}
</style>
