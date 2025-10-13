<template>
  <h1 class="text-3xl md:text-4xl font-extrabold text-body-700 tracking-tight my-12 ">{{ title }}</h1>
</template>

<script>
export default {
  name: 'TitleHtml',
  components: {
  },
  props: {
    title: String
  }
}
</script>