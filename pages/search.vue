<template>
  <v-layout row pb-12 mb-2 px-2 justify-center>
    <v-flex xs12 sm12 md10 lg8 xl6 mt-4 mb-2>
      <v-layout column justify-start>
        <v-flex xs12 sm12 md10 lg10 xl6 class="text-center mb-2">
          <span>Resultados de la búsqueda: {{ totalItems }}</span>
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
        <pre>{{ items }}</pre>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { Persona } from '~/api'

export default {
  components: {},
  asyncData({ query, redirect, error }) {
    // error({ message: e.message || 'Internal error', statusCode: 500 })
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
    totalItems: 0,
  }),
  async mounted() {
    const query = {}
    const servicios = this.$route?.query?.profesion
    const localidad = this.$route?.query?.localidad
    if (servicios?.length) query.servicios = servicios
    if (localidad?.length) query.localidad = localidad
    const { data, totalItems } = await Persona.get({ query })
    this.items = data
    this.totalItems = totalItems || 0

    this.loading = false
  },
  methods: {},
}
</script>
