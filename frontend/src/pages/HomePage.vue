<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full mx-4">
      <div class="text-center mb-8">
        <button
          @click="isLogin = true"
          :class="[
            'px-4 py-2 rounded-l',
            isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Login
        </button>
        <button
          @click="isLogin = false"
          :class="[
            'px-4 py-2 rounded-r',
            !isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Register
        </button>
      </div>

      <!-- Login Form -->
      <div v-if="isLogin" class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
              Username
            </label>
            <input
              v-model="loginForm.username"
              type="text"
              id="username"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Password
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              id="password"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>

      <!-- Register Form -->
      <div v-else class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="reg-username">
              Username
            </label>
            <input
              v-model="registerForm.username"
              type="text"
              id="reg-username"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="reg-email">
              Email
            </label>
            <input
              v-model="registerForm.email"
              type="email"
              id="reg-email"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="reg-password">
              Password
            </label>
            <input
              v-model="registerForm.password"
              type="password"
              id="reg-password"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="reg-confirm-password">
              Confirm Password
            </label>
            <input
              v-model="registerForm.confirmPassword"
              type="password"
              id="reg-confirm-password"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="loading"
          >
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
        role="alert"
      >
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLogin = ref(true)
const loading = ref(false)
const error = ref('')

const loginForm = reactive({
  username: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.post('/api/token/', {
      username: loginForm.username,
      password: loginForm.password,
    })

    localStorage.setItem('token', response.data.access)
    localStorage.setItem('refresh_token', response.data.refresh)

    loginForm.username = ''
    loginForm.password = ''

    router.push('/todos')
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.response?.data?.detail || 'Failed to login. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  if (registerForm.password !== registerForm.confirmPassword) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  try {
    await axios.post('/api/register/', {
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
    })

    const response = await axios.post('/api/token/', {
      username: registerForm.username,
      password: registerForm.password,
    })

    localStorage.setItem('token', response.data.access)
    localStorage.setItem('refresh_token', response.data.refresh)

    registerForm.username = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''

    router.push('/todos')
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.response?.data?.detail || 'Failed to register. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
