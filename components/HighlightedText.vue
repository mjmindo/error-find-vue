<template>
  <div class="highlighted-text">
    <span
      v-for="(part, index) in parts"
      :key="index"
      :class="{ 'highlight': part.highlight }"
    >
      {{ part.text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { parseHighlightedText } from '../utils/formatters'

interface Props {
  text: string
}

const props = defineProps<Props>()

const parts = computed(() => parseHighlightedText(props.text))
</script>

<style scoped>
.highlighted-text .highlight {
  font-weight: bold;
}
</style>
