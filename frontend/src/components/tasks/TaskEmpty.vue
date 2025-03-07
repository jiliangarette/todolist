<template>
  <div
    class="flex flex-col items-center justify-center p-12 bg-white rounded-[12px] border border-gray-100"
  >
    <ClipboardList class="w-16 h-16 text-gray-300 mb-4" />
    <p class="text-gray-500 text-lg mb-4">No tasks yet. Add one above!</p>
    <Button @click="$emit('focus-add')" class="max-w-xs">
      <PlusCircle class="w-5 h-5 mr-2" />
      Create First Task
    </Button>
  </div>
</template>

<script setup>
import { ClipboardList, PlusCircle } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

defineEmits(['focus-add'])
</script>
