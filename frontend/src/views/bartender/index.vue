<template>
	<div class="container">
		<div class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
			<div class="header">
				<img src="/logo.png" alt="Logo" class="logo" />
				<h2 v-if="!isSidebarCollapsed">MoodShaker</h2>
				<el-button class="toggle-btn" :icon="isSidebarCollapsed ? ArrowRight : ArrowLeft" @click="toggleSidebar" />
			</div>
			<div class="content">
				<div class="user-info">
					<el-avatar :size="40" :src="userAvatar" />
					<span v-if="!isSidebarCollapsed" class="username">{{ username }}</span>
				</div>
				<div class="actions" v-if="!isSidebarCollapsed">
					<el-button @click="clearChat">
						<el-icon><Delete /></el-icon>
						清空对话
					</el-button>
					<el-button @click="toggleTheme">
						<el-icon><component :is="isDark ? Sunny : Moon" /></el-icon>
					</el-button>
				</div>
			</div>
		</div>

		<div class="main" :class="{ expanded: isSidebarCollapsed }">
			<div class="chat">
				<div class="messages" ref="messagesContainer">
					<transition-group name="fade">
						<div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
							<div class="header">
								<el-avatar :size="32" :src="message.role === 'user' ? userAvatar : '/bartender-avatar.png'" />
								<div class="info">
									<span class="name">{{ message.role === "user" ? "我" : "调酒师" }}</span>
									<span class="time">{{ formatTime(message.timestamp) }}</span>
								</div>
							</div>
							<div class="content">
								<div class="text" v-html="formatMessage(message.content)"></div>
								<div v-if="message.isStreaming" class="typing">
									<span></span>
									<span></span>
									<span></span>
								</div>
								<div v-if="message.cocktail" class="cocktail">
									<el-card>
										<template #header>
											<h3>{{ message.cocktail.name }}</h3>
										</template>
										<el-image :src="message.cocktail.image" fit="cover" />
										<div class="details">
											<div class="ingredients">
												<h4>配料</h4>
												<div class="list">
													<el-tag v-for="ingredient in message.cocktail.ingredients" :key="ingredient.name">
														{{ ingredient.name }}: {{ ingredient.amount }}
													</el-tag>
												</div>
											</div>
											<div class="steps">
												<h4>制作步骤</h4>
												<el-steps direction="vertical">
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
					<div v-if="isLoading" class="loading">
						<el-skeleton :rows="3" animated />
					</div>
				</div>

				<div class="input">
					<el-input
						v-model="inputValue"
						type="textarea"
						:rows="3"
						placeholder="请输入您的问题..."
						@keyup.enter.ctrl="sendMessage"
					/>
					<el-button type="primary" :loading="isLoading" @click="sendMessage" :disabled="!inputValue.trim()">
						<el-icon><Position /></el-icon>
						发送
					</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { chatWithBartender } from "@/api/bartender";
import { ElMessage } from "element-plus";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { marked } from "marked";
import { ArrowRight, ArrowLeft, Sunny, Moon, Delete, Position } from "@element-plus/icons-vue";

interface Message {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
	cocktail?: Cocktail;
	isStreaming?: boolean;
}

interface Cocktail {
	name: string;
	image: string;
	ingredients: Array<{
		name: string;
		amount: string;
	}>;
	instructions: string[];
}

const userStore = useUserStore();
const username = ref(userStore.userInfo?.username || "游客");
const userAvatar = ref(userStore.userInfo?.avatar || "/default-avatar.png");
const isDark = ref(false);
const isSidebarCollapsed = ref(false);
const messages = ref<Message[]>([]);
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const inputValue = ref('');

const toggleSidebar = () => {
	isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleTheme = () => {
	isDark.value = !isDark.value;
	document.documentElement.classList.toggle("dark");
};

const scrollToBottom = async () => {
	await nextTick();
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
	}
};

const clearChat = () => {
	messages.value = [];
};

