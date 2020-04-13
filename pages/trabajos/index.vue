<template>
  <v-layout column mb-2 px-2 justify-start fill-height>
    <v-flex xs12>
      <v-layout align-center>
        <v-flex xs12 lg6 xl4>
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
        <v-flex xs12 lg3 xl4>
          <v-layout align-center justify-center>
            <span>Trabajos terminados: {{ score.total }} </span>
            <v-icon small class="mx-2">mdi-thumb-up</v-icon>
            {{ score.like }}
            <v-icon small class="mx-2">mdi-thumb-down</v-icon>
            {{ score.dontLike }}
          </v-layout>
        </v-flex>
        <v-flex xs12 lg3 xl4>
          <v-layout justify-end align-center>
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
                Profecional
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

      <v-flex v-show="loadingTrabajos" x12 mt-4 mb-2 class="text-center">
        <v-progress-circular
          width="2"
          indeterminate
          :active="loadingTrabajos"
          color="grey darken-1"
        />
        <p class="mt-6">Buscando...</p>
      </v-flex>

      <v-layout v-show="!loadingTrabajos" justify-center>
        <v-flex xs12 lg7 xl5>
          <v-layout align-center mt-0 column>
            <v-flex>
              <CardTrabajo
                v-for="(j, $i) in listTrabajos"
                :key="$i"
                :trabajo="j"
                @change="loadData"
              />
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-dialog :value="showTutorial" width="550">
      <v-card>
        <v-card-title>
          <p class="headline">Bienvenido</p>
        </v-card-title>
        <v-card-text>
          <p>Eres nuevo, deberías completar tus perfil.</p>
          <template v-if="isAProfessional">
            <v-divider />
            <p class="title my-2">Soy un trabajador</p>
            <p>
              Para ayudar a que otros encuentre tus trabajo y tus servicios, te
              recomendamos completar tu perfil.
            </p>
          </template>
          <a nuxt href="/perfil" class="black--text"> Ir a tú perfil </a>
          <v-layout justify-end align-center>
            <v-btn text color="primary" @click="close">
              Aceptar
            </v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import CardTrabajo from '~/components/CardTrabajo'
import { Persona, Trabajo } from '~/api'
import {
  EstadoTrabajoLabel,
  EstadoTrabajo,
  TipoTrabajo,
  EstadoTrabajoColor,
} from '~~/server/utilities/enums'

export default {
  middleware: 'authenticated',
  components: { CardTrabajo },
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
    loadingTrabajos: false,
    totalElement: 0,
    listTrabajos: [],
    // filters: [],
    viewType: 0,
    viewLike: [0, 1], // Cange de componente
    viewLikeProfesional: true,
    ready: true,
    score: {},
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
  // created() {
  //   this.$store.subscribe((mutation) => {
  //     if (this.ready && mutation.type === 'SET_USER') {
  //       this.loadData()
  //       this.ready = false
  //     }
  //   })
  // },
  mounted() {
    this.getScore()
    this.loadData()
  },
  methods: {
    ...mapMutations({ updateUser: 'SET_USER' }),
    async getScore() {
      const { data } = await Trabajo.get({
        query: {
          profesional: this.user._id,
          estado: EstadoTrabajo.TERMINADO,
        },
      })
      this.score = {
        total: data.length || 0,
        like: data.filter((jobs) => jobs.like).length || 0,
        dontLike: data.filter((jobs) => jobs.dontLike).length || 0,
      }
    },
    async close() {
      const { data } = await Persona.save({
        _id: this.user._id,
        show_tutorial: false,
      })
      if (data) this.updateUser(data)
    },
    async loadData() {
      this.loadingTrabajos = true
      const filtersLike = {
        profesional: this.viewLike.includes(1),
        cliente: this.viewLike.includes(0),
      }
      const populate = 'servicios,localidad,cliente,profesional'
      const query = {
        estado: this.filters.map((index) => EstadoTrabajoLabel[index].key),
        tipo: TipoTrabajo.PRIVADO,
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

      const { data } = await Trabajo.get({ query, populate })
      this.listTrabajos = data || []
      this.loadingTrabajos = false
    },
  },
}
</script>
