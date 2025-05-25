<template>
  <div class="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <div class="text-sm text-gray-500 uppercase tracking-wide mb-2">
        {{ activityTitle }}
      </div>
      <div class="text-2xl font-bold text-gray-800 mb-6">
        {{ formatQuestionNumber(questionNumber) }}
      </div>
      <div class="text-lg leading-relaxed text-gray-700 mb-8 p-4 bg-gray-50 rounded-lg">
        <HighlightedText :text="question.stimulus" />
      </div>

      <div class="flex gap-4 justify-center">
        <Button @click="$emit('answer', true)" variant="primary">
          CORRECT
        </Button>
        <Button @click="$emit('answer', false)" variant="secondary">
          INCORRECT
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion } from '../types/api'
import { formatQuestionNumber } from '../utils/formatters'

interface Props {
  question: QuizQuestion
  questionNumber: number
  activityTitle: string
}

defineProps<Props>()

defineEmits<{
  answer: [answer: boolean]
}>()
</script>
