<template>
  <v-layout wrap align-center :justify-end="isFrom" mt-2>
    <div class="hidden-md-and-down">
      <p v-if="isFrom" class="caption grey--text mb-0 mr-2" v-text="fecha" />
    </div>
    <v-card :class="{ 'green lighten-5': isFrom }">
      <v-card-text class="py-1">
        <v-layout v-if="chat.fecha" column>
          <p class="mb-1">
            ¿Te parece una cita para el
            <span class="body-1 font-weight-black">{{ fechText }}</span> ?
          </p>
          <v-btn
            v-if="!isFrom"
            :disabled="disabled"
            color="teal"
            text
            class="mb-1"
            @click="accept"
          >
            Concretar la cita
          </v-btn>
        </v-layout>
        <p v-else class="mb-0" v-text="chat.detalle" />
      </v-card-text>
    </v-card>
    <div class="hidden-md-and-down">
      <p v-if="!isFrom" class="caption grey--text mb-0 ml-2" v-text="fecha" />
    </div>
  </v-layout>
</template>

<script>
import isBefore from 'date-fns/isBefore'
import dateFormat from '~/utils/dateFormat'
import dateFormatDistanceToNow from '~/utils/dateFormatDistanceToNow'

export default {
  components: {},
  props: {
    chat: { type: Object, required: true },
    editable: { type: Boolean, default: true },
  },
  data: () => ({}),
  computed: {
    isFrom() {
      const userId = this.$store.state.user._id
      return this.chat.from === userId || this.chat.from?._id === userId
    },
    fechText() {
      return dateFormat(this.chat.fecha, "dd 'de' MMMM 'a las' HH:mm 'hs'")
    },
    fecha() {
      return dateFormatDistanceToNow(this.chat.createdAt)
    },
    disabled() {
      if (!this.editable) return true
      if (this.chat.fecha) {
        return isBefore(new Date(this.chat.fecha), Date.now())
      }
      return false
    },
  },
  created() {},
  methods: {
    accept() {
      this.$emit('accept', this.chat.fecha)
    },
  },
}
</script>
