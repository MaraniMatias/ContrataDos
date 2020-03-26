<template>
  <v-layout justify-center align-end class="grey--text">
    <p class="mb-0 text-center">
      <span class="hidden-md-and-down">Copyright &copy;</span>
      <span class="mx-1" v-text="year" />
      <span class="grey--text">ContrataDos</span>
    </p>
  </v-layout>
</template>

<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>
