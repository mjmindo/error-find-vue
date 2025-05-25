import type { QuizApiResponse } from '~/types/api'

export const useQuizFetch = () => {
  const data = ref<QuizApiResponse | null>(null)
  const loading = ref(true)
  const error = ref<Error | null>(null)

  const fetchData = async () => {
    try {
      loading.value = true
      const response = await $fetch<QuizApiResponse>('/api/payload.json')
      data.value = response
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('An error occurred while fetching data')
      data.value = null
    } finally {
      loading.value = false
    }
  }

  // Fetch data on composable initialization
  onMounted(() => {
    fetchData()
  })

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    refetch: fetchData
  }
}
