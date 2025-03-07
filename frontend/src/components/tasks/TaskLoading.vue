<template>
  <div class="flex justify-center items-center p-8 bg-white rounded-[12px] mb-4">
    <Loader2 class="animate-spin h-8 w-8 text-amber-500 mr-3" />
    <span class="text-gray-600 font-medium">Loading tasks...</span>
  </div>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next'
</script>
