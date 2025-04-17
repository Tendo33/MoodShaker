<template>
	<div class="bartender-container">
		<el-card class="chat-container">
			<template #header>
				<div class="card-header">
					<h2>调酒师助手</h2>
					<el-button type="primary" @click="startNewSession">开始新的对话</el-button>
				</div>
			</template>

			<div class="chat-messages" ref="messagesContainer">
				<div
					v-for="(message, index) in messages"
					:key="index"
					:class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']"
				>
					<div class="message-content">
						<div class="message-header">
							<span class="message-role">{{ message.role === "user" ? "你" : "调酒师" }}</span>
							<span class="message-time">{{ message.timestamp }}</span>
						</div>
						<div class="message-text" v-html="formatMessage(message.content)"></div>
					</div>
				</div>
			</div>

			<div class="input-container">
				<el-input
					v-model="userInput"
					type="textarea"
					:rows="3"
					placeholder="告诉我你的心情和喜好，让我为你推荐合适的鸡尾酒..."
					@keyup.enter.ctrl="sendMessage"
				/>
				<el-button type="primary" @click="sendMessage" :loading="isLoading">发送</el-button>
			</div>
		</el-card>

		<el-dialog v-model="showCocktailDetails" title="鸡尾酒详情" width="50%">
			<div v-if="currentCocktail" class="cocktail-details">
				<h3>{{ currentCocktail.name }}</h3>
				<el-image :src="currentCocktail.image" fit="cover" class="cocktail-image" />
				<div class="ingredients">
					<h4>原料：</h4>
					<ul>
						<li v-for="(ingredient, index) in currentCocktail.ingredients" :key="index">
							{{ ingredient.name }} - {{ ingredient.amount }}
						</li>
					</ul>
				</div>
				<div class="instructions">
					<h4>调制步骤：</h4>
					<ol>
						<li v-for="(step, index) in currentCocktail.instructions" :key="index">
							{{ step }}
						</li>
					</ol>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { chatWithBartender } from "@/api/bartender";

const userStore = useUserStore();
const messages = ref<Array<{ role: string; content: string; timestamp: string }>>([]);
const userInput = ref("");
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const showCocktailDetails = ref(false);
const currentCocktail = ref<any>(null);

const formatMessage = (content: string) => {
	return content.replace(/\n/g, "<br>");
};

const scrollToBottom = async () => {
	await nextTick();
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
	}
};

const sendMessage = async () => {
	if (!userInput.value.trim()) return;

	const userMessage = userInput.value;
	userInput.value = "";

	messages.value.push({
		role: "user",
		content: userMessage,
		timestamp: new Date().toLocaleTimeString(),
	});

	await scrollToBottom();

	try {
		isLoading.value = true;
		const response = await chatWithBartender({
			message: userMessage,
			user_id: userStore.userInfo?.username,
			session_id: userStore.sessionId || Date.now().toString(),
		});

		messages.value.push({
			role: "assistant",
			content: response.content,
			timestamp: new Date().toLocaleTimeString(),
		});

		if (response.cocktail) {
			currentCocktail.value = response.cocktail;
			showCocktailDetails.value = true;
		}
	} catch (error) {
		ElMessage.error("发送消息失败，请重试");
	} finally {
		isLoading.value = false;
		await scrollToBottom();
	}
};

const startNewSession = () => {
	messages.value = [];
	const newSessionId = Date.now().toString();
	userStore.setSessionId(newSessionId);
};

onMounted(() => {
	if (!userStore.sessionId) {
		const newSessionId = Date.now().toString();
		userStore.setSessionId(newSessionId);
	}
});
</script>

<style scoped>
.bartender-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.chat-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	background-color: var(--el-bg-color);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px;
}

.card-header h2 {
	margin: 0;
	color: var(--el-text-color-primary);
}

.chat-messages {
	flex: 1;
	overflow-y: auto;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	background-color: var(--el-bg-color-page);
}

.message {
	max-width: 80%;
	padding: 12px 16px;
	border-radius: 12px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.message-text {
	line-height: 1.6;
	color: var(--el-text-color-primary);
}

.input-container {
	padding: 20px;
	display: flex;
	gap: 10px;
	background-color: var(--el-bg-color);
	border-top: 1px solid var(--el-border-color-light);
}

.cocktail-details {
	padding: 20px;
}

.cocktail-image {
	width: 100%;
	height: 300px;
	object-fit: cover;
	margin: 20px 0;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ingredients,
.instructions {
	margin: 20px 0;
}

.ingredients ul,
.instructions ol {
	padding-left: 20px;
}

.ingredients li,
.instructions li {
	margin: 8px 0;
	line-height: 1.6;
}
</style>
