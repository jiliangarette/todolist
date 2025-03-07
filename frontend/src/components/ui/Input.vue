<template>
  <div class="relative mb-5">
    <div class="relative mx-auto">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400"
      >
        <component :is="icon" size="16" />
      </div>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="toggleable && showPassword ? 'text' : type"
        :placeholder="placeholder"
        class="bg-gray-50 border border-gray-300 text-gray-900 pl-11 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        required
      />
      <button
        v-if="toggleable"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center px-4 text-blue-400"
        @click="showPassword = !showPassword"
      >
        <Eye size="16" v-if="showPassword" />
        <EyeClosed size="16" v-else />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye, EyeClosed } from 'lucide-vue-next'

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    required: true,
  },
  icon: {
    type: Object,
    required: true,
  },
  toggleable: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)
</script>
