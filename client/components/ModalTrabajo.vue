<template>
  <v-card color="grey lighten-4" min-width="350px" flat>
    <v-toolbar :color="color" dark dense flat>
      <v-flex>
        <v-toolbar-title v-text="displayTitle" />
      </v-flex>
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
            <span class="body-2" v-text="displayDuracion" />
          </p>
        </v-layout>
        <p class="mb-1 body-1">Dirrecion: {{ localidadNombre }}</p>
        <p class="mb-1">{{ trabajo.descripcion }}</p>
        <v-layout align-center>
          <v-tooltip v-if="trabajo.like || trabajo.dontLike" bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on">
                <Rating :like="trabajo.like" size="22" />
              </div>
            </template>
            Opinion del cliente
          </v-tooltip>
          <v-layout align-center justify-end>
            <v-chip outlined :color="estadosColor" small v-text="estadoLabel" />
            <v-spacer />
            <v-btn color="black" text :to="'/trabajos/' + trabajo._id">
              Ver
            </v-btn>
            <v-btn
              dark
              class="mr-0 ml-2"
              :color="color"
              @click.stop="$emit('close')"
            >
              Aceptar
            </v-btn>
          </v-layout>
        </v-layout>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import isDateAfter from 'date-fns/isAfter'
import Avatar from './Avatar'
import Rating from './Rating'

import dateFormat from '~/utils/dateFormat'
import camelCase from '~~/server/utilities/capitalizeWords'
import {
  EstadoTrabajoColor,
  EstadoTrabajo,
  TipoTrabajo,
} from '~~/server/utilities/enums'

export default {
  components: { Avatar, Rating },
  props: {
    trabajo: { type: Object, required: true },
    color: { type: String, default: 'primary' },
  },
  data: () => ({
    form: {},
  }),
  computed: {
    isPablic() {
      return this.trabajo.tipo === TipoTrabajo.PUBLICO
    },
    realEstado() {
      const hours = new Date(this.agenda.fecha_inicio)
      if (
        this.trabajo.estado === EstadoTrabajo.PENDIENTE &&
        hours &&
        isDateAfter(Date.now(), hours)
      ) {
        return EstadoTrabajo.EN_PROGRESO
      } else {
        return this.trabajo.estado
      }
    },
    estadosColor() {
      return EstadoTrabajoColor[this.realEstado]
    },
    estadoLabel() {
      return camelCase(this.realEstado)
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
      if (len >= 0) {
        return this.trabajo.agenda[len]
      } else {
        return {}
      }
    },
    displayFecha() {
      const hours = this.agenda.fecha_inicio
      // "dd/mm/yyyy HH:mm"
      return camelCase(dateFormat(hours, "EEEE dd/MM 'a las' HH:mm 'hs'"))
    },
    displayDuracion() {
      if (this.trabajo.estado === EstadoTrabajo.CONSULTA) return ''
      const fechaInicio = new Date(this.agenda.fecha_inicio).getTime()
      const fechaFin = new Date(this.agenda.fecha_fin).getTime()
      const deltaTime = fechaFin - fechaInicio
      const hours = Math.floor(deltaTime / 3600000)
      const minutes = (deltaTime - hours * 3600000) / 60000
      return `(${hours} hs ${minutes}m )`
    },
  },
  created() {},
  methods: {},
}
</script>
