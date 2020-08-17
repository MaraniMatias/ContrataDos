<template>
  <v-row align="center" justify="center" class="mb-12">
    <div class="text-center">
      <h1 style="font-size: 64px;">Adiós</h1>
      <p class="description mt-4">
        <NuxtLink to="/">Ir al inicio</NuxtLink>
      </p>
    </div>
  </v-row>
</template>

<script>
import { isMobile } from 'mobile-device-detect'

export default {
  components: {},
  data: () => ({}),
  layout() {
    return isMobile ? 'mobile' : 'default'
  },
  computed: {},
  methods: {},
}
</script>
