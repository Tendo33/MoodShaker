<template>
  <div class="cocktail-result">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>正在为您调制鸡尾酒...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="retry" class="retry-btn">重试</button>
    </div>

    <div v-else-if="cocktail" class="result-content">
      <!-- 鸡尾酒基本信息 -->
      <div class="cocktail-header">
        <h1 class="text-3xl font-bold">{{ cocktail.name }}</h1>
        <p class="text-gray-600 mt-2">{{ cocktail.description }}</p>
      </div>

      <!-- 鸡尾酒图片 -->
      <div class="cocktail-image">
        <img v-if="imageUrl" :src="imageUrl" :alt="cocktail.name" class="rounded-lg shadow-lg">
        <div v-else class="image-placeholder">
          <p>图片生成中...</p>
        </div>
      </div>

      <!-- 鸡尾酒特征 -->
      <div class="cocktail-features">
        <div class="feature-item">
          <span class="label">基酒:</span>
          <span class="value">{{ cocktail.base_spirit }}</span>
        </div>
        <div class="feature-item">
          <span class="label">酒精浓度:</span>
          <span class="value">{{ cocktail.alcohol_level }}</span>
        </div>
        <div class="feature-item">
          <span class="label">口味特征:</span>
          <span class="value">{{ cocktail.flavor_profiles.join(', ') }}</span>
        </div>
      </div>

      <!-- 原料列表 -->
      <div class="ingredients">
        <h2 class="text-xl font-semibold mb-4">原料</h2>
        <div class="ingredients-list">
          <div v-for="ingredient in cocktail.ingredients" :key="ingredient.name" class="ingredient-item">
            <span class="name">{{ ingredient.name }}</span>
            <span class="amount">{{ ingredient.amount }}{{ ingredient.unit }}</span>
            <span v-if="ingredient.substitute" class="substitute">替代品: {{ ingredient.substitute }}</span>
          </div>
        </div>
      </div>

      <!-- 制作步骤 -->
      <div class="steps">
        <h2 class="text-xl font-semibold mb-4">制作步骤</h2>
        <div class="steps-list">
          <div v-for="step in cocktail.steps" :key="step.step_number" class="step-item">
            <span class="step-number">{{ step.step_number }}</span>
            <div class="step-content">
              <p class="description">{{ step.description }}</p>
              <p v-if="step.tips" class="tips">{{ step.tips }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 所需工具 -->
      <div class="tools">
        <h2 class="text-xl font-semibold mb-4">所需工具</h2>
        <div class="tools-list">
          <div v-for="tool in cocktail.tools" :key="tool.name" class="tool-item">
            <span class="name">{{ tool.name }}</span>
            <span v-if="tool.alternative" class="alternative">替代品: {{ tool.alternative }}</span>
          </div>
        </div>
      </div>

      <!-- 建议酒杯 -->
      <div class="serving-glass">
        <h2 class="text-xl font-semibold mb-4">建议酒杯</h2>
        <p>{{ cocktail.serving_glass }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCocktailRecommendation, getCocktailImage, BartenderType } from '@/api/cocktail'
import type { CocktailRecommendation } from '@/types/cocktail'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const cocktail = ref<CocktailRecommendation | null>(null)
const imageUrl = ref('')

// 获取鸡尾酒推荐
const fetchCocktailRecommendation = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const type = route.query.type as BartenderType
    const hasTools = route.query.hasTools === 'true'
    const mood = route.query.mood as string

    const response = await getCocktailRecommendation(type, {
      user_id: 1, // 临时使用固定用户ID
      session_id: Date.now().toString(),
      model: 'deepseek-v3-250324',
      message: `我的心情是${mood}`,
      has_tools: hasTools
    })

    cocktail.value = response

    // 获取鸡尾酒图片
    try {
      const imageResponse = await getCocktailImage(1, Date.now().toString())
      imageUrl.value = imageResponse.image_url
    } catch (e) {
      console.error('Failed to get cocktail image:', e)
    }
  } catch (e) {
    error.value = '获取鸡尾酒推荐失败，请稍后重试'
    console.error('Failed to get cocktail recommendation:', e)
  } finally {
    loading.value = false
  }
}

// 重试
const retry = () => {
  fetchCocktailRecommendation()
}

onMounted(() => {
  fetchCocktailRecommendation()
})
</script>

<style scoped>
.cocktail-result {
  @apply max-w-4xl mx-auto p-6;
}

.loading {
  @apply flex flex-col items-center justify-center h-64;
}

.spinner {
  @apply w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4;
}

.error {
  @apply text-center text-red-500;
}

.retry-btn {
  @apply mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg 
         hover:bg-blue-600 transition-colors duration-200;
}

.result-content {
  @apply space-y-8;
}

.cocktail-header {
  @apply text-center mb-8;
}

.cocktail-image {
  @apply mb-8;
}

.image-placeholder {
  @apply bg-gray-100 rounded-lg h-64 flex items-center justify-center;
}

.cocktail-features {
  @apply grid grid-cols-3 gap-4 mb-8;
}

.feature-item {
  @apply bg-gray-50 p-4 rounded-lg;
}

.label {
  @apply text-gray-500 block mb-1;
}

.value {
  @apply font-medium;
}

.ingredients-list,
.steps-list,
.tools-list {
  @apply space-y-4;
}

.ingredient-item,
.tool-item {
  @apply bg-gray-50 p-4 rounded-lg;
}

.step-item {
  @apply flex gap-4;
}

.step-number {
  @apply w-8 h-8 bg-blue-500 text-white rounded-full 
         flex items-center justify-center flex-shrink-0;
}

.step-content {
  @apply flex-1;
}

.tips {
  @apply text-sm text-gray-500 mt-1;
}

.substitute,
.alternative {
  @apply text-sm text-gray-500 ml-2;
}
</style> 