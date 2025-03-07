<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'w-full uppercase font-semibold rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none focus:ring-4',
      variant === 'primary'
        ? 'text-white bg-blue-600 enabled:hover:bg-blue-700 focus:ring-blue-300'
        : 'text-gray-800 bg-gray-200 enabled:hover:bg-gray-300 focus:ring-gray-300',
      disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
      className,
    ]"
    @click="$emit('click')"
  >
    <span v-if="loading" class="inline-flex items-center">
      <Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4" />
      {{ loadingText }}
    </span>
    <slot v-else></slot>
  </button>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next'

defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Loading...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])
</script>
