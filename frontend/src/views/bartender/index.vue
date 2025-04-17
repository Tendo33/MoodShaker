<template>
	<div class="bartender-container">
		<!-- 侧边栏 -->
		<div class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
			<div class="sidebar-header">
				<img src="/logo.png" alt="Logo" class="logo" />
				<h2 v-if="!isSidebarCollapsed">调酒师助手</h2>
				<el-button
					class="collapse-btn"
					:icon="isSidebarCollapsed ? ArrowRight : ArrowLeft"
					@click="toggleSidebar"
				/>
			</div>
			<div class="sidebar-content">
				<div class="user-info">
					<el-avatar :size="40" :src="userAvatar" />
					<span v-if="!isSidebarCollapsed" class="username">{{ username }}</span>
				</div>
				<div class="quick-actions" v-if="!isSidebarCollapsed">
					<h3>快捷操作</h3>
					<el-button-group>
						<el-button @click="clearChat">
							<el-icon><Delete /></el-icon>
							清空对话
						</el-button>
						<el-button @click="toggleTheme">
							<el-icon><component :is="isDark ? Sunny : Moon" /></el-icon>
						</el-button>
					</el-button-group>
				</div>
			</div>
		</div>

		<!-- 主聊天区域 -->
		<div class="main-content" :class="{ 'main-content-expanded': isSidebarCollapsed }">
			<div class="chat-container">
				<div class="chat-messages" ref="messagesContainer">
					<transition-group name="message-fade">
						<div
							v-for="(message, index) in messages"
							:key="index"
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
								<div v-if="message.cocktail" class="cocktail-card">
									<el-card class="cocktail-details" shadow="hover">
										<template #header>
											<div class="cocktail-header">
												<h3>{{ message.cocktail.name }}</h3>
											</div>
										</template>
										<el-image
											:src="message.cocktail.image"
											fit="cover"
											class="cocktail-image"
											:preview-src-list="[message.cocktail.image]"
										/>
										<div class="cocktail-info">
											<div class="ingredients">
												<h4>配料</h4>
												<div class="ingredients-list">
													<el-tag
														v-for="ingredient in message.cocktail.ingredients"
														:key="ingredient.name"
														class="ingredient-tag"
														effect="plain"
													>
														{{ ingredient.name }}: {{ ingredient.amount }}
													</el-tag>
												</div>
											</div>
											<div class="instructions">
												<h4>制作步骤</h4>
												<el-steps direction="vertical" :active="message.cocktail.instructions.length">
													<el-step
														v-for="(step, stepIndex) in message.cocktail.instructions"
														:key="stepIndex"
														:title="`步骤 ${stepIndex + 1}`"
														:description="step"
													/>
												</el-steps>
											</div>
										</div>
									</el-card>
								</div>
							</div>
						</div>
					</transition-group>
					<div v-if="isLoading" class="loading-indicator">
						<el-skeleton :rows="3" animated />
					</div>
				</div>

				<div class="input-container">
					<el-input
						v-model="userInput"
						type="textarea"
						:rows="3"
						placeholder="请输入您的问题..."
						@keyup.enter.ctrl="sendMessage"
						:resize="false"
					/>
					<el-button
						type="primary"
						:loading="isLoading"
						@click="sendMessage"
						:disabled="!userInput.trim()"
						class="send-button"
					>
						<el-icon><Position /></el-icon>
						发送
					</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { chatWithBartender, type Cocktail } from '@/api/bartender'
import { ElMessage } from 'element-plus'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { marked } from 'marked'
import { ArrowRight, ArrowLeft, Sunny, Moon, Delete, Position } from '@element-plus/icons-vue'

interface Message {
	role: 'user' | 'assistant'
	content: string
	timestamp: Date
	cocktail?: Cocktail
	isStreaming?: boolean
}

