<template>
  <v-card color="grey lighten-4" min-width="350px" flat>
    <v-toolbar :color="color" dark dense flat>
      <v-toolbar-title v-text="displayTitle" />
      <v-spacer />
      {{ displayEstado }}
      <v-btn icon small class="mr-0 ml-2" @click.stop="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="px-3 pb-3 pt-1">
      <v-layout column>
        <v-layout align-center mb-2>
          <Avatar size="42" :src="displayPicture" />
          <v-layout column justify-center ml-2>
            <p class="title mb-0" v-text="displayName" />
            <span class="body-1" v-text="displayEmail" />
          </v-layout>
        </v-layout>
        <v-layout column justify-center>
          <p class="mb-0 headline font-weight-black">
            {{ displayFecha }}
            <spam class="body-2"> ({{ displayDuracion }}) </spam>
          </p>
        </v-layout>
        <p class="mb-0 body-1">Dirrecion: {{ localidadNombre }}</p>

        <p>{{ trabajo.descripcion }}</p>
      </v-layout>
    </v-card-text>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
import Avatar from './Avatar'
// import Rating from './Rating'
// import CardChat from './CardChat'
// import FieldDate from './FieldDate'
// import FieldTime from './FieldTime'
// import { Trabajo, Comunicacion } from '~/api'

import dateFormat from '~/utils/dateFormat'
import camelCase from '~~/server/utilities/capitalizeWords'
// import dateFormatDistance from '~/utils/dateFormatDistance'
import {
  EstadoTrabajoLabel,
  EstadoTrabajo,
  TipoTrabajo,
} from '~~/server/utilities/enums'

export default {
  // components: { Rating, Avatar, CardChat, FieldDate, FieldTime },
  components: { Avatar },
  props: {
    trabajo: { type: Object, required: true },
    color: { type: String, default: 'primary' },
  },
  data: () => ({
    form: {},
  }),
  computed: {
    Estados: () => EstadoTrabajoLabel,
    isEstado() {
      const rta = {}
      for (const key in EstadoTrabajo) {
        rta[key] = this.trabajo.estado === EstadoTrabajo[key]
      }
      return rta
    },
    isPablic() {
      return this.trabajo.tipo === TipoTrabajo.PUBLICO
    },
    displayEstado() {
      return camelCase(this.trabajo.estado)
    },
    cliente() {
      return this.trabajo.cliente
    },
    profesional() {
      return this.trabajo.profesional
    },
    showAsCliente() {
      return this.cliente._id === this.$store.state.user._id
    },
    displayName() {
      const key = this.showAsCliente ? 'profesional' : 'cliente'
      const nombre = this[key].nombre || ''
      const apellido = this[key].apellido || ''
      return camelCase(
        this[key].razon_social
          ? this[key].razon_social + `(${nombre} ${apellido})`
          : nombre + ' ' + apellido
      )
    },
    displayPicture() {
      const key = this.showAsCliente ? 'profesional' : 'cliente'
      return this.trabajo[key].picture
    },
    displayEmail() {
      const key = this.showAsCliente ? 'profesional' : 'cliente'
      return this.trabajo[key].email
    },
    displayTitle() {
      return camelCase(this.trabajo.descripcion_breve)
    },
    localidadNombre() {
      return camelCase(this.trabajo.localidad?.nombre)
    },
    agenda() {
      const len = this.trabajo.agenda.length - 1
      if (len === 0) return {}
      return this.trabajo.agenda[len]
    },
    displayFecha() {
      const hours = this.agenda.fecha_inicio
      // "dd/mm/yyyy HH:mm"
      return camelCase(dateFormat(hours, "EEEE dd/MM 'a las' HH:mm 'hs'"))
    },
    displayDuracion() {
      // return dateFormatDistance(this.agenda.fecha_fin, this.agenda.fecha_inicio)
      const fechaInicio = new Date(this.agenda.fecha_inicio).getTime()
      const fechaFin = new Date(this.agenda.fecha_fin).getTime()
      const deltaTime = fechaFin - fechaInicio
      const hours = Math.floor(deltaTime / 3600000)
      const minutes = (deltaTime - hours * 3600000) / 60000
      return hours + 'hs ' + minutes + 'm'
    },
  },
  created() {},
  methods: {},
}
</script>
