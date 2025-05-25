<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
interface Props {
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  fullWidth: false,
  disabled: false,
})

defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => [
  'px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  {
    'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500': props.variant === 'primary',
    'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500': props.variant === 'secondary',
    'w-full': props.fullWidth,
  }
])
</script>
