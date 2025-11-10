<template>
      <nav class="bg-white shadow-md">
      <div class="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">

        <div class="flex items-center space-x-2">
          <svg class="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span class="font-bold text-xl text-blue-700">Task board</span>
        </div>

        <div class="flex items-center space-x-6">
          <router-link
            to="/"
            class="text-gray-700 hover:text-blue-600 font-medium"
            exact
            >Accueil</router-link>
          <router-link
            to="/boards"
            class="text-gray-700 hover:text-blue-600 font-medium"
            >Tasks Boards</router-link>
        </div>
        
      </div>
    </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>
