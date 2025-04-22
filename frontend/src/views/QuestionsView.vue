<template>
	<div class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
		<!-- 背景效果 -->
		<div class="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
			<div class="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
			<div
				class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse"
				style="animation-delay: 2s"
			></div>
		</div>
		<!-- 这里会影响到页面布局居中 -->
		<div class="container max-w-4xl py-12 relative" style="margin: 0 auto">
			<div class="mb-8 flex items-center justify-between">
				<button class="flex items-center text-white hover:bg-white/10 px-4 py-2 rounded-md" @click="handleBack">
					<ArrowLeft class="mr-2 h-4 w-4" /> 返回
				</button>
				<div class="relative w-1/2 h-2 bg-gray-800 rounded-full overflow-hidden">
					<div
						class="h-full bg-gradient-to-r from-amber-500 to-pink-500 rounded-full transition-all duration-500"
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
						<div class="mb-6 overflow-hidden border-0 bg-white/10 backdrop-blur-sm text-white shadow-xl rounded-lg">
							<div class="p-6 relative">
								<div v-if="isQuestionAnswered(question.id)" class="absolute right-6 top-6">
									<div class="bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-full p-1">
										<Check class="h-4 w-4" />
									</div>
								</div>
								<h3 class="text-2xl font-bold mb-2">{{ question.title }}</h3>
								<p class="text-gray-300">{{ question.description }}</p>
							</div>
						</div>

						<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
							<div
								v-for="option in question.options"
								:key="option.id"
								class="transition-all duration-300 transform"
								:class="{ 'scale-100 opacity-100': true, 'scale-95 opacity-0': false }"
							>
								<div
									class="cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-white/5 backdrop-blur-sm border-0 text-white overflow-hidden rounded-lg"
									:class="{
										'ring-2 ring-pink-500 shadow-lg shadow-pink-500/20': answers[question.id] === option.id,
										'hover:bg-white/10': answers[question.id] !== option.id,
									}"
									@click="handleOptionSelect(question.id, option.id)"
								>
									<div class="p-4">
										<div class="flex flex-col items-center text-center">
											<div
												class="mb-4 rounded-full overflow-hidden bg-gradient-to-r from-amber-500/20 to-pink-500/20 p-2"
											>
												<img
													:src="option.image || '/placeholder.svg'"
													:alt="option.text"
													class="w-[120px] h-[120px] object-cover transition-transform duration-300 hover:scale-110 rounded-full"
												/>
											</div>
											<h3 class="font-medium">{{ option.text }}</h3>
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
								class="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white border-0 rounded-md text-sm"
								@click="showNextQuestion(question.id)"
							>
								下一个问题 <ChevronDown class="ml-2 h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- 基酒选择 -->
			<div
				v-if="visibleQuestions.includes(questions.length)"
				class="mt-8 transition-all duration-500 transform"
				:class="{ 'translate-y-0 opacity-100': true, 'translate-y-4 opacity-0': false }"
			>
				<div class="overflow-hidden border-0 bg-white/10 backdrop-blur-sm text-white shadow-xl rounded-lg">
					<div class="p-6">
						<h3 class="text-xl font-bold mb-2">可用的基酒（可选）</h3>
						<p class="text-gray-300 mb-4">请选择您家中有的基酒</p>
					</div>
					<div class="px-6 pb-6">
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
							<div
								v-for="spirit in baseSpiritsOptions"
								:key="spirit.id"
								class="cursor-pointer p-3 rounded-lg transition-all duration-300"
								:class="{
									'bg-gradient-to-r from-amber-500/30 to-pink-500/30 border border-pink-500': baseSpirits.includes(
										spirit.id
									),
									'bg-white/5 hover:bg-white/10 border border-transparent': !baseSpirits.includes(spirit.id),
								}"
								@click="handleBaseSpiritsToggle(spirit.id)"
							>
								<div class="flex items-center justify-between mb-2">
									<span class="font-medium">{{ spirit.name }}</span>
									<div
										v-if="baseSpirits.includes(spirit.id)"
										class="h-5 w-5 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center"
									>
										<Check class="h-3 w-3 text-white" />
									</div>
									<div v-else class="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center">
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
				class="mt-16 pt-8 border-t border-gray-800 transition-all duration-500 transform"
				:class="{ 'translate-y-0 opacity-100': true, 'translate-y-4 opacity-0': false }"
			>
				<div class="overflow-hidden shadow-lg border-0 bg-white/10 backdrop-blur-sm text-white rounded-lg">
					<div class="p-6 bg-gradient-to-r from-amber-500/20 to-pink-500/20">
						<h3 class="text-xl font-bold mb-2">还有什么想告诉我们的？</h3>
						<p class="text-gray-300">请分享您的任何特殊需求或偏好</p>
					</div>
					<div class="p-6">
						<textarea
							v-model="userFeedback"
							placeholder="例如：我喜欢甜一点的鸡尾酒，或者我对某种成分过敏..."
							class="w-full min-h-[150px] transition-all duration-300 focus:border-pink-500 bg-white/5 border-gray-700 text-white placeholder-gray-400 p-3 rounded-md"
						></textarea>
					</div>
					<div class="px-6 py-4 flex justify-end bg-black/30">
						<button
							@click="handleSubmitFeedback"
							class="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 transition-all duration-300 hover:shadow-md shadow-pink-500/30 border-0 text-white px-6 py-2 rounded-md flex items-center"
							:disabled="isSubmitting"
						>
							<div
								v-if="isSubmitting"
								class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"
							></div>
							<span v-if="isSubmitting">正在为您匹配...</span>
							<span v-else>
								查看推荐鸡尾酒
								<ArrowRight class="ml-2 h-4 w-4" />
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, ArrowRight, Check, ChevronDown, X } from "lucide-vue-next";
import { AlcoholLevel, DifficultyLevel, requestCocktailRecommendation } from "@/api/cocktail";

