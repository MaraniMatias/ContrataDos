<template>
  <v-layout row pb-12 mb-2 px-2 justify-center>
    <v-flex xs12 sm12 md10 lg8 xl6 mt-4 mb-2>
      <v-layout column justify-start>
        <v-flex xs12 sm12 md10 lg10 xl6 mt-1 mb-2 class="text-center">
          <v-chip
            v-for="(item, key) in filters"
            :key="key"
            class="mx-2"
            v-text="item.nombre"
          />
        </v-flex>
        <v-flex xs12 class="text-center" mt-1 mb-2>
          <p class="mb-0">Resultados de la búsqueda: {{ totalItems }}</p>
        </v-flex>
        <v-layout v-show="loading" justify-center mt-3>
          <v-flex xs12 class="text-center">
            <v-progress-circular
              width="2"
              indeterminate
              active
              color="grey darken-1"
            />
          </v-flex>
        </v-layout>
        <!--
        <v-layout column justify-start>
          <v-flex xs12 class="text-center mb-2">
            <pre>{{ items }}</pre>
          </v-flex>
        </v-layout>
        -->
      </v-layout>
      <v-layout v-if="!loading" column>
        <v-flex v-for="(perfil, $i) in items" :key="$i" xs12>
          <CardPerfil :perfil="perfil" />
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { Persona, Habilidad, Localidad } from '~/api'
import CardPerfil from '~/components/CardPerfil'

export default {
  components: { CardPerfil },
  asyncData({ query, redirect, error }) {
    // error({ message: 'Internal error', statusCode: 500 })
    if (
      typeof query.profesion === 'undefined' &&
      typeof query.localidad === 'undefined'
    ) {
      redirect('/')
    }
  },
  data: () => ({
    loading: true,
    items: [],
    filters: [],
    totalItems: 0,
  }),
  mounted() {
    this.loadItems()
    this.loadFilters()
  },
  methods: {
    async loadItems() {
      const query = {}
      const servicios = this.$route?.query?.profesion
      const localidad = this.$route?.query?.localidad
      const userLoginId = this.$store.state.userId

      if (servicios?.length) query.servicios = servicios
      if (localidad?.length) query.localidad = localidad
      if (userLoginId) query._id = { $nin: userLoginId }

      const { data, totalItems } = await Persona.get({
        query,
        populate: JSON.stringify([
          { path: 'localidad' },
          { path: 'servicios' },
        ]),
      })
      this.items = data
      this.totalItems = totalItems || 0

      this.loading = false
    },
    async loadFilters() {
      const query = this.$route?.query || {}
      if (query.localidad?.length) {
        const { data: localidades } = await Localidad.getAll({
          query: { _id: { $in: query.localidad } },
        })
        this.filters = this.filters.concat(localidades || [])
      }
      if (query.profesion?.length) {
        const { data: servicios } = await Habilidad.getAll({
          query: { _id: { $in: query.profesion } },
        })
        this.filters = this.filters.concat(servicios || [])
      }
    },
  },
}
</script>
