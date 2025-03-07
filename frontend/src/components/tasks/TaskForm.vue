<template>
  <div class="mb-8 bg-white p-4 rounded-[12px] shadow-sm border border-gray-100">
    <div class="flex items-center">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter="$emit('add-task')"
        type="text"
        placeholder="Add a new task..."
        class="w-full px-4 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-amber-300 focus:border-amber-500 focus:outline-none"
        ref="inputField"
      />
      <button
        @click="$emit('add-task')"
        :disabled="!modelValue.trim()"
        class="flex bg-[#FFC107] p-2 m-1 rounded-[12px] justify-center items-center font-semibold cursor-pointer"
      >
        <PlusCircle class="w-5 h-5 mr-2" />
        Add
      </button>
    </div>
  </div>
</template>

<script setup>
import { PlusCircle } from 'lucide-vue-next'
import { ref, defineExpose } from 'vue'

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const inputField = ref(null)

defineEmits(['update:modelValue', 'add-task'])

// Expose focus method to parent
defineExpose({
  focus: () => {
    inputField.value?.focus()
  },
})
</script>
