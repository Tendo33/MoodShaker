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
  margin-top: 16px;
}

.cocktail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cocktail-image {
  width: 100%;
  height: 200px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.cocktail-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ingredients h4,
.instructions h4 {
  margin-bottom: 8px;
  font-weight: bold;
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
</style> 