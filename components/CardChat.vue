<template>
  <v-layout align-center :justify-end="isToProfesional">
    <p
      v-if="isToProfesional"
      class="caption grey--text mb-0 mr-2"
      v-text="fecha"
    />
    <v-card :class="{ 'green lighten-5': isToProfesional }">
      <v-card-text class="py-1">
        <v-layout v-if="chat.fecha" column>
          <p class="mb-1">
            ¿Te parece una cita para el
            <span class="body-1 font-weight-black">{{ fechText }}</span> ?
          </p>
          <v-btn v-if="editable" color="teal" text class="mb-1" @click="accept">
            Concretar la cita
          </v-btn>
        </v-layout>
        <p v-else class="mb-0" v-text="chat.detalle" />
      </v-card-text>
    </v-card>
    <p
      v-if="!isToProfesional"
      class="caption grey--text mb-0 ml-2"
      v-text="fecha"
    />
  </v-layout>
</template>

<script>
import dateFormat from '~/utils/dateFormat'

export default {
  components: {},
  props: {
    chat: { type: Object, required: true },
    editable: { type: Boolean, default: true },
  },
  data: () => ({}),
  computed: {
    isToProfesional() {
      return this.chat.to === 'profesional' // this.$store.state.user._id
    },
    fechText() {
      return dateFormat(this.chat.fecha, "dd 'de' MMMM 'a las' HH:mm 'hs'")
    },
    fecha() {
      return dateFormat(new Date(), 'dd/mm/yyyy HH:mm')
    },
  },
  methods: {
    accept() {
      this.$emit('accept', this.chat.fecha)
    },
  },
}
</script>