const userStore = useUserStore()
const username = ref(userStore.userInfo?.username || '游客')
const userAvatar = ref(userStore.userInfo?.avatar || '/default-avatar.png')
const isDark = ref(false)
const isSidebarCollapsed = ref(false)
const messages = ref<Message[]>([])
const userInput = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const toggleSidebar = () => {
	isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleTheme = () => {
	isDark.value = !isDark.value
	document.documentElement.classList.toggle('dark')
}

const formatTime = (date: Date) => {
	return formatDistanceToNow(date, { addSuffix: true, locale: zhCN })
}

const formatMessage = (content: string) => {
	return marked(content)
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

const sendMessage = async () => {
	if (!userInput.value.trim() || isLoading.value) return

	const userMessage = userInput.value
	messages.value.push({
		role: 'user',
		content: userMessage,
		timestamp: new Date()
	})

	userInput.value = ''
	await scrollToBottom()

	try {
		isLoading.value = true
		const assistantMessage = {
			role: 'assistant' as const,
			content: '',
			timestamp: new Date(),
			isStreaming: true,
			cocktail: undefined
		}
		messages.value.push(assistantMessage)
		await scrollToBottom()

		const response = await chatWithBartender({
			message: userMessage,
			user_id: userStore.userInfo?.id?.toString(),
			session_id: userStore.sessionId
		})

		assistantMessage.content = response.content
		assistantMessage.cocktail = response.cocktail || undefined
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
	background-color: var(--el-bg-color-page);
}

.sidebar {
	width: 280px;
	background-color: var(--el-bg-color);
	border-right: 1px solid var(--el-border-color-light);
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed {
	width: 80px;
}

.sidebar-header {
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid var(--el-border-color-light);
}

.logo {
	width: 40px;
	height: 40px;
	object-fit: contain;
}

.sidebar-content {
	padding: 20px;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 12px;
}

.username {
	font-size: 16px;
	font-weight: 500;
}

.quick-actions {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	transition: all 0.3s ease;
}

.main-content-expanded {
	margin-left: -200px;
}

.chat-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
	width: 100%;
}

.chat-messages {
	flex: 1;
	overflow-y: auto;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.message {
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-width: 80%;
}

.user-message {
	align-self: flex-end;
}

.assistant-message {
	align-self: flex-start;
}

.message-header {
	display: flex;
	align-items: center;
	gap: 12px;
}

.message-avatar {
	display: flex;
	align-items: center;
}

.message-info {
	display: flex;
	flex-direction: column;
}

.message-role {
	font-weight: 500;
	font-size: 14px;
}

.message-time {
	font-size: 12px;
	color: var(--el-text-color-secondary);
}

.message-content {
	background-color: var(--el-bg-color);
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
	background-color: var(--el-color-primary-light-9);
}

.message-text {
	line-height: 1.6;
}

.cocktail-card {
	margin-top: 16px;
}

.cocktail-details {
	border-radius: 12px;
	overflow: hidden;
}

.cocktail-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.cocktail-image {
	width: 100%;
	height: 200px;
	object-fit: cover;
	border-radius: 8px;
	margin: 16px 0;
}

.cocktail-info {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.ingredients h4,
.instructions h4 {
	margin-bottom: 12px;
	color: var(--el-text-color-primary);
}

.ingredients-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.ingredient-tag {
	margin-right: 8px;
	margin-bottom: 8px;
}

.input-container {
	display: flex;
	gap: 12px;
	padding: 20px;
	background-color: var(--el-bg-color);
	border-top: 1px solid var(--el-border-color-light);
}

.send-button {
	align-self: flex-end;
}

.loading-indicator {
	padding: 20px;
}

.message-fade-enter-active,
.message-fade-leave-active {
	transition: all 0.3s ease;
}

.message-fade-enter-from,
.message-fade-leave-to {
	opacity: 0;
	transform: translateY(20px);
}

.typing-indicator {
	display: flex;
	align-items: center;
	gap: 4px;
	margin-top: 8px;
}

.typing-indicator span {
	width: 8px;
	height: 8px;
	background-color: var(--el-text-color-secondary);
	border-radius: 50%;
	display: inline-block;
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

@media (max-width: 768px) {
	.sidebar {
		width: 60px;
	}
	
	.sidebar-header h2,
	.username,
	.quick-actions {
		display: none;
	}
	
	.message {
		max-width: 90%;
	}
	
	.chat-container {
		padding: 10px;
	}
	
	.input-container {
		padding: 10px;
	}
}
</style>
