<template>
  <v-layout>
    <v-flex class="text-center">
      Ir a prefil y actualizar
      <v-btn @click="testApi">Test api</v-btn>
      <pre v-text="data" />
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'authenticated',
  data: () => ({
    data: {},
  }),
  methods: {
    testApi() {
      this.data = { name: 'asda' }
    },
  },
}
</script>
