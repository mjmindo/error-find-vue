import type {
  Activity,
  QuizApiResponse,
  QuizQuestion,
  QuizRound,
  QuizState,
  UserAnswer,
} from '~/types/api'

const initialQuizState: QuizState = {
  currentActivity: 0,
  currentQuestion: 0,
  currentRound: 0,
  answers: {},
  isComplete: false,
  score: 0,
}

const quizState = ref<QuizState>({ ...initialQuizState })

export const useQuiz = (quizData: Ref<QuizApiResponse | null>) => {
  const currentActivity = computed(() => 
    quizData.value?.activities[quizState.value.currentActivity] || null
  )

  const getQuestions = computed(() => {
    if (!currentActivity.value) {
      return []
    }

    if (quizState.value.currentActivity === 0) {
      const questions = currentActivity.value.questions as QuizQuestion[]
      return questions
    }

    const rounds = currentActivity.value.questions as QuizRound[]
    if (rounds.length <= quizState.value.currentRound) {
      return []
    }

    return rounds[quizState.value.currentRound].questions
  })

  const currentQuestion = computed(() => {
    const questions = getQuestions.value

    if (questions.length <= quizState.value.currentQuestion) {
      return null
    }

    return questions[quizState.value.currentQuestion]
  })

  const currentRoundTitle = computed(() => {
    if (!currentActivity.value || quizState.value.currentActivity === 0) return null
    const rounds = currentActivity.value.questions as QuizRound[]
    if (rounds.length <= quizState.value.currentRound) return null
    return rounds[quizState.value.currentRound].round_title
  })

  const totalQuestions = computed(() => getQuestions.value.length)

  const answeredQuestions = computed(() => quizState.value.currentQuestion + 1)

  const isLastQuestion = computed(() => 
    quizState.value.currentQuestion === totalQuestions.value - 1
  )

  const isLastRound = computed(() => {
    if (!currentActivity.value || quizState.value.currentActivity === 0) return true
    const rounds = currentActivity.value.questions as QuizRound[]
    return quizState.value.currentRound >= rounds.length - 1
  })

  const answerQuestion = (answer: UserAnswer) => {
    if (!currentQuestion.value) return

    const answerKey = `${quizState.value.currentActivity}-${quizState.value.currentRound}-${quizState.value.currentQuestion}`
    const isCorrect = answer === currentQuestion.value.is_correct
    quizState.value.answers = {
      ...quizState.value.answers,
      [answerKey]: isCorrect,
    }
  }

  const nextQuestion = () => {
    const willBeLastQuestion = quizState.value.currentQuestion === totalQuestions.value - 1

    if (willBeLastQuestion) {
      quizState.value.isComplete = true
    } else {
      quizState.value.currentQuestion = quizState.value.currentQuestion + 1
    }
  }

  const nextRound = () => {
    if (quizState.value.currentActivity === 0) return

    quizState.value.currentRound = quizState.value.currentRound + 1
    quizState.value.currentQuestion = 0
  }

  const resetQuiz = () => {
    quizState.value = { ...initialQuizState }
  }

  const setCurrentActivity = (activityIndex: number) => {
    quizState.value.currentActivity = activityIndex
    quizState.value.currentQuestion = 0
    quizState.value.currentRound = 0
  }

  const calculateScore = computed(() => {
    const answers = quizState.value.answers
    const correctAnswers = Object.values(answers).filter(Boolean).length
    const totalAnswers = Object.values(answers).length
    return totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0
  })

  return {
    quizState: readonly(quizState),
    currentQuestion,
    currentActivity,
    currentRoundTitle,
    totalQuestions,
    answeredQuestions,
    isLastQuestion,
    isLastRound,
    answerQuestion,
    nextQuestion,
    nextRound,
    resetQuiz,
    setCurrentActivity,
    calculateScore,
  }
}
