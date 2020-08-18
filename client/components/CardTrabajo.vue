<template>
  <div>
    <v-dialog
      v-model="notesModal"
      max-width="500"
      persistent
      @keyup.esc="cancel"
    >
      <v-card>
        <v-card-title class="headline">Notas privadas</v-card-title>
        <v-card-text class="pb-0 px-2">
          <FieldTextArea v-model.lazy="form.notas" heading />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancel()">Cancelar</v-btn>
          <v-btn color="primary" @click="updateTrabajo()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- add notas -->
    <v-dialog
      v-model="optionsModal"
      max-width="350"
      persistent
      @keyup.esc="cancel"
    >
      <v-card>
        <v-card-title class="headline">Opciones</v-card-title>
        <v-card-text class="pb-0">
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
    <ModalPublicJob
      v-model="showModalPublic"
      :trabajo="trabajo"
      @change="publish()"
    />
    <v-hover v-slot:default="{ hover }" open-delay="100">
      <v-card outlined :elevation="hover ? 1 : 0" class="my-4">
        <v-card-title v-if="!isPablic" class="pb-0">
          <v-layout wrap>
            <v-layout align-center>
              <Avatar size="64" :src="displayPicture" class="ma-2" />
              <v-flex>
                <v-layout column>
                  <a class="title mb-0" @click="goToPerfi">{{ displayName }}</a>
                  <span class="body-1" v-text="displayEmail" />
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout column justify-start align-end fill-height>
              <v-chip
                outlined
                :color="estadosColor"
                small
                v-text="estadoLabel"
              />
              <p
                v-show="isEstado.PENDIENTE || isEstado.EN_PROGRESO"
                class="mb-0 mt-2 headline font-weight-black"
              >
                {{ displayFecha }}
              </p>
            </v-layout>
          </v-layout>
        </v-card-title>
        <v-card-text :class="{ 'pb-0': !isPablic }">
          <v-layout :column="$vuetify.breakpoint.smAndDown">
            <v-flex
              v-if="isPablic"
              class="grey lighten-3 d-inline-flex xs12 md4"
            >
              <div
                v-if="avatarError"
                style="height: 225px; display: flex; flex: auto;"
              >
                <v-icon size="128" style="margin: auto;">wallpaper</v-icon>
              </div>
              <v-img
                v-else
                :src="base64img"
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
                        {{ trabajo.descripcion_breve | camelCase }}
                      </p>
                    </v-layout>
                  </v-flex>
                  <v-tooltip v-if="isMyPublicJob" bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        text
                        @click="$emit('edit', trabajo)"
                        v-on="on"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    Editar trabajo
                  </v-tooltip>
                </v-layout>
                <v-layout column fill-height align-start>
                  <p v-text="trabajo.descripcion" />
                </v-layout>
                <v-layout align-center>
                  <v-flex>
                    <v-chip
                      v-for="(h, $i) in trabajo.servicios"
                      :key="$i"
                      outlined
                      v-text="h.nombre"
                    />
                  </v-flex>
                  <v-flex v-if="isEstado.TERMINADO && trabajo.cliente" xs12 md4>
                    <v-layout justify-end align-start>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <div v-on="on">
                            <Rating
                              :value="trabajo.rating"
                              size="22"
                              :editable="canRating"
                              @change="saveRating"
                            />
                          </div>
                        </template>
                        Opinion del cliente
                      </v-tooltip>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-layout v-if="isEstado.TERMINADO" align-center>
                  <v-flex> {{ displayFecha }} </v-flex>
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
            <template
              v-if="
                !showAsCliente && (isEstado.PENDIENTE || isEstado.EN_PROGRESO)
              "
            >
              <v-btn
                v-if="mdAndDown"
                color="teal"
                icon
                @click.stop="optionsModal = true"
              >
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn
                v-else
                color="teal"
                outlined
                @click.stop="optionsModal = true"
              >
                Opciones
              </v-btn>
            </template>
            <v-btn v-if="mdAndDown" color="teal" icon @click="markAsDone">
              <v-icon>check_circle_outline</v-icon>
            </v-btn>
            <v-btn
              v-else
              v-show="!showAsCliente && isEstado.EN_PROGRESO"
              color="deep-purple"
              class="mx-2"
              text
              @click="markAsDone"
            >
              Trabajo terminado
            </v-btn>
            <v-btn
              v-show="!showAsCliente && isEstado.TERMINADO"
              class="mx-2"
              text
              @click.stop="showModalPublic = true"
            >
              Publicar
            </v-btn>
            <v-layout align-center justify-end>
              <v-btn
                v-if="!showAsCliente"
                color="primary"
                class="mx-2"
                text
                @click="addNotes"
              >
                Notas
              </v-btn>

              <v-badge color="error" overlap :value="newComments">
                <v-btn color="black" outlined @click="openChat">
                  {{ showChat ? 'Ocultar chat' : 'Ver chat' }}
                </v-btn>
              </v-badge>
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
                :editable="
                  isEstado.CONSULTA && idLastChatsWithDate === chat._id
                "
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
                    hide-details
                    :min="new Date().toISOString().substr(0, 10)"
                  />
                  <FieldTime v-model="form.fechaInicio" hide-details />
                  <v-btn
                    class="ml-2"
                    color="primary"
                    outlined
                    @click="sendHours"
                  >
                    Proponer fecha
                  </v-btn>
                </v-layout>
                <v-text-field
                  v-show="!showSetHours"
                  v-model.lazy="form.detalle"
                  dense
                  hide-details
                  outlined
                  :readonly="loading"
                  append-icon="send"
                  autocomplete="off"
                  @click:append="sendComent"
                  @keypress.enter="sendComent"
                />
              </v-flex>
              <v-layout column align-center mx-2 mt-2 ml-2>
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
                      <v-icon v-else>insert_invitation</v-icon>
                    </v-btn>
                  </template>
                  <span v-if="showSetHours">Volver al teclado</span>
                  <span v-else>Proponer una fecha para la cita</span>
                </v-tooltip>
              </v-layout>
            </v-layout>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import addHours from 'date-fns/addHours'
