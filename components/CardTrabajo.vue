<template>
  <v-hover v-slot:default="{ hover }" open-delay="100">
    <v-card outlined :elevation="hover ? 1 : 0" class="my-4">
      <v-card-title v-if="!isPablic">
        <v-layout align-center>
          <Avatar size="64" :src="displayPicture" class="ma-2" />
          <v-layout column justify-center>
            <p class="title mb-0" v-text="displayName" />
            <span class="body-1" v-text="displayEmail" />
          </v-layout>
        </v-layout>
        <v-layout column justify-center align-end>
          <p class="mb-0 display-1 font-weight-black">{{ displayFecha }}</p>
          <p class="mb-0 body-1">Estado: {{ estadoLabel }}</p>
        </v-layout>
      </v-card-title>
      <v-card-text :class="{ 'pb-0': !isPablic }">
        <v-layout :column="$vuetify.breakpoint.smAndDown">
          <v-flex v-if="isPablic" xs12 md4 d-inline-flex>
            <v-img
              :src="`/images/jobs/${trabajo._id}.jpeg`"
              height="225"
              width="225"
              aspect-ratio="1"
            />
          </v-flex>
          <v-flex xs12 :md8="isPablic">
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
              <v-layout v-if="isPablic" align-center>
                <v-flex> {{ displayFecha }} </v-flex>
                <v-flex xs12 md4>
                  <v-layout justify-end align-start>
                    <Rating :value="trabajo.puntuacion" />
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions v-if="!isPablic" class="px-4 pb-4">
        <v-layout align-center>
          <v-btn color="red darken-4" text @click="reject">
            {{ showAsCliente ? 'Cancelar' : 'Rechazar' }}
          </v-btn>
          <v-layout align-center justify-end>
            <v-btn color="black" text @click.stop="showChat = !showChat">
              {{ showChat ? 'Ocultar chat' : 'Ver chat' }}
            </v-btn>
          </v-layout>
        </v-layout>
      </v-card-actions>
      <v-expand-transition>
        <v-card-text v-show="showChat" class="pt-0">
          <v-divider />
          <v-data-iterator
            :items="comunicaciones"
            :page="page"
            item-key="_id"
            :loading="loading"
            :items-per-page="7"
            hide-default-footer
          >
            <template v-slot:no-data>
              <v-layout column mt-4 class="grey lighten-4" pa-4>
                <p class="mb-0 title text-center">Chat vació</p>
              </v-layout>
            </template>
            <template v-slot:loading>
              <v-progress-circular indeterminate active />
            </template>
            <template v-slot:default="{ items }">
              <v-layout>
                <v-flex xs12 md11>
                  <v-layout column mt-4 class="grey lighten-4" pa-4 pt-1>
                    <CardChat
                      v-for="(chat, i) in items"
                      :key="i"
                      :editable="isEstado.CONSULTA"
                      :chat="chat"
                      @accept="accept"
                    />
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout column align-center justify-center fill-height>
                    <v-btn
                      icon
                      text
                      :disabled="canNextChatPage"
                      @click="formerPage"
                    >
                      <v-icon>mdi-chevron-up</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      text
                      :disabled="canFormerChatPage"
                      @click="nextPage"
                    >
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </template>
          </v-data-iterator>
          <v-layout v-show="!isEstado.CANCELADO">
            <v-flex xs12 mt-2>
              <v-layout v-show="showSetHours" mx-12>
                <FieldDate
                  v-model="form.fecha"
                  :min="new Date().toISOString().substr(0, 10)"
                />
                <FieldTime v-model="form.fecha" />
              </v-layout>
              <v-textarea
                v-show="!showSetHours"
                v-model.lazy="form.detalle"
                auto-grow
                counter="60"
                dense
                outlined
                :readonly="loading"
              />
            </v-flex>
            <v-layout column align-center mx-2 mt-4 ml-4>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :disabled="!isEstado.CONSULTA"
                    color="teal"
                    icon
                    v-on="on"
                    @click.stop="showSetHours = !showSetHours"
                  >
                    <v-icon v-if="showSetHours">keyboard</v-icon>
                    <v-icon v-else> insert_invitation</v-icon>
                  </v-btn>
                </template>
                <span v-if="showSetHours">Volver al treclado</span>
                <span v-else>Proponer una fecha para la cita</span>
              </v-tooltip>
              <v-btn
                v-if="showSetHours && isEstado.CONSULTA"
                color="primary"
                outlined
                class="mt-11"
                @click="sendHours"
              >
                Proponer fecha
              </v-btn>
              <v-btn
                v-else
                class="mt-11"
                color="primary"
                outlined
                @click="sendComent"
              >
                Enviar
              </v-btn>
            </v-layout>
          </v-layout>
        </v-card-text>
      </v-expand-transition>
    </v-card>
  </v-hover>