const sendMessage = async () => {
	if (!inputValue.value.trim()) return;
	
	const message = inputValue.value;
	inputValue.value = ''; // 清空输入框
	
	messages.value.push({
		role: "user",
		content: message,
		timestamp: new Date(),
	});

	await scrollToBottom();

	try {
		isLoading.value = true;
		const assistantMessage: Message = {
			role: "assistant",
			content: "",
			timestamp: new Date(),
			isStreaming: true,
		};
		messages.value.push(assistantMessage);
		await scrollToBottom();

		const response = await chatWithBartender({
			message: message,
			user_id: userStore.userInfo?.id?.toString(),
			session_id: userStore.sessionId,
		});

		assistantMessage.content = response.content;
		if (response.cocktail) {
			assistantMessage.cocktail = response.cocktail;
		}
		assistantMessage.isStreaming = false;
	} catch (error) {
		ElMessage.error("发送消息失败，请重试");
		messages.value.pop(); // 移除失败的助手消息
	} finally {
		isLoading.value = false;
		await scrollToBottom();
	}
};

watch(
	messages,
	() => {
		scrollToBottom();
	},
	{ deep: true }
);

onMounted(() => {
	isDark.value = document.documentElement.classList.contains("dark");
});

const formatTime = (date: Date) => {
	return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
};

const formatMessage = (content: string) => {
	return marked(content);
};
</script>

<style scoped>
.container {
	display: flex;
	height: 100vh;
	background-color: var(--bg-color);
}

.sidebar {
	width: 280px;
	background-color: var(--el-bg-color);
	border-right: 1px solid var(--border-color);
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
}

.sidebar.collapsed {
	width: 64px;
}

.sidebar .header {
	padding: var(--spacing-md);
	display: flex;
	align-items: center;
	gap: var(--spacing-sm);
	border-bottom: 1px solid var(--border-color);
}

.sidebar .header .logo {
	width: 32px;
	height: 32px;
	object-fit: contain;
}

.sidebar .header h2 {
	margin: 0;
	font-size: 18px;
	color: var(--text-color);
}

.sidebar .content {
	padding: var(--spacing-md);
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: var(--spacing-lg);
}

.sidebar .user-info {
	display: flex;
	align-items: center;
	gap: var(--spacing-sm);
}

.sidebar .actions {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-sm);
}

.main {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background-color: var(--el-bg-color);
}

.main.expanded {
	margin-left: -216px;
}

.chat {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	max-width: 1200px;
	margin: 0 auto;
	width: 100%;
	padding: var(--spacing-md);
}

.messages {
	flex: 1;
	overflow-y: auto;
	padding: var(--spacing-md);
	display: flex;
	flex-direction: column;
	gap: var(--spacing-md);
}

.message {
	display: flex;
	gap: var(--spacing-md);
	padding: var(--spacing-md);
	border-radius: var(--border-radius-lg);
	background-color: var(--el-bg-color);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.message.user {
	background-color: var(--primary-color);
	color: white;
	margin-left: 20%;
}

.message.assistant {
	margin-right: 20%;
}

.message .header {
	display: flex;
	align-items: center;
	gap: var(--spacing-sm);
}

.message .info {
	display: flex;
	flex-direction: column;
}

.message .name {
	font-weight: 600;
	font-size: 14px;
}

.message .time {
	font-size: 12px;
	opacity: 0.8;
}

.message .content {
	flex: 1;
}

.message .text {
	line-height: 1.6;
	word-break: break-word;
}

.typing {
	display: flex;
	gap: 4px;
	margin-top: var(--spacing-sm);
}

.typing span {
	width: 8px;
	height: 8px;
	background-color: var(--text-color);
	border-radius: 50%;
	animation: typing 1s infinite;
}

.typing span:nth-child(2) {
	animation-delay: 0.2s;
}

.typing span:nth-child(3) {
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

.input {
	padding: var(--spacing-md);
	display: flex;
	gap: var(--spacing-sm);
	background-color: var(--el-bg-color);
	border-top: 1px solid var(--border-color);
}

.input :deep(.el-textarea__inner) {
	border-radius: var(--border-radius-lg);
	padding: var(--spacing-sm);
	font-size: 14px;
	line-height: 1.6;
	resize: none;
	transition: all 0.3s ease;
}

.input :deep(.el-textarea__inner:focus) {
	border-color: var(--primary-color);
	box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.loading {
	padding: var(--spacing-md);
	background-color: var(--el-bg-color);
	border-radius: var(--border-radius-lg);
	margin: var(--spacing-md) 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.sidebar {
		width: 64px;
	}
	
	.sidebar .header h2,
	.sidebar .username,
	.sidebar .actions {
		display: none;
	}
	
	.message.user {
		margin-left: 10%;
	}
	
	.message.assistant {
		margin-right: 10%;
	}
}
</style>
