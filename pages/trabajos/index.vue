<template>
  <v-layout pb-12 mb-2 px-2 fill-height>
    <v-layout column>
      <v-flex xs12 mb-2>
        <v-layout align-center>
          <v-flex xs9>
            <v-chip-group v-model="filters" multiple @change="loadData">
              <v-chip v-for="(f, i) in Estados" :key="i" filter outlined>
                {{ f.label }}
              </v-chip>
            </v-chip-group>
          </v-flex>
          <v-flex xs3>
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
      </v-flex>

      <v-flex xs12 sm12 md10 lg8 xl6 mt-4 mb-2>
        <v-flex v-show="loadingTrabajos" x12 mt-4 mb-2 class="text-center">
          <v-progress-circular
            width="2"
            indeterminate
            :active="loadingTrabajos"
            color="grey darken-1"
          />
          <p class="mt-6">Buscando...</p>
        </v-flex>

        <v-layout v-show="!loadingTrabajos" justify-center mt-0>
          <v-flex xs12 md11 lg10 xl6>
            <pre>{{ listTrabajos }}</pre>
            <!--
        <Documento
          :doc="doc"
          :key="i"
          v-for="(doc, i) in items"
          @loadingPreview="loadingPreview"
          @snackbar="showMsg"
        />
        <infinite-loading
          spinner="spiral"
          @infinite="infiniteHandler"
        >
          <template v-slot:no-more>Eso es todo.</template>
          <template v-slot:no-results>
            <span>Eso es todo.</span>
          </template>
        </infinite-loading>
        -->
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-dialog :value="showTutorial" width="550">
      <v-card>
        <v-card-title>
          <p class="headline">Bienvenido</p>
        </v-card-title>
        <v-card-text>
          <p>
            Eres nuevo, deberías completar tus perfil y contarnos de tus
            trabajos terminados.
          </p>
          <v-divider />
          <p class="title my-2">Soy un trabajador</p>
          <p>
            Para ayudar a que otros encuentre tus trabajo y tus servicios, te
            recomendamos completar tu perfil.
            <a nuxt href="/perfil" class="black--text"> Ir a tú perfil </a>
          </p>
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

import { Persona, Trabajo } from '~/api'
import { EstadoTrabajoLabel, EstadoTrabajo } from '~/utils/enums'

export default {
  middleware: 'authenticated',
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
  }),
  computed: {
    ...mapGetters(['isAProfessional']),
    Estados: () => EstadoTrabajoLabel,
    user() {
      return this.$store.state.user || {}
    },
    showTutorial() {
      return this.user?.['show_tutorial'] ?? false
    },
    filtersLike() {
      return {
        profesional: this.viewLike.includes(1),
        cliente: this.viewLike.includes(0),
      }
    },
  },
  mounted() {
    this.viewLike = this.isAProfessional ? [0, 1] : [0]
    this.loadData()
  },
  methods: {
    ...mapMutations({ updateUser: 'SET_USER' }),
    async close() {
      const { data } = await Persona.save({
        _id: this.user._id,
        show_tutorial: false,
      })
      if (data) this.updateUser(data)
    },
    async loadData() {
      this.loadingTrabajos = true
      // get los del perfil

      const params = {
        query: {
          estado: this.filters.map((index) => EstadoTrabajoLabel[index].key),
        },
        populate: 'servicios,localidad,cliente,profesional',
      }
      if (this.filtersLike.profesional && this.filtersLike.cliente) {
        params.query.$or = [
          { profesional: this.user._id },
          { cliente: this.user._id },
        ]
      } else {
        if (this.filtersLike.cliente) params.query.cliente = this.user._id
        if (this.filtersLike.profesional)
          params.query.profesional = this.user._id
      }

      const { data } = await Trabajo.get(params)
      // populate Localidation Habilidad
      this.listTrabajos = data || []
      this.loadingTrabajos = false
    },
  },
}
</script>
