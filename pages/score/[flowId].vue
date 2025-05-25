<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div v-if="!data || !activity" class="text-center">
      <div class="text-lg text-gray-600">Loading results...</div>
    </div>

    <div v-else class="w-full max-w-2xl">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-2xl font-bold text-gray-800 text-center mb-6">
          {{ activity?.activity_name }}
        </h1>
        <h2 class="text-xl text-gray-700 text-center mb-8">Results</h2>

        <template v-if="activityIndex === 0">
          <div class="space-y-4">
            <div
              v-for="(question, index) in activityQuestions"
              :key="index"
              :class="`flex items-center justify-between p-4 rounded-lg ${getAnswerClass(index)}`"
            >
              <div class="font-semibold">Q{{ index + 1 }}:</div>
              <div>{{ isAnswerCorrect(index) ? 'CORRECT' : 'FALSE' }}</div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="space-y-6">
            <div
              v-for="(round, roundIndex) in activityRounds"
              :key="roundIndex"
              class="bg-gray-50 p-6 rounded-lg"
            >
              <h3 class="text-lg font-semibold mb-4">{{ round.round_title }}</h3>
              <div class="space-y-3">
                <div
                  v-for="(question, questionIndex) in round.questions"
                  :key="questionIndex"
                  :class="`flex items-center justify-between p-3 rounded-lg ${getAnswerClass(questionIndex, roundIndex)}`"
                >
                  <div class="font-semibold">Q{{ questionIndex + 1 }}:</div>
                  <div>{{ isAnswerCorrect(questionIndex, roundIndex) ? 'CORRECT' : 'FALSE' }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div class="mt-8 flex justify-center">
          <Button @click="returnHome">HOME</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion, QuizRound, Activity, QuizApiResponse } from '../../types/api'
import { useQuizFetch } from '../../composables/useFetch'
import { useQuiz } from '../../composables/useQuiz'
import { useRoute, useRouter } from 'vue-router'
import { computed, toRef, type Ref } from 'vue'

const route = useRoute()
const router = useRouter()

const activityIndex = Number(route.params.flowId)
const { data } = useQuizFetch()
const quiz = useQuiz(toRef(data) as Ref<QuizApiResponse | null>)
const { quizState } = quiz

const activity = computed<Activity | null>(() =>
  (data.value?.activities[activityIndex] as Activity) || null
)

const activityQuestions = computed<QuizQuestion[]>(() => {
  if (activity.value && activityIndex === 0) {
    return activity.value.questions as QuizQuestion[]
  }
  return []
})

const activityRounds = computed<QuizRound[]>(() => {
  if (activity.value && activityIndex !== 0) {
    return activity.value.questions as QuizRound[]
  }
  return []
})

const getAnswerClass = (questionIndex: number, roundIndex = 0) => {
  const answerKey = `${activityIndex}-${roundIndex}-${questionIndex}`
  const isCorrect = quizState.value.answers[answerKey]
  return isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
}

const isAnswerCorrect = (questionIndex: number, roundIndex = 0) => {
  const answerKey = `${activityIndex}-${roundIndex}-${questionIndex}`
  return quizState.value.answers[answerKey]
}

const returnHome = () => {
  quiz.resetQuiz()  
  router.push('/')
}
</script>
