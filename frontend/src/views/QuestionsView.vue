<template>
	<div class="min-h-screen transition-colors duration-300" :class="themeClasses">
		<!-- Enhanced background effects with better animation -->
		<div class="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
			<div
				class="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500 rounded-full blur-3xl animate-pulse"
				style="animation-duration: 8s"
			></div>
			<div
				class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-pulse"
				style="animation-duration: 10s; animation-delay: 2s"
			></div>
			<div
				class="absolute top-3/4 left-1/3 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"
				style="animation-duration: 12s; animation-delay: 4s"
			></div>
		</div>

		<div class="container max-w-4xl py-12 relative" style="margin: 0 auto">
			<div class="mb-8 flex items-center justify-between">
				<button
					class="flex items-center hover:bg-white/10 px-4 py-2 rounded-full transition-colors duration-300 group"
					:class="textColorClass"
					@click="handleBack"
				>
					<ArrowLeft class="mr-2 h-4 w-4 group-hover:translate-x-[-4px] transition-transform" /> 返回
				</button>

				<!-- 垂直进度条 - 从上往下涨 -->
				<div
					class="fixed right-8 top-1/2 transform -translate-y-1/2 h-64 w-3 bg-gray-800/30 rounded-full overflow-hidden shadow-inner hidden md:block"
				>
					<div
						class="w-full bg-gradient-to-b from-pink-500 to-amber-500 rounded-full transition-all duration-500 shadow-lg absolute top-0 progress-bar-vertical"
						:style="{ height: `${progressPercentage}%` }"
					></div>
					<div
						class="absolute -right-7 transform -translate-y-1/2 text-xs font-medium"
						:class="textColorClass"
						:style="{ top: `${progressPercentage}%` }"
					>
						{{ Math.round(progressPercentage) }}%
					</div>
				</div>

				<!-- 保留水平进度条，但仅在移动设备上显示 -->
				<div class="relative w-1/2 h-3 bg-gray-800/30 rounded-full overflow-hidden shadow-inner md:hidden">
					<div
						class="h-full bg-gradient-to-r from-amber-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg"
						:style="{ width: `${progressPercentage}%` }"
					></div>
				</div>
			</div>

			<!-- 问题列表 -->
			<div class="space-y-16">
				<div
					v-for="question in questions"
					:key="question.id"
					:ref="
						(el) => {
							if (el) questionRefs[question.id] = el;
						}
					"
					:class="`transition-all duration-500 ${
						visibleQuestions.includes(question.id) ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
					}`"
				>
					<div
						class="transition-all duration-500 transform"
						:class="{
							'translate-y-0 opacity-100': visibleQuestions.includes(question.id),
							'translate-y-4 opacity-0': !visibleQuestions.includes(question.id),
						}"
					>
						<div
							class="mb-6 overflow-hidden border border-white/10 backdrop-blur-sm shadow-xl rounded-2xl transition-colors duration-300"
							:class="cardClasses"
						>
							<div class="p-6 bg-gradient-to-r from-amber-500/10 to-pink-500/10 relative">
								<div v-if="isQuestionAnswered(question.id)" class="absolute right-6 top-6">
									<div class="bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-full p-1.5 shadow-lg">
										<Check class="h-4 w-4" />
									</div>
								</div>
								<h3 class="text-2xl font-bold mb-3" :class="textColorClass">{{ question.title }}</h3>
								<p class="text-gray-300">{{ question.description }}</p>
							</div>
						</div>

						<div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
							<div
								v-for="option in question.options"
								:key="option.id"
								class="transition-all duration-300 transform"
								:class="{ 'scale-100 opacity-100': true, 'scale-95 opacity-0': false }"
							>
								<div
									class="cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-sm border border-white/10 overflow-hidden rounded-2xl h-full"
									:class="[
										optionCardClasses,
										{
											'ring-2 ring-pink-500 shadow-xl shadow-pink-500/20 bg-gradient-to-br from-white/5 to-white/10':
												answers[question.id] === option.id,
											'hover:bg-white/10': answers[question.id] !== option.id,
										},
									]"
									@click="handleOptionSelect(question.id, option.id)"
								>
									<div class="p-5">
										<div class="flex flex-col items-center text-center">
											<div
												class="mb-4 rounded-full overflow-hidden bg-gradient-to-r from-amber-500/20 to-pink-500/20 p-3 shadow-inner"
											>
												<img
													:src="option.image || '/placeholder.svg'"
													:alt="option.text"
													class="w-[120px] h-[120px] object-cover transition-transform duration-300 hover:scale-110 rounded-full"
												/>
											</div>
											<h3 class="font-medium text-lg whitespace-nowrap" :class="textColorClass">{{ option.text }}</h3>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div
							v-if="
								isQuestionAnswered(question.id) &&
								question.id < questions.length &&
								!visibleQuestions.includes(question.id + 1)
							"
							class="flex justify-center mt-8"
						>
							<button
								class="flex items-center px-6 py-3 hover:bg-white/20 border border-white/10 rounded-full text-sm transition-all duration-300 shadow-lg hover:shadow-xl group whitespace-nowrap"
								:class="[textColorClass, buttonClasses]"
								@click="showNextQuestion(question.id)"
							>
								下一个问题 <ChevronDown class="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- 基酒选择 - 增加了上下间距 -->
			<div
				v-if="visibleQuestions.includes(questions.length)"
				class="mt-16 transition-all duration-500 transform"
				:class="{ 'translate-y-0 opacity-100': true, 'translate-y-4 opacity-0': false }"
			>
				<div
					class="overflow-hidden border border-white/10 backdrop-blur-sm shadow-xl rounded-2xl transition-colors duration-300"
					:class="cardClasses"
				>
					<div class="p-6 bg-gradient-to-r from-amber-500/10 to-pink-500/10">
						<h3 class="text-xl font-bold mb-2" :class="textColorClass">可用的基酒（可选）</h3>
						<p class="text-gray-300 mb-4">请选择您家中有的基酒</p>
					</div>
					<!-- 增加了上下间距 -->
					<div class="px-6 pb-8 pt-4">
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							<div
								v-for="spirit in baseSpiritsOptions"
								:key="spirit.id"
								class="cursor-pointer p-4 rounded-2xl transition-all duration-300"
								:class="[
									spiritCardClasses,
									{
										'bg-gradient-to-br from-amber-500/20 to-pink-500/30 border border-pink-500/70 shadow-lg':
											baseSpirits.includes(spirit.id),
										'border border-white/10 hover:border-white/30': !baseSpirits.includes(spirit.id),
									},
								]"
								@click="handleBaseSpiritsToggle(spirit.id)"
							>
								<div class="flex items-center justify-between mb-2">
									<span class="font-medium whitespace-nowrap" :class="textColorClass">{{ spirit.name }}</span>
									<div
										v-if="baseSpirits.includes(spirit.id)"
										class="h-6 w-6 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center shadow-lg"
									>
										<Check class="h-3 w-3 text-white" />
									</div>
									<div v-else class="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
										<X class="h-3 w-3 text-gray-400" />
									</div>
								</div>
								<p class="text-xs text-gray-400">{{ spirit.description }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 反馈表单 -->
			<div
				v-if="showFeedbackForm"
				id="feedback-form"
				class="mt-16 pt-8 border-t transition-colors duration-300"
				:class="borderColorClass"
			>
				<div
					class="overflow-hidden shadow-xl border border-white/10 backdrop-blur-sm rounded-2xl transition-colors duration-300"
					:class="cardClasses"
				>
					<div class="p-6 bg-gradient-to-r from-amber-500/20 to-pink-500/20">
						<h3 class="text-xl font-bold mb-2" :class="textColorClass">还有什么想告诉我们的？</h3>
						<p class="text-gray-300">请分享您的任何特殊需求或偏好</p>
					</div>
					<div class="p-6">
						<!-- 更改了文本框为更圆润的样式 -->
						<textarea
							v-model="userFeedback"
							placeholder="例如：我喜欢甜一点的鸡尾酒，或者我对某种成分过敏..."
							class="w-full min-h-[150px] transition-all duration-300 focus:border-pink-500 border border-white/10 rounded-2xl p-5 transition-colors duration-300 focus:ring-2 focus:ring-pink-500/30 focus:outline-none"
							:class="[textAreaClasses, textColorClass]"
						></textarea>
					</div>
					<div class="px-6 py-4 flex justify-end transition-colors duration-300" :class="footerClasses">
						<button
							@click="handleSubmitFeedback"
							class="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 transition-all duration-300 hover:shadow-xl shadow-pink-500/30 border-0 text-white px-8 py-3 rounded-full flex items-center group whitespace-nowrap"
							:disabled="isLoading"
							:class="{ 'opacity-70 cursor-not-allowed': isLoading, 'hover:scale-105': !isLoading }"
						>
							<div
								v-if="isLoading"
								class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent"
							></div>
							<span v-if="isLoading" class="font-medium">正在为您匹配...</span>
							<span v-else class="font-medium inline-flex items-center">
								查看推荐鸡尾酒
								<ArrowRight class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ArrowLeft, ArrowRight, Check, ChevronDown, X, History } from "lucide-vue-next";
import { AlcoholLevel, DifficultyLevel } from "@/api/cocktail";
import { useThemeStore } from "@/stores/theme";
import { useCocktailStore } from "@/stores/cocktail";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const cocktailStore = useCocktailStore();
const { theme } = storeToRefs(themeStore);
const { answers, userFeedback, baseSpirits, isLoading } = storeToRefs(cocktailStore);
const router = useRouter();
const route = useRoute();

// 主题相关计算属性
const themeClasses = computed(() => ({
	"bg-gradient-to-b from-black to-gray-900 text-white": theme.value === "dark",
	"bg-gradient-to-b from-amber-50 to-white text-gray-900": theme.value === "light",
}));

const textColorClass = computed(() => ({
	"text-white": theme.value === "dark",
	"text-gray-900": theme.value === "light",
}));

const cardClasses = computed(() => ({
	"bg-white/10 text-white": theme.value === "dark",
	"bg-white/80 text-gray-900": theme.value === "light",
}));

const optionCardClasses = computed(() => ({
	"bg-white/5 text-white": theme.value === "dark",
	"bg-white/90 text-gray-900": theme.value === "light",
}));

const spiritCardClasses = computed(() => ({
	"bg-white/5 hover:bg-white/10": theme.value === "dark",
	"bg-white/90 hover:bg-white/95": theme.value === "light",
}));

const buttonClasses = computed(() => ({
	"bg-white/10": theme.value === "dark",
	"bg-white/90": theme.value === "light",
}));

const textAreaClasses = computed(() => ({
	"bg-white/5": theme.value === "dark",
	"bg-white/90": theme.value === "light",
}));

const footerClasses = computed(() => ({
	"bg-black/30": theme.value === "dark",
	"bg-gray-50": theme.value === "light",
}));

const borderColorClass = computed(() => ({
	"border-gray-800": theme.value === "dark",
	"border-gray-200": theme.value === "light",
}));

const visibleQuestions = ref([1]); // 初始只显示第一个问题
const showFeedbackForm = ref(false);
const questionRefs = reactive({});

const questions = [
	{
		id: 1,
		title: "今天想怎么喝？",
		description: "选择您喜欢的饮用方式",
		options: [
			{
				id: "classic",
				text: "从经典中选择",
				image: "/placeholder.svg?height=120&width=120",
			},
			{
				id: "custom",
				text: "自己调配",
				image: "/placeholder.svg?height=120&width=120",
			},
		],
	},
	{
		id: 2,
		title: "有没有调酒工具？",
		description: "告诉我们您拥有的调酒工具",
		options: [
			{
				id: "yes",
				text: "有调酒工具",
				image: "/placeholder.svg?height=120&width=120",
			},
			{
				id: "no",
				text: "没有调酒工具",
				image: "/placeholder.svg?height=120&width=120",
			},
		],
	},
	{
		id: 3,
		title: "喜欢什么酒精浓度？",
		description: "选择您偏好的酒精浓度",
		options: [
			{
				id: "low",
				text: "低酒精度",
				image: "/placeholder.svg?height=120&width=120",
			},
			{
				id: "medium",
				text: "中等酒精度",
				image: "/placeholder.svg?height=120&width=120",
			},
			{
				id: "high",
				text: "高酒精度",
				image: "/placeholder.svg?height=120&width=120",
			},
			{
				id: "any",
				text: "无所谓",
				image: "/placeholder.svg?height=120&width=120",
			},
		],
	},
	{
		id: 4,
		title: "制作难度偏好",
		description: "选择您能接受的制作难度",
		options: [
			{
				id: "easy",
				text: "简单",
				image: "/placeholder.svg?height=120&width=120",
			},
			{
				id: "medium",
				text: "中等",
				image: "/placeholder.svg?height=120&width=120",
			},
			{
				id: "hard",
				text: "复杂",
				image: "/placeholder.svg?height=120&width=120",
			},
			{
				id: "any",
				text: "无所谓",
				image: "/placeholder.svg?height=120&width=120",
			},
		],
	},
];

const baseSpiritsOptions = [
	{ id: "all", name: "全部", description: "使用所有基酒" },
	{ id: "gin", name: "金酒", description: "Gin" },
	{ id: "rum", name: "朗姆酒", description: "Rum" },
	{ id: "vodka", name: "伏特加", description: "Vodka" },
	{ id: "whiskey", name: "威士忌", description: "Whiskey" },
	{ id: "tequila", name: "龙舌兰", description: "Tequila" },
	{ id: "brandy", name: "白兰地", description: "Brandy" },
];

// 计算问题进度百分比
const progressPercentage = computed(() => {
	const answeredCount = Object.keys(answers.value).length;
	return (answeredCount / questions.length) * 100;
});

const handleOptionSelect = (questionId, optionId) => {
	cocktailStore.saveAnswer(questionId, optionId);

	// 如果回答的是最后一个问题，显示反馈表单
	if (questionId === questions.length) {
		showFeedbackForm.value = true;
		// 滚动到反馈表单
		nextTick(() => {
			const feedbackForm = document.getElementById("feedback-form");
			if (feedbackForm) {
				feedbackForm.scrollIntoView({ behavior: "smooth" });
			}
		});
	} else {
		// 否则显示下一个问题
		const nextQuestionId = questionId + 1;
		if (!visibleQuestions.value.includes(nextQuestionId) && nextQuestionId <= questions.length) {
			visibleQuestions.value = [...visibleQuestions.value, nextQuestionId];

			// 滚动到下一个问题
			nextTick(() => {
				if (questionRefs[nextQuestionId]) {
					questionRefs[nextQuestionId].scrollIntoView({ behavior: "smooth" });
				}
			});
		}
	}
};

const showNextQuestion = (currentQuestionId) => {
	const nextQuestionId = currentQuestionId + 1;
	if (!visibleQuestions.value.includes(nextQuestionId) && nextQuestionId <= questions.length) {
		visibleQuestions.value = [...visibleQuestions.value, nextQuestionId];
		nextTick(() => {
			if (questionRefs[nextQuestionId]) {
				questionRefs[nextQuestionId].scrollIntoView({ behavior: "smooth" });
			}
		});
	}
};

const handleBack = () => {
	router.push("/");
};

// 检查问题是否已回答
const isQuestionAnswered = (questionId) => {
	return answers.value[questionId] !== undefined;
};

// 将用户选择转换为API请求
const createBartenderRequest = () => {
	// 将用户选择映射到API请求格式
	let alcoholLevel = AlcoholLevel.ANY;
	if (answers.value[3] === "low") alcoholLevel = AlcoholLevel.LOW;
	else if (answers.value[3] === "medium") alcoholLevel = AlcoholLevel.MEDIUM;
	else if (answers.value[3] === "high") alcoholLevel = AlcoholLevel.HIGH;

	let difficultyLevel = DifficultyLevel.ANY;
	if (answers.value[4] === "easy") difficultyLevel = DifficultyLevel.EASY;
	else if (answers.value[4] === "medium") difficultyLevel = DifficultyLevel.MEDIUM;
	else if (answers.value[4] === "hard") difficultyLevel = DifficultyLevel.HARD;

	const hasTools = answers.value[2] === "yes" ? true : answers.value[2] === "no" ? false : null;

	return {
		message: userFeedback.value || "推荐一款适合我的鸡尾酒",
		alcohol_level: alcoholLevel,
		has_tools: hasTools,
		difficulty_level: difficultyLevel,
		base_spirits: baseSpirits.value.length > 0 ? baseSpirits.value : null,
	};
};

const handleBaseSpiritsToggle = (spiritId) => {
	cocktailStore.toggleBaseSpirit(spiritId, baseSpiritsOptions);
};

const handleSubmitFeedback = async () => {
	try {
		// 保存用户反馈
		cocktailStore.saveFeedback(userFeedback.value);

		// 提交请求
		await cocktailStore.submitRequest();

		// 导航到鸡尾酒详情页
		router.push("/cocktail/recommendation");
	} catch (error) {
		console.error("Error submitting request:", error);
	}
};

const loadSavedData = () => {
	if (typeof window !== "undefined") {
		// 检查是否有 URL 参数指示新会话
		const isNewSession = route.query.new === "true";

		// 如果是新会话，清除之前的数据
		if (isNewSession) {
			cocktailStore.resetAll();
			visibleQuestions.value = [1];
			showFeedbackForm.value = false;
			return;
		}

		// 加载保存的数据
		cocktailStore.loadSavedData();

		// 根据已保存的答案设置可见问题
		const answeredQuestionIds = Object.keys(answers.value).map(Number);
		if (answeredQuestionIds.length > 0) {
			const maxAnsweredId = Math.max(...answeredQuestionIds);
			const nextVisible = [...answeredQuestionIds];
			if (maxAnsweredId < questions.length) {
				nextVisible.push(maxAnsweredId + 1);
			}
			visibleQuestions.value = nextVisible;

			if (maxAnsweredId === questions.length) {
				showFeedbackForm.value = true;
			}
		}
	}
};

onMounted(() => {
	// 加载保存的数据，根据URL参数决定是否开始新会话
	loadSavedData();
});
</script>

<style scoped>
/* 确保所有按钮文字不换行 */
button {
	white-space: nowrap;
}

/* 添加进度条动画 */
@keyframes pulse-glow {
	0%,
	100% {
		box-shadow: 0 0 5px 0 rgba(244, 114, 182, 0.5);
	}
	50% {
		box-shadow: 0 0 15px 0 rgba(244, 114, 182, 0.8);
	}
}

.progress-bar-vertical {
	animation: pulse-glow 2s infinite;
}
</style>
