<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div v-if="loading" class="text-center">
      <div class="text-lg text-gray-600">Loading quiz data...</div>
    </div>

    <div v-else-if="error" class="text-center">
      <div class="text-lg text-red-600">Error loading quiz data</div>
      <p class="text-gray-600 mt-2">{{ error.message }}</p>
    </div>

    <div v-else-if="data" class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <h4 class="text-sm text-gray-500 uppercase tracking-wider mb-2">CAE</h4>
          <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ data.name }}</h1>
          <p class="text-gray-600 leading-relaxed">{{ data.heading }}</p>
        </div>

        <div class="space-y-4">
          <Button
            v-for="(activity, index) in data.activities"
            :key="index"
            :fullWidth="true"
            @click="startActivity(index)"
          >
            {{ activity.activity_name.toUpperCase() }}
          </Button>
        </div>

        <div v-if="quizState.isComplete" class="mt-6">
          <Button
            variant="secondary"
            :fullWidth="true"
            @click="viewResults"
          >
            VIEW RESULTS
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef, type Ref } from 'vue'
import { useQuizFetch } from '../composables/useFetch'
import { useQuiz } from '../composables/useQuiz'
import { useRouter } from 'vue-router'
import type { QuizApiResponse } from '../types/api'
const router = useRouter()
const { data, loading, error } = useQuizFetch()
const quiz = useQuiz(toRef(data) as Ref<QuizApiResponse | null>)
const { quizState } = quiz

const startActivity = (activityIndex: number) => {
  quiz.resetQuiz()
  quiz.setCurrentActivity(activityIndex)
  router.push(`/quiz/${activityIndex}`)
}

const viewResults = () => {
  router.push(`/score/${quizState.value.currentActivity}`)
}
</script>
