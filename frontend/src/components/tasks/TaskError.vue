<template>
  <div class="p-4 mb-4 bg-red-100 text-red-700 rounded-[12px] flex items-center">
    <AlertCircle class="w-5 h-5 mr-2" />
    {{ message }}
  </div>
</template>

<script setup>
import { AlertCircle } from 'lucide-vue-next'

defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>
