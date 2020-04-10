<template>
  <div>
    <v-dialog
      v-model="optionsModal"
      max-width="350"
      persistent
      @keyup.esc="cliente"
    >
      <v-card>
        <v-card-title class="headline">Opciones</v-card-title>
        <v-card-text>
          <p>
            Para cambiar la fecha de la cita, cambie el estado a
            <a @click.stop="form.estado = 'CONSULTA'">CONSULTA</a>
            y acuerde otra fecha con el cliente.
          </p>
          <p class="mb-2 mt-2">Cambiar el estado del trabajo</p>
          <v-flex xs12>
            <v-select
              v-model.lazy="form.estado"
              class="pt-0"
              dense
              hide-details
              :items="Estados"
              item-text="label"
              item-value="key"
              label="Estado"
              outlined
              :readonly="loading"
            />
          </v-flex>
          <p class="mb-0 mt-2">Cambiar la duración del trabajo.</p>
          <v-layout>
            <FieldDate
              v-model="form.fechaFin"
              :disabled="form.estado === 'CONSULTA'"
              :min="new Date().toISOString().substr(0, 10)"
            />
            <FieldTime
              v-model="form.fechaFin"
              :disabled="form.estado === 'CONSULTA'"
            />
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancel()">Cancelar</v-btn>
          <v-btn color="primary" @click="updateTrabajo()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-hover v-slot:default="{ hover }" open-delay="100">
      <v-card outlined :elevation="hover ? 1 : 0" class="my-4">
        <v-card-title v-if="!isPablic" class="pb-0">
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
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <div v-on="on">
                            <Rating :like="trabajo.like" size="22" />
                          </div>
                        </template>
                        Opinion del cliente
                      </v-tooltip>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions v-if="!isPablic" class="px-4 pb-4">
          <v-layout align-center>
            <v-btn
              v-if="isEstado.CONSULTA"
              color="red darken-4"
              text
              @click="reject"
            >
              {{ showAsCliente ? 'Cancelar' : 'Rechazar' }}
            </v-btn>
            <v-btn
              v-else
              color="teal"
              outlined
              @click.stop="optionsModal = true"
            >
              Opciones
            </v-btn>
            <v-layout align-center justify-end>
              <v-btn color="black" outlined @click="openChat">
                {{ showChat ? 'Ocultar chat' : 'Ver chat' }}
              </v-btn>
            </v-layout>
          </v-layout>
        </v-card-actions>
        <v-expand-transition>
          <v-card-text v-show="showChat" class="pt-0">
            <div ref="chat" class="grey lighten-4 mb-3 pa-4 chat-box">
              <v-layout
                v-if="comunicaciones.length === 0"
                column
                fill-height
                align-center
                justify-center
              >
                <v-icon size="96">mail</v-icon>
                <v-progress-linear
                  v-if="loading"
                  indeterminate
                  active
                  color="black"
                />
                <p v-else class="headline">Sin mensajes.</p>
              </v-layout>
              <CardChat
                v-for="(chat, i) in comunicaciones"
                :key="i"
                :editable="isEstado.CONSULTA"
                :chat="chat"
                @accept="accept"
              />
              <div class="mb-4" />
            </div>
            <v-layout v-show="!isEstado.CANCELADO">
              <v-flex xs12 mt-2>
                <v-layout v-show="showSetHours" mx-12>
                  <FieldDate
                    v-model="form.fechaInicio"
                    :min="new Date().toISOString().substr(0, 10)"
                  />
                  <FieldTime v-model="form.fechaInicio" />
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
  </div>
</template>

<script>
import Avatar from './Avatar'
import Rating from './Rating'
import CardChat from './CardChat'
import FieldDate from './FieldDate'
import FieldTime from './FieldTime'
import { Trabajo, Comunicacion } from '~/api'

import dateFormat from '~/utils/dateFormat'
import camelCase from '~~/server/utilities/capitalizeWords'
import {
  EstadoTrabajoLabel,
  EstadoTrabajo,
  TipoTrabajo,
} from '~~/server/utilities/enums'

export default {
  components: { Rating, Avatar, CardChat, FieldDate, FieldTime },
  props: {
    trabajo: { type: Object, required: true },
  },
  data: () => ({
    showChat: false,
    loading: false,
    form: {
      estado: null,
      fechaFin: new Date(),
      detalle: '',
      fechaInicio: new Date(),
    },
    showSetHours: false,
    comunicaciones: [],
    optionsModal: false,
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
  created() {
    const self = this
    Comunicacion.getAll({
      query: { trabajo: this.trabajo._id },
      sort: 'createdAt',
    }).then(({ data }) => {
      self.comunicaciones = data || []
      self.page = self.numberOfPages
    })
    const len = this.trabajo.agenda.length
    this.form.estado = this.trabajo.estado
    if (len) {
      const agenda = this.trabajo.agenda[len - 1]
      this.form.fechaInicio = new Date(agenda.fecha_inicio)
      this.form.fechaFin = new Date(agenda.fecha_fin)
    }
  },
  methods: {
    openChat() {
      this.showChat = !this.showChat
      this.scrollChatToBottom()
    },
    scrollChatToBottom() {
      this.$nextTick(function () {
        this.$refs.chat.scrollTo(0, 300)
      })
    },
    async accept(fechaInicio) {
      const fechaFin = new Date(fechaInicio).set(fechaInicio.getHours() + 3)
      this.loading = true
      this.trabajo.estado = EstadoTrabajo.PENDIENTE
      this.trabajo.agenda = [{ fecha_inicio: fechaInicio, fecha_fin: fechaFin }]
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
        this.scrollChatToBottom()
      }
      this.loading = false
    },
    async sendHours() {
      const chat = { trabajo: this.trabajo._id }
      chat.fecha = this.form.fechaInicio
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
        this.scrollChatToBottom()
      }
      this.loading = false
    },
    async updateTrabajo() {
      this.loading = true
      this.trabajo.estado = this.form.estado
      this.trabajo.agenda.push({
        fecha_inicio: this.form.fechaInicio,
        fecha_fin: this.form.fechaFin,
      })
      const { error } = await Trabajo.save(this.trabajo)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.$notify({ type: 'success', text: 'Trabajo actualizado.' })
        this.$emit('change')
        this.cancel()
      }
      this.loading = false
    },
    cancel() {
      this.optionsModal = false
      this.form = {
        fechaFin: new Date(),
        fechaInicio: new Date(),
      }
    },
  },
}
</script>

<style scoped>
div.chat-box {
  box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.3);
  overflow-y: scroll;
  height: 250px;
}
</style>
