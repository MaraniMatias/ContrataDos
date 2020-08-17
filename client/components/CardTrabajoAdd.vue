<template>
  <v-hover v-slot:default="{ hover }" open-delay="200">
    <v-card
      outlined
      :elevation="hover ? 1 : 0"
      class="my-4"
      @click="$emit('click')"
    >
      <v-card-text class="text-center py-4">
        <v-icon size="120" color="grey lighten-1">
          add_circle_outline
        </v-icon>
        <p class="headline mb-1">Publicar trabajo realizado.</p>
      </v-card-text>
    </v-card>
  </v-hover>
</template>
