<template>
  <v-layout>
    <v-flex xs12 sm12 md10 lg10 xl6 class="text-center mb-2">
      <span>Resultados de la búsqueda: {{ totalElement }}</span>
    </v-flex>

    {{ $route.query.q }}
  </v-layout>
</template>

<script>
export default {
  components: {},
  data: () => ({
    totalElement: 0,
  }),
}
</script>