import isDateAfter from 'date-fns/isAfter'
import Avatar from './Avatar'
import Rating from './Rating'
import CardChat from './CardChat'
import ModalPublicJob from './ModalPublicJob'
import FieldDate from './FieldDate'
import FieldTime from './FieldTime'
import FieldTextArea from './FieldTextArea'
import { Trabajo, Comunicacion } from '~/api'

import dateFormat from '~/utils/dateFormat'
import camelCase from '~~/server/utilities/capitalizeWords'
import {
  EstadoTrabajoColor,
  EstadoTrabajoLabel,
  EstadoTrabajo,
  TipoTrabajo,
} from '~~/server/utilities/enums'

export default {
  components: {
    Rating,
    Avatar,
    CardChat,
    FieldDate,
    FieldTime,
    FieldTextArea,
    ModalPublicJob,
  },
  filters: {
    camelCase,
  },
  props: {
    trabajo: { type: Object, required: true },
  },
  data: () => ({
    showChat: false,
    loading: false,
    avatarError: true,
    base64img: null,
    showModalPublic: false,
    newComments: false,
    form: {
      estado: null,
      fechaFin: null,
      notas: '',
      detalle: '',
      fechaInicio: null,
    },
    showSetHours: false,
    comunicaciones: [],
    optionsModal: false,
    notesModal: false,
    interval: null,
  }),
  computed: {
    lgAndUp() {
      return this.$vuetify.breakpoint.lgAndUp
    },
    mdAndDown() {
      return this.$vuetify.breakpoint.mdAndDown
    },
    Estados: () => EstadoTrabajoLabel,
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
    user() {
      return this.$store.state.user
    },
    estadosColor() {
      return EstadoTrabajoColor[this.realEstado]
    },
    estadoLabel() {
      return camelCase(this.realEstado)
    },
    isEstado() {
      const rta = {}
      for (const key in EstadoTrabajo) {
        rta[key] = this.realEstado === EstadoTrabajo[key]
      }
      return rta
    },
    isPablic() {
      return this.trabajo.tipo === TipoTrabajo.PUBLICO
    },
    cliente() {
      return this.trabajo.cliente
    },
    isMyPublicJob() {
      return this.isPablic && this.profesional._id === this.user._id
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
    agenda() {
      const len = this.trabajo.agenda.length - 1
      if (len >= 0) {
        return this.trabajo.agenda[len] || {}
      } else {
        return {}
      }
    },
    displayFecha() {
      const hours = this.agenda.fecha_inicio || this.trabajo.createdAt
      if (this.isPablic || this.isEstado.TERMINADO) {
        const text = this.trabajo.estado ? 'Realizado ' : 'Publicado '
        return text + dateFormat(hours, 'dd/MM/yyyy')
      } else {
        return camelCase(dateFormat(hours, "EEEE HH:mm 'hs'"))
      }
    },
    canRating() {
      return this.$store.state.user._id === this.trabajo?.cliente?._id
    },
    idLastChatsWithDate() {
      const list = this.comunicaciones?.filter((chat) => !!chat.fecha) || []
      const len = list.length - 1
      return len >= 0 ? list[len]?._id : null
    },
  },
  async created() {
    const self = this
    this.cancel()
    if (this.trabajo.tipo !== TipoTrabajo.PUBLICO) {
      await self.getChat()
      this.newComments = false
      this.interval = setInterval(function () {
        try {
          self.getChat()
        } catch (err) {
          clearInterval(this.interval)
        }
      }, 10000)
    }
  },
  mounted() {
    if (this.trabajo.tipo === TipoTrabajo.PUBLICO) {
      this.loadImg()
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    goToPerfi() {
      const key = this.showAsCliente ? 'profesional' : 'cliente'
      const _id = this.trabajo[key]._id
      this.$router.replace('/perfil/' + _id)
    },
    openChat() {
      this.showChat = !this.showChat
      this.scrollChatToBottom()
      this.newComments = false
    },
    scrollChatToBottom() {
      this.$nextTick(function () {
        this.$refs.chat.scrollTo(0, this.$refs.chat.clientWidth)
      })
    },
    async getChat() {
      const oldLength = this.comunicaciones.length
      const { data } = await Comunicacion.getAll({
        query: { trabajo: this.trabajo._id },
        sort: 'createdAt',
      })
      if (this.newComments === false) {
        this.newComments = oldLength < data.length
      }
      this.comunicaciones = data || []
      this.page = self.numberOfPages
      // this.scrollChatToBottom() si esta mirando más arriva se va a mover
    },
    async loadImg() {
      try {
        const { data: imgFile } = await this.$http.get(
          `/images/jobs/${this.trabajo._id}.jpeg`,
          {
            responseType: 'arraybuffer',
          }
        )
        this.base64img =
          'data:image/jpeg;base64,' +
          Buffer.from(imgFile, 'binary').toString('base64')
        this.avatarError = false
      } catch (err) {
        this.avatarError = true
      }
    },
    async accept(fecha) {
      const fechaInicio = new Date(fecha)
      const fechaFin = addHours(fechaInicio, 3)
      this.loading = true
      this.trabajo.estado = EstadoTrabajo.PENDIENTE
      const agenda = { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
      if (typeof this.trabajo.agenda === 'undefined') {
        this.trabajo.agenda = []
      }
      this.trabajo.agenda.push(agenda)

      const { error, data } = await Trabajo.save(this.trabajo)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.trabajo.estado = data.estado
      }
      this.loading = false
    },
    async reject() {
      this.loading = true
      this.trabajo.estado = EstadoTrabajo.CANCELADO
      const { error, data } = await Trabajo.save(this.trabajo)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.trabajo.estado = data.estado
      }
      this.loading = false
    },
    async sendComent() {
      if (this.form.detalle === '') {
        return
      }
      const chat = { trabajo: this.trabajo._id }
      chat.detalle = this.form.detalle
      if (this.showAsCliente) {
        chat.to = this.trabajo.profesional
        chat.from = this.trabajo.cliente
      } else {
        chat.to = this.trabajo.cliente
        chat.from = this.trabajo.profesional
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
        chat.from = this.trabajo.cliente
      } else {
        chat.to = this.trabajo.cliente
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
      this.trabajo.notas = this.form.notas
      this.trabajo.agenda.push({
        fecha_inicio: this.form.fechaInicio,
        fecha_fin: this.form.fechaFin,
      })
      const { error, data } = await Trabajo.save(this.trabajo)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.trabajo.estado = data.estado
        this.$notify({ type: 'success', text: 'Trabajo actualizado.' })
        this.$emit('change')
        this.cancel()
      }
      this.loading = false
    },
    cancel() {
      this.optionsModal = false
      this.notesModal = false
      this.trabajo.oldEstado = this.trabajo.estado
      this.form = {
        // trabajo
        estado: this.trabajo.estado,
        notas: this.trabajo.notas,
        // Chat
        fechaInicio: this.agenda.fecha_inicio
          ? new Date(this.agenda.fecha_inicio)
          : new Date(),
        fechaFin: this.agenda.fecha_fin
          ? new Date(this.agenda.fecha_fin)
          : new Date(),
        detalle: '',
      }
    },
    addNotes() {
      this.notesModal = true
    },
    async markAsDone() {
      this.loading = true
      const trabajo = { ...this.trabajo }
      trabajo.oldEstado = this.trabajo.estado
      trabajo.estado = EstadoTrabajo.TERMINADO
      const { error } = await Trabajo.save(trabajo)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.$notify({ type: 'success', text: 'Trabajo actualizado.' })
        this.$emit('change')
        this.cancel()
      }
      this.loading = false
    },
    async saveRating(value) {
      this.loading = true
      this.trabajo.rating = value
      const { error } = await Trabajo.save(this.trabajo)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.$notify({ type: 'success', text: 'Gracias por puntuar.' })
        this.$emit('change')
        this.cancel()
      }
      this.loading = false
    },
    publish() {
      this.$emit('change')
      this.loadImg()
    },
  },
}
</script>

<style scoped>
div.chat-box {
  box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.3);
  overflow-y: scroll;
  height: 260px;
}
</style>
