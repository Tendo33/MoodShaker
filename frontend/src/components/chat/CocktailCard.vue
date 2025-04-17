<template>
  <el-card class="cocktail-details" shadow="hover">
    <template #header>
      <div class="cocktail-header">
        <h3>{{ cocktail.name }}</h3>
      </div>
    </template>
    <el-image
      :src="cocktail.image"
      fit="cover"
      class="cocktail-image"
      :preview-src-list="[cocktail.image]"
    />
    <div class="cocktail-info">
      <div class="ingredients">
        <h4>配料</h4>
        <div class="ingredients-list">
          <el-tag
            v-for="ingredient in cocktail.ingredients"
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
        <el-steps direction="vertical" :active="cocktail.instructions.length">
          <el-step
            v-for="(step, stepIndex) in cocktail.instructions"
            :key="stepIndex"
            :title="`步骤 ${stepIndex + 1}`"
            :description="step"
          />
        </el-steps>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
interface Cocktail {
  name: string
  image: string
  ingredients: Array<{
    name: string
    amount: string
  }>
  instructions: string[]
}

defineProps<{
  cocktail: Cocktail
}>()
</script>

<style scoped>
.cocktail-details {
  margin-top: var(--spacing-md);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  transition: all 0.3s ease;
}

.cocktail-details:hover {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-light);
}

.cocktail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--background-color-light);
}

.cocktail-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.cocktail-image {
  width: 100%;
  height: 200px;
  border-radius: var(--border-radius-base);
  margin: var(--spacing-md) 0;
  transition: all 0.3s ease;
}

.cocktail-image:hover {
  transform: scale(1.02);
}

.cocktail-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.ingredients h4,
.instructions h4 {
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.ingredients-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.ingredient-tag {
  margin-right: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  border-radius: var(--border-radius-base);
  transition: all 0.3s ease;
}

.ingredient-tag:hover {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-base);
}

:deep(.el-steps) {
  padding: var(--spacing-sm);
}

:deep(.el-step__title) {
  font-size: 14px;
  font-weight: 500;
}

:deep(.el-step__description) {
  font-size: 13px;
  color: var(--text-regular);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cocktail-image {
    height: 160px;
  }

  .ingredients-list {
    justify-content: center;
  }
}
</style> 