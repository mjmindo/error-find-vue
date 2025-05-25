<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div v-if="!data || !currentQuestion || !currentActivity" class="text-center">
      <div class="text-lg text-gray-600">Loading quiz...</div>
    </div>

    <div v-else-if="showingInitialLoading" 
         class="w-full max-w-2xl" 
         @click="skipInitialLoading">
      <div class="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer">
        <div class="mb-8">
          <h4 class="text-2xl font-bold text-gray-800 mb-4">
            {{ currentActivity.activity_name }}
          </h4>
          <h3 v-if="isActivityTwo" class="text-xl text-gray-600">
            Round {{ quizState.currentRound + 1 }}
          </h3>
        </div>
        <p class="text-sm text-gray-500">Click to continue</p>
      </div>
    </div>

    <div v-else-if="showingRoundIntro" 
         class="w-full max-w-2xl" 
         @click="skipRoundIntro">
      <div class="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer">
        <div class="mb-8">
          <h4 class="text-2xl font-bold text-gray-800 mb-4">
            {{ currentActivity.activity_name }}
          </h4>
          <h3 class="text-xl text-gray-600">
            Round {{ quizState.currentRound + 1 }}
          </h3>
        </div>
        <p class="text-sm text-gray-500">Click to continue</p>
      </div>
    </div>

    <div v-else class="w-full">
      <QuestionCard
        :key="`${activityIndex}-${answeredQuestions}`"
        :question="currentQuestion"
        :questionNumber="quizState.currentQuestion"
        :activityTitle="currentActivity.activity_name"
        @answer="handleAnswer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, toRef, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizFetch } from '../../composables/useFetch'
import { useQuiz } from '../../composables/useQuiz'
import type { QuizApiResponse } from '../../types/api'
const route = useRoute()
const router = useRouter()
const activityIndex = Number(route.params.flowId)

const { data } = useQuizFetch()
const quiz = useQuiz(toRef(data) as Ref<QuizApiResponse | null>)
const {
  quizState,
  currentQuestion,
  currentActivity,
  answeredQuestions,
  isLastQuestion,
  isLastRound,
  answerQuestion,
  nextQuestion,
  nextRound,
} = quiz

const isActivityTwo = activityIndex === 1
const showingRoundIntro = ref(false)
const showingInitialLoading = ref(true)

let roundIntroTimer: ReturnType<typeof setTimeout> | null = null
let initialLoadingTimer: ReturnType<typeof setTimeout> | null = null

// Auto-skip initial loading after 2 seconds
watch([data, currentQuestion, currentActivity], () => {
  if (showingInitialLoading.value && data.value && currentQuestion.value && currentActivity.value) {
    initialLoadingTimer = setTimeout(() => {
      showingInitialLoading.value = false
    }, 2000)
  }
}, { immediate: true })

const skipInitialLoading = () => {
  if (initialLoadingTimer) {
    clearTimeout(initialLoadingTimer)
    initialLoadingTimer = null
  }
  showingInitialLoading.value = false
}

const skipRoundIntro = () => {
  if (roundIntroTimer) {
    clearTimeout(roundIntroTimer)
    roundIntroTimer = null
  }
  showingRoundIntro.value = false
}

const handleAnswer = (answer: boolean) => {
  answerQuestion(answer)

  // Automatically proceed to next question/page
  if (isLastQuestion.value) {
    if (isActivityTwo && !isLastRound.value) {
      showingRoundIntro.value = true
      nextRound()
      roundIntroTimer = setTimeout(() => {
        showingRoundIntro.value = false
      }, 2000)
    } else {
      router.push(`/score/${activityIndex}`)
    }
  } else {
    nextQuestion()
  }
}

// Cleanup timers on unmount
onUnmounted(() => {
  if (roundIntroTimer) {
    clearTimeout(roundIntroTimer)
  }
  if (initialLoadingTimer) {
    clearTimeout(initialLoadingTimer)
  }
})
</script>
