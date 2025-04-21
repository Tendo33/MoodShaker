<template>
  <div class="guide-questions">
    <h1 class="text-2xl font-bold mb-8">让我们开始调制属于你的鸡尾酒</h1>
    
    <!-- 问题1: 饮用偏好 -->
    <div v-if="currentQuestion === 1" class="question-card">
      <h2 class="text-xl font-semibold mb-4">今天想怎么喝？</h2>
      <div class="options">
        <button 
          v-for="option in drinkingOptions" 
          :key="option.value"
          class="option-btn"
          @click="selectDrinkingPreference(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 问题2: 工具和基酒 -->
    <div v-if="currentQuestion === 2" class="question-card">
      <h2 class="text-xl font-semibold mb-4">有没有工具和基酒？</h2>
      <div class="options">
        <button 
          v-for="option in toolOptions" 
          :key="option.value.toString()"
          class="option-btn"
          @click="selectToolAvailability(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 问题3: 心情状态 -->
    <div v-if="currentQuestion === 3" class="question-card">
      <h2 class="text-xl font-semibold mb-4">今天心情如何？</h2>
      <div class="options">
        <button 
          v-for="option in moodOptions" 
          :key="option.value"
          class="option-btn"
          @click="selectMood(option.value as 'happy' | 'sad' | 'excited')"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 文本输入框 -->
    <div v-if="currentQuestion === 4" class="question-card">
      <h2 class="text-xl font-semibold mb-4">还有什么想告诉我们的吗？</h2>
      <div class="input-container">
        <textarea
          v-model="userMessage"
          class="message-input"
          placeholder="可以描述一下你的心情，或者对鸡尾酒的特殊要求..."
          rows="4"
        ></textarea>
        <button 
          class="submit-btn"
          @click="submitAll"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BartenderType } from '@/api/cocktail'

const router = useRouter()
const currentQuestion = ref(1)
const userMessage = ref('')

// 用户选择
const userSelections = ref<{
  drinkingPreference: BartenderType | '';
  hasTools: boolean;
  mood: 'happy' | 'sad' | 'excited' | '';
}>({
  drinkingPreference: '',
  hasTools: false,
  mood: ''
})

// 选项配置
const drinkingOptions = [
  { label: '从经典中选', value: BartenderType.CLASSIC },
  { label: '自己调配', value: BartenderType.CREATIVE }
]

const toolOptions = [
  { label: '有工具和基酒', value: true },
  { label: '没有工具和基酒', value: false }
]

const moodOptions = [
  { label: '开心/庆祝', value: 'happy' },
  { label: '忧郁/压力', value: 'sad' },
  { label: '兴奋/活力', value: 'excited' }
]

// 选择处理函数
const selectDrinkingPreference = (value: BartenderType) => {
  userSelections.value.drinkingPreference = value
  currentQuestion.value = 2
}

const selectToolAvailability = (value: boolean) => {
  userSelections.value.hasTools = value
  currentQuestion.value = 3
}

const selectMood = (value: 'happy' | 'sad' | 'excited') => {
  userSelections.value.mood = value
  currentQuestion.value = 4
}

const submitAll = () => {
  router.push({
    name: 'CocktailResult',
    query: {
      type: userSelections.value.drinkingPreference,
      hasTools: userSelections.value.hasTools.toString(),
      mood: userSelections.value.mood,
      message: userMessage.value
    }
  })
}
</script>

<style scoped>
.guide-questions {
  @apply max-w-2xl mx-auto p-6;
}

.question-card {
  @apply bg-white rounded-lg shadow-md p-6 mb-6;
}

.options {
  @apply grid grid-cols-2 gap-4;
}

.option-btn {
  @apply bg-blue-500 text-white py-3 px-6 rounded-lg 
         hover:bg-blue-600 transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.input-container {
  @apply flex flex-col gap-4;
}

.message-input {
  @apply w-full p-4 border border-gray-300 rounded-lg
         focus:outline-none focus:ring-2 focus:ring-blue-500
         resize-none;
}

.submit-btn {
  @apply bg-blue-500 text-white py-3 px-6 rounded-lg 
         hover:bg-blue-600 transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
         self-end;
}
</style> 