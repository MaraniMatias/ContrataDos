<template>
  <v-card color="grey lighten-4" min-width="350px" flat>
    <v-toolbar :color="color" dark>
      <v-toolbar-title v-text="trabajo.descripcion_breve" />
      <v-spacer />
      <v-btn icon @click.stop="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <p>{{ trabajo.descripcion }}</p>
    </v-card-text>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
// import Avatar from './Avatar'
// import Rating from './Rating'
// import CardChat from './CardChat'
// import FieldDate from './FieldDate'
// import FieldTime from './FieldTime'
// import { Trabajo, Comunicacion } from '~/api'

import dateFormat from '~/utils/dateFormat'
import camelCase from '~~/server/utilities/capitalizeWords'
import {
  EstadoTrabajoLabel,
  EstadoTrabajo,
  TipoTrabajo,
} from '~~/server/utilities/enums'

export default {
  // components: { Rating, Avatar, CardChat, FieldDate, FieldTime },
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
    estadoLabel() {
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
    displayFecha() {
      const len = this.trabajo.agenda.length - 1
      const hours =
        len >= 0
          ? this.trabajo.agenda[len].fecha_inicio
          : this.trabajo.createdAt
      if (this.isPablic) {
        const text = this.trabajo.estado ? 'Realiazdo ' : 'Publicado '
        return text + dateFormat(hours, 'dd/MM/yyyy')
      } else {
        return camelCase(dateFormat(hours, "EEEE HH:mm 'hs'"))
      }
    },
  },
  created() {},
  methods: {},
}
</script>
