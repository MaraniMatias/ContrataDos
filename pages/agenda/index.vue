<template>
  <v-layout column mb-2 px-2 justify-start fill-height pb-12>
    <v-row class="mx-4 fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Hoy
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer />
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
                  <v-list-item-title>{{ typeToLabel[key] }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
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
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-toolbar-title v-text="selectedEvent.name" />
                <v-spacer />
                <v-btn icon @click="selectedOpen = false">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <p>{{ selectedEvent.trabajo.descripcion }}</p>
              </v-card-text>
              <v-card-actions> </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { Trabajo } from '~/api'
import { EstadoTrabajoColor } from '~/utils/enums'
import dateFormat from '~/utils/dateFormat'

export default {
  middleware: 'authenticated',
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

      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
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