const router = useRouter();
const answers = reactive({});
const userFeedback = ref("");
const visibleQuestions = ref([1]); // 初始只显示第一个问题
const showFeedbackForm = ref(false);
const isSubmitting = ref(false);
const baseSpirits = ref([]);
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
	const answeredCount = Object.keys(answers).length;
	return (answeredCount / questions.length) * 100;
});

onMounted(() => {
	// 从本地存储加载之前的答案（如果有）
	if (typeof window !== "undefined") {
		const saved = localStorage.getItem("moodshaker-answers");
		if (saved) {
			const parsedAnswers = JSON.parse(saved);
			Object.assign(answers, parsedAnswers);

			// 根据已保存的答案设置可见问题
			const answeredQuestionIds = Object.keys(parsedAnswers).map(Number);
			if (answeredQuestionIds.length > 0) {
				// 找出最大的已回答问题ID
				const maxAnsweredId = Math.max(...answeredQuestionIds);
				// 设置可见问题为所有已回答的问题加上下一个问题（如果有）
				const nextVisible = [...answeredQuestionIds];
				if (maxAnsweredId < questions.length) {
					nextVisible.push(maxAnsweredId + 1);
				}
				visibleQuestions.value = nextVisible;

				// 如果所有问题都已回答，显示反馈表单
				if (maxAnsweredId === questions.length) {
					showFeedbackForm.value = true;
				}
			}
		}

		// 加载基酒列表（如果有）
		const savedSpirits = localStorage.getItem("moodshaker-base-spirits");
		if (savedSpirits) {
			baseSpirits.value = JSON.parse(savedSpirits);
		}
	}
});

const handleOptionSelect = (questionId, optionId) => {
	answers[questionId] = optionId;

	// 保存到本地存储
	if (typeof window !== "undefined") {
		localStorage.setItem("moodshaker-answers", JSON.stringify(answers));
	}

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
	return answers[questionId] !== undefined;
};

// 将用户选择转换为API请求
const createBartenderRequest = () => {
	// 将用户选择映射到API请求格式
	let alcoholLevel = AlcoholLevel.ANY;
	if (answers[3] === "low") alcoholLevel = AlcoholLevel.LOW;
	else if (answers[3] === "medium") alcoholLevel = AlcoholLevel.MEDIUM;
	else if (answers[3] === "high") alcoholLevel = AlcoholLevel.HIGH;

	let difficultyLevel = DifficultyLevel.ANY;
	if (answers[4] === "easy") difficultyLevel = DifficultyLevel.EASY;
	else if (answers[4] === "medium") difficultyLevel = DifficultyLevel.MEDIUM;
	else if (answers[4] === "hard") difficultyLevel = DifficultyLevel.HARD;

	const hasTools = answers[2] === "yes" ? true : answers[2] === "no" ? false : null;

	return {
		message: userFeedback.value || "推荐一款适合我的鸡尾酒",
		alcohol_level: alcoholLevel,
		has_tools: hasTools,
		difficulty_level: difficultyLevel,
		base_spirits: baseSpirits.value.length > 0 ? baseSpirits.value : null,
	};
};

const handleBaseSpiritsToggle = (spiritId) => {
	let newBaseSpirits = [...baseSpirits.value];

	if (spiritId === "all") {
		// 如果选择"全部"，则添加除"all"外的所有基酒
		if (baseSpirits.value.includes("all")) {
			// 如果已经选择了"全部"，则取消所有选择
			newBaseSpirits = [];
		} else {
			// 否则选择所有基酒
			newBaseSpirits = baseSpiritsOptions.filter((option) => option.id !== "all").map((option) => option.id);
		}
	} else {
		// 处理单个基酒的选择/取消
		if (baseSpirits.value.includes(spiritId)) {
			// 如果已经选择了该基酒，则取消选择
			newBaseSpirits = baseSpirits.value.filter((id) => id !== spiritId && id !== "all");
		} else {
			// 否则添加该基酒
			newBaseSpirits = [...baseSpirits.value.filter((id) => id !== "all"), spiritId];

			// 检查是否选择了除"all"外的所有基酒
			const allOtherSpirits = baseSpiritsOptions.filter((option) => option.id !== "all").map((option) => option.id);

			const allSelected = allOtherSpirits.every((id) => newBaseSpirits.includes(id));

			// 如果选择了所有基酒，则添加"all"
			if (allSelected) {
				newBaseSpirits = [...newBaseSpirits, "all"];
			}
		}
	}

	baseSpirits.value = newBaseSpirits;

	if (typeof window !== "undefined") {
		localStorage.setItem("moodshaker-base-spirits", JSON.stringify(newBaseSpirits));
	}
};

const handleSubmitFeedback = async () => {
	isSubmitting.value = true;

	try {
		// 保存用户反馈
		if (typeof window !== "undefined") {
			localStorage.setItem("moodshaker-feedback", userFeedback.value);
		}

		// 创建API请求
		const request = createBartenderRequest();

		// 保存请求到本地存储，以便在详情页面使用
		localStorage.setItem("moodshaker-request", JSON.stringify(request));

		// 发送请求
		const recommendation = await requestCocktailRecommendation(request);

		// 保存推荐结果到本地存储
		localStorage.setItem("moodshaker-recommendation", JSON.stringify(recommendation));

		// 导航到鸡尾酒详情页
		router.push("/cocktail/recommendation");
	} catch (error) {
		console.error("Error submitting request:", error);
	} finally {
		isSubmitting.value = false;
	}
};
</script>
