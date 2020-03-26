<template>
  <v-layout justify-center align-end py-3 class="grey--text">
    <p class="mb-0 text-center">
      <span class="hidden-md-and-down mr-1">Copyright ©</span>
      <span class="mr-1" v-text="year" />
      <span class="mx-1 grey--text"> ContrataDos by </span>
      <a
        class="link-apunte grey--text"
        href="http://www.qutap.com.ar"
        target="_blank"
      >
        Qutap, We do it.
      </a>
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
