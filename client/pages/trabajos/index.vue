<template>
  <v-layout column mb-5>
    <div class="hidden-md-and-down" style="margin-top: 60px"></div>
    <div class="hidden-md-and-up" style="margin-top: 40px"></div>
    <v-layout wrap class="mb-5">
      <v-flex xs12 lg5 xl4>
        <v-layout justify-start align-center>
          <v-chip-group v-model="filters" multiple @change="loadData">
            <v-chip
              v-for="(f, i) in Estados"
              :key="i"
              filter
              :outlined="!filters.includes(i)"
              class="white--text"
              :color="f.color"
            >
              {{ f.label }}
            </v-chip>
          </v-chip-group>
        </v-layout>
      </v-flex>
      <v-flex xs12 lg3 xl4 mt-3 class="hidden-md-and-down">
        <v-layout v-show="!loadingTrabajos" align-center justify-center>
          <span>Trabajos: {{ score.total }}</span>
          <span class="ml-6">Valorados: </span>
          <v-icon small class="mx-2">mdi-thumb-up</v-icon>
          {{ score.like }}
          <v-icon small class="mx-2">mdi-thumb-down</v-icon>
          {{ score.dontLike }}
        </v-layout>
      </v-flex>
      <v-flex xs12 lg4 xl4>
        <v-layout
          :justify-end="$vuetify.breakpoint.lgAndUp"
          align-center
          :justify-center="$vuetify.breakpoint.mdAndDown"
        >
          <v-chip-group
            v-if="isAProfessional"
            v-model="viewLike"
            mandatory
            multiple
            @change="loadData"
          >
            <v-chip outlined>
              <v-icon left>account_circle</v-icon>
              Cliente
            </v-chip>
            <v-chip outlined>
              <v-icon left>build</v-icon>
              Profesional
            </v-chip>
          </v-chip-group>
          <!--
            <v-chip-group v-model="viewType">
              <v-chip outlined>
                <v-icon left>view_stream</v-icon>
                Lista
              </v-chip>
              <v-chip outlined>
                <v-icon left>view_column</v-icon>
                Columnas
              </v-chip>
            </v-chip-group>
            -->
        </v-layout>
      </v-flex>
    </v-layout>

    <v-flex
      v-show="loadingTrabajos"
      x12
      mt-4
      mb-2
      class="text-center"
      fill-height
    >
      <v-progress-circular
        width="2"
        indeterminate
        :active="loadingTrabajos"
        color="grey darken-1"
      />
      <p class="mt-6">Buscando...</p>
    </v-flex>

    <v-layout v-show="!loadingTrabajos" justify-center fill-height mt-0>
      <v-flex xs12 lg7 xl5>
        <CardTrabajo
          v-for="j in listTrabajos"
          :key="j._id"
          :trabajo="j"
          @edit="editJob(j)"
          @change="loadData"
        />
      </v-flex>
    </v-layout>

    <v-dialog :value="showTutorial" width="400" persistent>
      <v-card>
        <v-card-title>
          <p class="headline">Eres nuevo en ContrataDos</p>
        </v-card-title>
        <v-card-text>
          <v-layout column>
            <v-btn rounded color="teal" outlined large @click="setAsCliente">
              Seguir como cliente
            </v-btn>
            <v-divider class="my-4" />
            <v-btn
              rounded
              color="primary"
              outlined
              large
              @click="showModalEdit = true"
            >
              Soy un profesional
            </v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showModalEdit" width="550">
      <ModalProfesional
        load-like-professional
        @submit="submit"
        @close="close"
      />
    </v-dialog>
    <ModalPublicJob
      v-model="showModal"
      :trabajo="selectedJob"
      @change="loadData"
    />
  </v-layout>
</template>

<router>
  meta:
    name: "Trabajos"
</router>

<script>
import { isMobile } from 'mobile-device-detect'
import { mapActions, mapMutations, mapGetters } from 'vuex'