</template>

<script>
import Avatar from './Avatar'
import Rating from './Rating'
import CardChat from './CardChat'
import FieldDate from './FieldDate'
import FieldTime from './FieldTime'
import { Trabajo, Comunicacion } from '~/api'

import dateFormat from '~/utils/dateFormat'
import camelCase from '~/utils/capitalizeWords'
import { EstadoTrabajo, TipoTrabajo } from '~/utils/enums'

export default {
  components: { Rating, Avatar, CardChat, FieldDate, FieldTime },
  props: {
    trabajo: { type: Object, required: true },
  },
  data: () => ({
    showChat: false,
    page: 1,
    loading: false,
    form: {
      detalle: '',
      fecha: new Date(),
    },
    showSetHours: false,
    comunicaciones: [],
  }),
  computed: {
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
        len > 0 ? this.trabajo.agenda[len].fecha_inicio : this.trabajo.createdAt
      if (this.isPablic) {
        const text = this.trabajo.estado ? 'Realiazdo ' : 'Publicado '
        return text + dateFormat(hours, 'dd/MM/yyyy')
      } else {
        return camelCase(dateFormat(hours, "EEEE HH:mm 'hs'"))
      }
    },
    numberOfPages() {
      return Math.ceil(this.comunicaciones.length / 7)
    },
    canNextChatPage() {
      return this.page < this.numberOfPages
    },
    canFormerChatPage() {
      return this.page > 1
    },
  },
  created() {
    const self = this
    Comunicacion.getAll({
      query: { trabajo: this.trabajo._id },
      sort: 'createdAt',
    }).then(({ data }) => {
      self.comunicaciones = data
      self.page = self.numberOfPages
    })
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    async accept(fechaInicio) {
      this.loading = true
      this.trabajo.estado = EstadoTrabajo.PENDIENTE
      this.trabajo.agenda = [{ fecha_inicio: fechaInicio }]
      const { error } = await Trabajo.save(this.trabajo)
      if (error) {
        this.$notify({ type: 'error', text: error })
      }
      this.loading = false
    },
    async reject() {
      this.loading = true
      this.trabajo.estado = EstadoTrabajo.CANCELADO
      const { error } = await Trabajo.save(this.trabajo)
      if (error) {
        this.$notify({ type: 'error', text: error })
      }
      this.loading = false
    },
    async sendComent() {
      const chat = { trabajo: this.trabajo._id }
      chat.detalle = this.form.detalle
      if (this.showAsCliente) {
        chat.to = this.profesional
        chat.from = this.$store.state.user
      } else {
        chat.to = this.$store.state.user
        chat.from = this.profesional
      }
      this.loading = true
      const { data, error } = await Comunicacion.save(chat)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.form.detalle = ''
        this.comunicaciones.push(data)
      }
      this.loading = false
    },
    async sendHours() {
      const chat = { trabajo: this.trabajo._id }
      chat.fecha = this.form.fecha
      if (this.showAsCliente) {
        chat.to = this.trabajo.profesional
        chat.from = this.$store.state.user
      } else {
        chat.to = this.$store.state.user
        chat.from = this.trabajo.profesional
      }
      this.loading = true
      const { data, error } = await Comunicacion.save(chat)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.form.fecha = new Date()
        this.comunicaciones.push(data)
        this.showSetHours = false
      }
      this.loading = false
    },
  },
}
</script>
