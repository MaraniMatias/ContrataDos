<template>
  <div>
    <v-rating
      v-if="star"
      :value="starValue"
      half-increments
      color="amber"
      half-icon="star_half"
      background-color="grey"
      readonly
      dense
      size="32"
    />
    <template v-else>
      <v-layout v-if="editable" justify-center align-center>
        <v-hover v-slot:default="{ hover }">
          <v-btn
            class="mx-2"
            text
            icon
            :color="hover ? 'blue' : upIcon.color"
            @click="emit(true)"
          >
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>
        </v-hover>
        <v-hover v-slot:default="{ hover }">
          <v-btn
            class="mx-2"
            text
            icon
            :color="hover ? 'red' : downIcon.color"
            @click="emit(false)"
          >
            <v-icon>mdi-thumb-down</v-icon>
          </v-btn>
        </v-hover>
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
  </div>
</template>

<script>
import { RatingTrabajo } from '~~/server/utilities/enums'

export default {
  props: {
    value: { type: [String, Number], default: 0 },
    editable: { type: Boolean, default: false },
    star: { type: Boolean, default: false },
    size: { type: [String, Number], default: 0 },
  },
  data: () => ({}),
  computed: {
    upIcon() {
      const color = 'blue lighten-2'
      return {
        color:
          this.value === RatingTrabajo.LIKE
            ? color
            : this.value >= 50 && this.value > 0
            ? color
            : 'grey lighten-1',
        size: this.size || (this.value >= 50 ? 42 : 32),
      }
    },
    downIcon() {
      const color = 'red lighten-2'
      return {
        color:
          this.value === RatingTrabajo.DONT_LIKE
            ? color
            : this.value <= 50 && this.value > 0
            ? color
            : 'grey lighten-1',
        size: this.size || (this.value >= 50 ? 42 : 32),
      }
    },
    starValue() {
      return this.value * 5
    },
  },
  methods: {
    emit(value) {
      this.$emit('change', value ? RatingTrabajo.LIKE : RatingTrabajo.DONT_LIKE)
    },
  },
}
</script>
>

<style scoped>
.logo {
  margin: 2px 0 0 0;
  height: 42px;
}
</style>
