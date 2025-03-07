<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <div class="container mx-auto px-4 pt-24 pb-12 flex-grow">
      <div class="max-w-3xl mx-auto">
        <TaskHeader />
        <TaskForm v-model="newTaskTitle" @add-task="addTask" ref="addTaskInput" />
        <TaskLoading v-if="loading" />
        <TaskError v-if="error" :message="error" />
        <TaskEmpty v-if="!loading && tasks.length === 0" @focus-add="focusAddTask" />
        <TaskList
          v-if="!loading && tasks.length > 0"
          :tasks="tasks"
          :completed-count="completedTasksCount"
          :editing-id="editingTaskId"
          :edit-title="editTaskTitle"
          @toggle-status="toggleTaskStatus"
          @start-edit="startEdit"
          @update-task="updateTask"
          @cancel-edit="cancelEdit"
          @delete-task="deleteTask"
          ref="editInput"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import TaskHeader from '@/components/tasks/TaskHeader.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import TaskLoading from '@/components/tasks/TaskLoading.vue'
import TaskError from '@/components/tasks/TaskError.vue'
import TaskEmpty from '@/components/tasks/TaskEmpty.vue'
import TaskList from '@/components/tasks/TaskList.vue'

const tasks = ref([])
const loading = ref(true)
const error = ref('')
const newTaskTitle = ref('')
const editingTaskId = ref(null)
const editTaskTitle = ref('')
const editInput = ref(null)
const addTaskInput = ref(null)

const completedTasksCount = computed(() => {
  return tasks.value.filter((task) => task.completed).length
})

const fetchTasks = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.get('/api/tasks/')
    tasks.value = response.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    error.value = 'Failed to load tasks. Please try again.'
  } finally {
    loading.value = false
  }
}

const addTask = async () => {
  if (!newTaskTitle.value.trim()) return

  try {
    const response = await axios.post('/api/tasks/', {
      title: newTaskTitle.value.trim(),
      completed: false,
    })
    tasks.value.unshift(response.data)
    newTaskTitle.value = ''
  } catch (error) {
    console.error('Error adding task:', error)
    error.value = 'Failed to add task. Please try again.'
  }
}

const updateTask = async (task) => {
  if (!editTaskTitle.value.trim()) return

  try {
    const response = await axios.put(`/api/tasks/${task.id}/`, {
      ...task,
      title: editTaskTitle.value.trim(),
    })

    const taskIndex = tasks.value.findIndex((currentTask) => currentTask.id === task.id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = response.data
    }

    editingTaskId.value = null
    editTaskTitle.value = ''
  } catch (error) {
    console.error('Error updating task:', error)
    error.value = 'Failed to update task. Please try again.'
  }
}

const toggleTaskStatus = async (task) => {
  try {
    const response = await axios.put(`/api/tasks/${task.id}/`, {
      ...task,
      completed: !task.completed,
    })

    const taskIndex = tasks.value.findIndex((currentTask) => currentTask.id === task.id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = response.data
    }
  } catch (error) {
    console.error('Error toggling task status:', error)
    error.value = 'Failed to update task status. Please try again.'
  }
}

const deleteTask = async (taskId) => {
  if (!confirm('Are you sure you want to delete this task?')) return

  try {
    await axios.delete(`/api/tasks/${taskId}/`)
    tasks.value = tasks.value.filter((task) => task.id !== taskId)
  } catch (error) {
    console.error('Error deleting task:', error)
    error.value = 'Failed to delete task. Please try again.'
  }
}

const focusAddTask = () => {
  if (addTaskInput.value) {
    addTaskInput.value.focus()
  }
}

const startEdit = (task) => {
  editingTaskId.value = task.id
  editTaskTitle.value = task.title

  setTimeout(() => {
    if (editInput.value) {
      editInput.value.focus()
    }
  }, 50)
}

const cancelEdit = () => {
  editingTaskId.value = null
  editTaskTitle.value = ''
}

onMounted(fetchTasks)
</script>
