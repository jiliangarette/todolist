<template>
  <div class="bg-white rounded-[12px] overflow-hidden shadow-sm border border-gray-100">
    <div class="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
      <div class="font-medium text-gray-600">Tasks ({{ tasks.length }})</div>
      <div class="text-sm text-gray-500">{{ completedCount }} of {{ tasks.length }} completed</div>
    </div>

    <div class="divide-y divide-gray-100">
      <div
        v-for="task in tasks"
        :key="task.id"
        :class="[
          'p-4 hover:bg-gray-50 transition-colors duration-150',
          task.completed ? 'bg-gray-50' : '',
        ]"
      >
        <template v-if="editingId === task.id">
          <div class="flex items-center">
            <input
              v-model="localEditTitle"
              @keyup.enter="$emit('update-task', task)"
              @keyup.esc="$emit('cancel-edit')"
              type="text"
              ref="editInputField"
              class="w-full px-4 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-amber-300 focus:border-amber-500 focus:outline-none"
            />
            <div class="flex ml-2">
              <button
                @click="$emit('update-task', task)"
                class="p-2 text-green-600 hover:text-green-800"
              >
                <Check class="w-5 h-5" />
              </button>
              <button @click="$emit('cancel-edit')" class="p-2 text-gray-600 hover:text-gray-800">
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
              <input
                type="checkbox"
                :checked="task.completed"
                @change="$emit('toggle-status', task)"
                class="w-5 h-5 mr-3 rounded text-amber-500 focus:ring-amber-500"
              />
              <span
                :class="[
                  'flex-1 text-gray-800',
                  task.completed ? 'line-through text-gray-500' : '',
                ]"
              >
                {{ task.title }}
              </span>
            </div>

            <div class="flex items-center">
              <button
                @click="$emit('start-edit', task)"
                class="p-2 text-blue-600 hover:text-blue-800"
              >
                <Edit class="w-5 h-5" />
              </button>

              <button
                @click="$emit('delete-task', task.id)"
                class="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineExpose } from 'vue'
import { Check, X, Edit, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
  completedCount: {
    type: Number,
    required: true,
  },
  editingId: {
    type: Number,
    default: null,
  },
  editTitle: {
    type: String,
    default: '',
  },
})

defineEmits(['toggle-status', 'start-edit', 'update-task', 'cancel-edit', 'delete-task'])

const localEditTitle = ref('')
const editInputField = ref(null)

watch(
  () => props.editTitle,
  (newVal) => {
    localEditTitle.value = newVal
  },
)
defineExpose({
  focus: () => {
    editInputField.value?.focus()
  },
})
</script>