import ModalPublicJob from '~/components/ModalPublicJob'
import ModalProfesional from '~/components/ModalProfesional'
import CardTrabajo from '~/components/CardTrabajo'
import { Persona, Trabajo } from '~/api'
import {
  EstadoTrabajoLabel,
  EstadoTrabajo,
  RatingTrabajo,
  EstadoTrabajoColor,
} from '~~/server/utilities/enums'

export default {
  middleware: 'authenticated',
  components: { CardTrabajo, ModalProfesional, ModalPublicJob },
  asyncData() {
    const filters = []
    EstadoTrabajoLabel.forEach(({ key }, index) => {
      if (![EstadoTrabajo.TERMINADO, EstadoTrabajo.CANCELADO].includes(key)) {
        filters.push(index)
      }
    })
    return { filters }
  },
  data: () => ({
    showModalEdit: false,
    loadingTrabajos: false,
    totalElement: 0,
    listTrabajos: [],
    // filters: [],
    viewType: 0,
    viewLike: [0, 1], // Cange de componente
    viewLikeProfesional: true,
    ready: true,
    score: {},
    interval: null,
    selectedJob: null,
    showModal: false,
  }),
  computed: {
    ...mapGetters(['isAProfessional']),
    Estados: () =>
      EstadoTrabajoLabel.map((ele) => ({
        ...ele,
        color: EstadoTrabajoColor[ele.key],
      })),
    user() {
      return this.$store.state.user || {}
    },
    showTutorial() {
      return this.user?.['show_tutorial'] ?? false
    },
  },
  layout() {
    return isMobile ? 'mobile' : 'default'
  },
  async mounted() {
    const self = this
    this.loadingTrabajos = true
    self.getScore()
    await self.loadData()
    this.loadingTrabajos = false
    this.interval = setInterval(function () {
      try {
        self.getScore()
        self.loadData()
      } catch (err) {
        clearInterval(this.interval)
      }
    }, 50000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    ...mapMutations({ updateUser: 'SET_USER' }),
    ...mapActions(['getMe']),
    async getScore() {
      const query = { estado: EstadoTrabajo.TERMINADO }
      if (this.isAProfessional) {
        query.profesional = this.user._id
      } else {
        query.cliente = this.user._id
      }

      const { data } = await Trabajo.get({ query })
      let like = 0
      let dontLike = 0
      data.forEach((job) => {
        if (job.rating === RatingTrabajo.LIKE) {
          like++
        }
        if (job.rating === RatingTrabajo.DONT_LIKE) {
          dontLike++
        }
      })
      this.score = { total: data.length || 0, like, dontLike }
    },
    async setAsCliente() {
      const { data } = await Persona.save({
        _id: this.user._id,
        show_tutorial: false,
      })
      if (data) this.updateUser(data)
    },
    async loadData() {
      const filtersLike = {
        profesional: this.viewLike.includes(1),
        cliente: this.viewLike.includes(0),
      }
      const populate = 'servicios,localidad,cliente,profesional'
      const query = {
        estado: this.filters.map((index) => EstadoTrabajoLabel[index].key),
      }

      if (this.isAProfessional) {
        if (filtersLike.profesional && filtersLike.cliente) {
          query.$or = [
            { profesional: this.user._id },
            { cliente: this.user._id },
          ]
        } else {
          if (filtersLike.cliente) query.cliente = this.user._id
          if (filtersLike.profesional) query.profesional = this.user._id
        }
      } else {
        query.cliente = this.user._id
      }

      const params = { query, populate, sort: '-createdAt' }
      const { data } = await Trabajo.get(params)
      this.listTrabajos = data || []
    },
    async submit() {
      await this.getMe()
      this.showModalEdit = false
    },
    close() {
      this.showModalEdit = false
    },
    editJob(trabajo) {
      this.selectedJob = { ...trabajo }
      this.showModal = true
    },
  },
}
</script>
