<template>
  <div>
    <header>
        <NavBar />
    </header>
    <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
      <router-view />
    </main>
    <footer></footer>
  </div>
</template>

<script>
import NavBar from '@/components/nav/NavBar.vue';

export default {
  name: 'BaseLayout',
  components: {NavBar},
  props: {}
}
</script>

<style scoped>

</style>
