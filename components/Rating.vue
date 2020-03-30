<template>
  <v-layout v-if="editable" justify-center align-center>
    <v-btn class="ma-2" text icon :color="upIcon.color">
      <v-icon>mdi-thumb-up</v-icon>
    </v-btn>
    <v-btn class="ma-2" text icon :color="downIcon.color">
      <v-icon>mdi-thumb-down</v-icon>
    </v-btn>
  </v-layout>
  <v-layout v-else justify-center align-center>
    <v-icon class="ma-2 px-1" :size="upIcon.size" :color="upIcon.color">
      mdi-thumb-up
    </v-icon>
    <v-icon class="ma-2 px-1" :size="downIcon.size" :color="downIcon.color">
      mdi-thumb-down
    </v-icon>
  </v-layout>
</template>

<script>
export default {
  props: {
    value: { type: [String, Number], default: 0 },
    editable: { type: Boolean, default: false },
  },
  data: () => ({}),
  computed: {
    upIcon() {
      return {
        color: this.value >= 50 && this.value > 0 ? 'blue lighten-2' : '',
        size: this.value >= 50 ? 42 : 32,
      }
    },
    downIcon() {
      return {
        color: this.value <= 50 && this.value > 0 ? 'red lighten-2' : '',
        size: this.value >= 50 ? 42 : 32,
      }
    },
  },
  methods: {},
}
</script>
>

<style scoped>
.logo {
  margin: 2px 0 0 0;
  height: 42px;
}
</style>
