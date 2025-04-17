<template>
	<div class="bartender-container">
		<!-- 侧边栏 -->
		<div class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
			<div class="sidebar-header">
				<img src="/logo.png" alt="Logo" class="logo" />
				<h2>调酒师助手</h2>
				<el-button
					class="collapse-btn"
					:icon="isSidebarCollapsed ? ArrowRight : ArrowLeft"
					@click="toggleSidebar"
				/>
			</div>
			<div class="sidebar-content">
				<div class="user-info">
					<el-avatar :size="40" :src="userAvatar" />
					<span class="username">{{ username }}</span>
				</div>
				<div class="quick-actions">
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
								<span class="message-role">{{ message.role === 'user' ? '我' : '调酒师' }}</span>
								<span class="message-time">{{ formatTime(message.timestamp) }}</span>
							</div>
							<div class="message-content">
								<div class="message-text" v-html="formatMessage(message.content)"></div>
								<div v-if="message.cocktail" class="cocktail-card">
									<el-card class="cocktail-details">
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
												<el-tag
													v-for="ingredient in message.cocktail.ingredients"
													:key="ingredient.name"
													class="ingredient-tag"
												>
													{{ ingredient.name }}: {{ ingredient.amount }}
												</el-tag>
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
					/>
					<el-button
						type="primary"
						:loading="isLoading"
						@click="sendMessage"
						:disabled="!userInput.trim()"
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
import { chatWithBartender } from '@/api/bartender'
import { ElMessage } from 'element-plus'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { marked } from 'marked'
import { ArrowRight, ArrowLeft, Sunny, Moon, Delete, Position } from '@element-plus/icons-vue'

const userStore = useUserStore()
const username = ref(userStore.userInfo?.username || '游客')
const userAvatar = ref(userStore.userInfo?.avatar || '/default-avatar.png')
const isDark = ref(false)
const isSidebarCollapsed = ref(false)
const messages = ref<Array<{
	role: 'user' | 'assistant'
	content: string
	timestamp: Date
	cocktail?: any
}>>([])
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
		const response = await chatWithBartender({
			message: userMessage,
			user_id: userStore.userInfo?.id?.toString(),
			session_id: userStore.sessionId
		})

		messages.value.push({
			role: 'assistant',
			content: response.content,
			timestamp: new Date(),
			cocktail: response.cocktail
		})
	} catch (error) {
		ElMessage.error('发送消息失败，请重试')
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
}

.user-info {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 20px;
}

.quick-actions {
	margin-top: 20px;
}

.main-content {
	flex: 1;
	transition: all 0.3s ease;
}

.main-content-expanded {
	margin-left: -200px;
}

.chat-container {
	height: 100%;
	display: flex;
	flex-direction: column;
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
	max-width: 80%;
	padding: 16px;
	border-radius: 12px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

.user-message {
	align-self: flex-end;
	background-color: var(--el-color-primary-light-9);
}

.assistant-message {
	align-self: flex-start;
	background-color: var(--el-bg-color);
}

.message-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
	font-size: 0.85em;
	color: var(--el-text-color-secondary);
}

.message-content {
	line-height: 1.6;
}

.cocktail-card {
	margin-top: 16px;
}

.cocktail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.cocktail-image {
	width: 100%;
	height: 200px;
	object-fit: cover;
	border-radius: 8px;
	margin: 12px 0;
}

.cocktail-info {
	margin-top: 16px;
}

.ingredients {
	margin-bottom: 20px;
}

.ingredient-tag {
	margin: 4px;
}

.instructions {
	margin-top: 20px;
}

.input-container {
	padding: 20px;
	background-color: var(--el-bg-color);
	border-top: 1px solid var(--el-border-color-light);
	display: flex;
	gap: 12px;
}

.input-container .el-input {
	flex: 1;
}

.loading-indicator {
	padding: 20px;
	max-width: 80%;
	align-self: flex-start;
}

/* 动画效果 */
.message-fade-enter-active,
.message-fade-leave-active {
	transition: all 0.3s ease;
}

.message-fade-enter-from,
.message-fade-leave-to {
	opacity: 0;
	transform: translateY(20px);
}

/* 深色模式适配 */
:root[class~="dark"] .user-message {
	background-color: var(--el-color-primary-dark-2);
}

:root[class~="dark"] .assistant-message {
	background-color: var(--el-bg-color-overlay);
}
</style>
