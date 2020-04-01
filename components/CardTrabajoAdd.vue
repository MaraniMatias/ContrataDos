<template>
  <v-hover v-slot:default="{ hover }" open-delay="200">
    <v-card outlined :elevation="hover ? 1 : 0" class="my-4" @click="add()">
      <v-card-text class="text-center py-4">
        <v-icon size="120" color="grey lighten-1">
          add_circle_outline
        </v-icon>
        <p class="headline mb-1">Agregar nuevo trabajo.</p>
      </v-card-text>
    </v-card>
  </v-hover>
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
