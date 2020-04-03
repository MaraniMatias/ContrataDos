<template>
  <v-row align="center" justify="center" class="mb-12">
    <div class="text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="120"
        fill="#DBE1EC"
        viewBox="0 0 48 48"
      >
        <path
          d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
        ></path>
      </svg>
      <h1 v-if="error.statusCode === 404">Esta pagina no existe</h1>
      <template v-else>
        <h1>A ocurrido un error</h1>
        <p class="error--text" v-text="error.message" />
        <pre v-if="showErrorObject">{{ error }}</pre>
      </template>
      <p class="description mt-4">
        <NuxtLink to="/">Ir al inicio</NuxtLink>
      </p>
    </div>
  </v-row>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: { type: Object, default: null },
  },
  data: () => ({
    pageNotFound: '404 Not Found',
    otherError: 'An error occurred',
  }),
  computed: {
    showErrorObject() {
      return process.env.NODE_ENV === 'development'
    },
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
