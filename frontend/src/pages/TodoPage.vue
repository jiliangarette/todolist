<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!isAuthenticated" class="text-center">
      <h2 class="text-2xl font-bold mb-4">Please Login</h2>
      <p class="mb-4">You need to be logged in to manage your tasks</p>
      <router-link to="/" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Go to Login
      </router-link>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold mb-6">My Tasks</h1>

      <div class="mb-8 bg-white p-4 rounded shadow">
        <div class="flex gap-2">
          <input
            v-model="newTaskTitle"
            @keyup.enter="addTask"
            type="text"
            placeholder="Add a new task..."
            class="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="addTask"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            :disabled="!newTaskTitle.trim()"
          >
            Add Task
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-600">Loading tasks...</p>
      </div>

      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>{{ error }}</p>
      </div>

      <div v-if="!loading && tasks.length === 0" class="text-center py-8">
        <p class="text-gray-600">No tasks yet. Add one above!</p>
      </div>

      <div v-if="!loading && tasks.length > 0" class="space-y-3">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="bg-white p-4 rounded shadow flex items-center gap-3"
        >
          <template v-if="editingTaskId === task.id">
            <input
              v-model="editTaskTitle"
              @keyup.enter="updateTask(task)"
              @keyup.esc="cancelEdit"
              type="text"
              class="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ref="editInput"
            />
            <button @click="updateTask(task)" class="text-green-600 hover:text-green-800">
              Save
            </button>
            <button @click="cancelEdit" class="text-gray-600 hover:text-gray-800">Cancel</button>
          </template>

          <template v-else>
            <input
              type="checkbox"
              :checked="task.completed"
              @change="toggleTaskStatus(task)"
              class="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span
              :class="{
                'line-through text-gray-500': task.completed,
                'text-gray-800': !task.completed,
              }"
              class="flex-1"
            >
              {{ task.title }}
            </span>
            <span class="text-xs text-gray-500">{{ formatDate(task.created_at) }}</span>
            <button @click="startEdit(task)" class="text-blue-600 hover:text-blue-800">Edit</button>
            <button @click="deleteTask(task.id)" class="text-red-600 hover:text-red-800">
              Delete
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const tasks = ref([])
const loading = ref(true)
const error = ref('')
const newTaskTitle = ref('')
const editingTaskId = ref(null)
const editTaskTitle = ref('')
const editInput = ref(null)

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token')
})

const fetchTasks = async () => {
  loading.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      error.value = 'Authentication required'
      loading.value = false
      return
    }

    const response = await axios.get('/api/tasks/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    tasks.value = response.data
  } catch (err) {
    console.error('Error fetching tasks:', err)
    error.value = 'Failed to load tasks. Please try again.'
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/')
    }
  } finally {
    loading.value = false
  }
}

const addTask = async () => {
  if (!newTaskTitle.value.trim()) return

  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(
      '/api/tasks/',
      { title: newTaskTitle.value.trim(), completed: false },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    tasks.value.unshift(response.data)
    newTaskTitle.value = ''
  } catch (err) {
    console.error('Error adding task:', err)
    error.value = 'Failed to add task. Please try again.'
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/')
    }
  }
}

const startEdit = (task) => {
  editingTaskId.value = task.id
  editTaskTitle.value = task.title

  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus()
    }
  })
}

const cancelEdit = () => {
  editingTaskId.value = null
  editTaskTitle.value = ''
}

const updateTask = async (task) => {
  if (!editTaskTitle.value.trim()) return

  try {
    const token = localStorage.getItem('token')
    const response = await axios.put(
      `/api/tasks/${task.id}/`,
      { ...task, title: editTaskTitle.value.trim() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const index = tasks.value.findIndex((t) => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = response.data
    }

    editingTaskId.value = null
    editTaskTitle.value = ''
  } catch (err) {
    console.error('Error updating task:', err)
    error.value = 'Failed to update task. Please try again.'
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/')
    }
  }
}

const toggleTaskStatus = async (task) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.put(
      `/api/tasks/${task.id}/`,
      { ...task, completed: !task.completed },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const index = tasks.value.findIndex((t) => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = response.data
    }
  } catch (err) {
    console.error('Error toggling task status:', err)
    error.value = 'Failed to update task. Please try again.'
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/')
    }
  }
}

const deleteTask = async (taskId) => {
  if (!confirm('Are you sure you want to delete this task?')) return

  try {
    const token = localStorage.getItem('token')
    await axios.delete(`/api/tasks/${taskId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    tasks.value = tasks.value.filter((task) => task.id !== taskId)
  } catch (err) {
    console.error('Error deleting task:', err)
    error.value = 'Failed to delete task. Please try again.'
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/')
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

onMounted(() => {
  if (isAuthenticated.value) {
    fetchTasks()
  }
})
</script>
