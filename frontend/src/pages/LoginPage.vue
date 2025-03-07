<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-full lg:py-0">
      <div class="login-box">
        <div class="mb-9">
          <h1
            class="text-2xl text-center font-bold leading-none tracking-tight text-indigo-dye lg:text-[45px] mb-4"
          >
            Welcome back!
          </h1>
          <p class="text-center text-[#6F829B]">Start managing your tasks faster and better.</p>
        </div>

        <form @submit.prevent="handleLogin" class="sm:min-w-lg">
          <Input v-model="username" placeholder="Username" :icon="User2" />

          <Input
            v-model="password"
            type="password"
            placeholder="Password"
            :icon="Lock"
            :toggleable="true"
          />

          <div class="text-sm font-semibold text-blue-600 hover:underline float-right mb-5">
            <div>Forgot password?</div>
          </div>

          <Button type="submit" :loading="loading" loadingText="Signing In..." class="mb-5">
            Sign In
          </Button>

          <div class="text-sm font-light text-gray-500 text-center mb-9">
            Don't have an account yet?
            <router-link to="/register" class="font-semibold text-blue-600 hover:underline"
              >Sign Up here</router-link
            >
          </div>
        </form>

        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { User2, Lock } from 'lucide-vue-next'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const username = ref('TestUsername')
const password = ref('TestPassword')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.post('/api/token/', {
      username: username.value,
      password: password.value,
    })

    localStorage.setItem('token', response.data.access)
    localStorage.setItem('refresh_token', response.data.refresh)

    router.push('/')
  } catch (err) {
    error.value = 'Invalid username or password'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>
