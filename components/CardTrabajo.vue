<template>
  <v-hover v-slot:default="{ hover }" open-delay="100">
    <v-card outlined :elevation="hover ? 1 : 0" class="my-4">
      <v-card-title v-if="!isEstado.PUBLICO">
        <v-layout align-center>
          <Avatar size="64" :src="cliente.picture" class="ma-2" />
          <v-layout column justify-center>
            <p class="title mb-0" v-text="clienteDiplayName" />
            <span class="body-1" v-text="cliente.email" />
          </v-layout>
        </v-layout>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-layout :column="$vuetify.breakpoint.smAndDown">
          <v-flex v-if="isEstado.PUBLICO" xs12 md4 d-inline-flex>
            <v-img
              :src="`/images/jobs/${trabajo._id}.jpeg`"
              height="225"
              width="225"
              aspect-ratio="1"
            />
          </v-flex>
          <v-flex xs12 :md8="isEstado.PUBLICO">
            <v-layout column pl-4 fill-height>
              <v-layout align-center mb-2>
                <v-flex xs12>
                  <v-layout
                    class="flex-row text-no-wrap"
                    align-center
                    fill-height
                  >
                    <p class="headline black--text text-truncate mb-0">
                      {{ trabajo.descripcion_breve }}
                    </p>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout column fill-height align-start>
                <p v-text="trabajo.descripcion" />
              </v-layout>
              <v-layout align-center mb-2>
                <v-chip
                  v-for="(h, $i) in trabajo.servicios"
                  :key="$i"
                  outlined
                  v-text="h.nombre"
                />
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-layout align-center>
          <template v-if="isEstado.PUBLICO">
            <v-flex> {{ fechText }} </v-flex>
            <v-flex v-if="!isEstado.PUBLICO" xs12 md4>
              <v-layout justify-end align-start>
                <Rating :value="trabajo.puntuacion" />
              </v-layout>
            </v-flex>
          </template>
          <template v-else>
            <v-btn color="black" text @click="verChat">Ver chat</v-btn>
            <v-layout align-center justify-end>
              <v-btn color="primary" text @click="reject">Rechazar</v-btn>
              <v-btn color="red darken-4" outlined @click="accept">
                Aceptar
              </v-btn>
            </v-layout>
          </template>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import Avatar from './Avatar'
import Rating from './Rating'

import dateFormat from '~/utils/dateFormat'
import camelCase from '~/utils/capitalizeWords'
import { EstadoTrabajo } from '~/utils/enums'

export default {
  components: { Rating, Avatar },
  props: {
    trabajo: { type: Object, required: true },
  },
  computed: {
    isEstado() {
      const rta = {}
      for (const key in EstadoTrabajo) {
        rta[key] = this.trabajo.estado === EstadoTrabajo[key]
      }
      return rta
    },
    cliente() {
      return this.trabajo.cliente
    },
    fechText() {
      const text = this.isEstado.PUBLICO ? 'Publicado ' : 'Realiazdo '
      return text + dateFormat(this.trabajo.createdAt, 'dd MM yyyy')
    },
    clienteDiplayName() {
      const nombre = this.cliente.nombre || ''
      const apellido = this.cliente.apellido || ''
      return camelCase(
        this.trabajo.razon_social
          ? this.trabajo.razon_social + `(${nombre} ${apellido})`
          : nombre + ' ' + apellido
      )
    },
  },
  methods: {
    accept() {},
    reject() {},
    verChat() {},
  },
}
</script>
