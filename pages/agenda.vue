<template>
  <v-layout column mb-2 px-2 justify-start fill-height pb-12>
    <v-row class="mx-4 fill-height">
      <v-col class="pt-0">
        <v-toolbar flat color="white">
          <v-layout align-center>
            <v-flex xs12 lg4>
              <v-btn outlined color="grey darken-2" @click="setToday">
                Hoy
              </v-btn>
              <v-menu bottom right>
                <template v-slot:activator="{ on }">
                  <v-btn outlined color="grey darken-2" v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="key in Object.keys(typeToLabel)"
                    :key="key"
                    @click="type = key"
                  >
                    <v-list-item-title v-text="typeToLabel[key]" />
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-flex>
            <v-flex xs12 lg4>
              <v-layout justify-center align-center>
                <v-btn fab text small color="grey darken-2" @click="prev">
                  <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
                <v-toolbar-title class="mx-6">{{ title }}</v-toolbar-title>
                <v-btn fab text small color="grey darken-2" @click="next">
                  <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12 lg4>
              <v-layout justify-end>
                <v-btn outlined class="mr-4">Agregar trabajo</v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-toolbar>
        <v-sheet height="100%">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            locale="es"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          />
        </v-sheet>
      </v-col>
    </v-row>
    <v-dialog v-model="selectedOpen" max-width="450">
      <ModalTrabajo v-bind="selectedEvent" @close="selectedOpen = false" />
    </v-dialog>
  </v-layout>
</template>

<script>
import { Trabajo } from '~/api'
import { EstadoTrabajoColor } from '~~/server/utilities/enums'
import dateFormat from '~/utils/dateFormat'
import camelCase from '~~/server/utilities/capitalizeWords'
import ModalTrabajo from '~/components/ModalTrabajo'

export default {
  middleware: 'authenticated',
  components: { ModalTrabajo },
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: { month: 'Mes', week: 'Semana', day: 'Día', '4day': '4 Días' },
    start: null,
    end: null,
    selectedEvent: { trabajo: {} },
    selectedElement: null,
    selectedOpen: false,
    events: [],
  }),
  computed: {
    title() {
      const { start, end } = this
      if (!start || !end) return ''

      const startMonth = camelCase(this.monthFormatter(start))
      const endMonth = camelCase(this.monthFormatter(end))
      const suffixMonth = endMonth // startMonth === endMonth ? '' : endMonth

      const startYear = start.year
      const endYear = end.year
      const suffixYear = endYear // startYear === endYear ? '' : endYear

      const startDay = start.day
      const endDay = end.day
      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
          return `${startDay} de ${startMonth} del ${startYear} - ${endDay} de ${suffixMonth} del ${suffixYear}`
        case 'day':
          return ` ${startDay} de ${startMonth} del ${startYear}`
      }
      return ''
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long',
      })
    },
    user() {
      return this.$store.state.user || {}
    },
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  methods: {
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    async updateRange({ start, end }) {
      const events = []
      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)

      const { data } = await Trabajo.get({
        query: {
          'agenda.fecha_inicio': { $gte: min, $lt: max },
          $or: [{ profesional: this.user._id }, { cliente: this.user._id }],
        },
        populate: 'servicios,localidad,cliente,profesional',
      })
      if (data) {
        data.forEach((trabajo) => {
          const len = trabajo.agenda.length - 1
          const agenda = trabajo.agenda[len]
          events.push({
            trabajo,
            name: trabajo.descripcion_breve,
            start: this.formatDate(agenda.fecha_inicio),
            end: this.formatDate(agenda.fecha_fin),
            color: EstadoTrabajoColor[trabajo.estado],
          })
        })
      }
      this.start = start
      this.end = end
      this.events = events
    },
    formatDate(date) {
      const a = new Date(date)
      return `${a.getFullYear()}-${
        a.getMonth() + 1
      }-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
    },
  },
}
</script>
