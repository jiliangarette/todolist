<template>
  <nav class="bg-white border-b shadow-sm border-gray-200 fixed w-full z-50">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <router-link to="/" class="flex items-center gap-2">
        <ListFilterPlus color="#FFC107" />
        <span class="self-center text-lg text-[#FFC107] font-semibold whitespace-nowrap"
          >Todo list</span
        >
      </router-link>

      <button
        @click="isMenuOpen = !isMenuOpen"
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <Menu v-if="!isMenuOpen" class="w-5 h-5" />
        <X v-else class="w-5 h-5" />
      </button>

      <div
        :class="isMenuOpen ? 'block' : 'hidden'"
        class="w-full md:block md:w-auto"
        id="navbar-default"
      >
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white"
        >
          <li v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="rounded-md text-indigo-dye bg-[#FFC107] px-6 py-1 font-bold shadow-sm hover:bg-amber-500"
            >
              Sign In
            </router-link>
          </li>
          <li v-else>
            <button
              @click="handleLogout"
              class="rounded-md text-indigo-dye bg-[#FFC107] px-6 py-1 font-bold shadow-sm hover:bg-amber-500"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Menu, X, ListFilterPlus } from 'lucide-vue-next'

const isMenuOpen = ref(false)
const isLoggedIn = ref(false)

onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('token')
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  isLoggedIn.value = false
}
</script>
