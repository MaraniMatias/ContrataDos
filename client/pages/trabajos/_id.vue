<template>
  <v-layout column mb-2 px-2>
    <!--
    <v-flex v-show="loading" x12 mt-4 mb-2 class="text-center">
      <v-progress-circular
        width="2"
        indeterminate
        :active="loading"
        color="grey darken-1"
      />
      <p class="mt-6">Buscando...</p>
    </v-flex>
    -->
    <v-layout v-if="trabajo" justify-center fill-height mt-0>
      <v-flex xs12 lg7 xl5>
        <CardTrabajo :trabajo="trabajo" @change="loadData" />
      </v-flex>
    </v-layout>
    <v-row v-else align="center" justify="center" class="mb-12">
      <div class="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          fill="#DBE1EC"
          viewBox="0 0 48 48"
        >
          <path
            d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
          ></path>
        </svg>
        <h1>Trabajo no encontrado</h1>
        <p class="description mt-4">
          <a @click="$router.back()">Volver</a>
        </p>
      </div>
    </v-row>
  </v-layout>
</template>

<script>
import { Trabajo } from '~/api'

import CardTrabajo from '~/components/CardTrabajo'
import ObjectId from '~/utils/formRules/objectId'

export default {
  middleware: 'authenticated',
  components: { CardTrabajo },
  validate({ params }) {
    return ObjectId()(params.id) === true
  },
  async asyncData({ params }) {
    if (params.id) {
      const { data } = await Trabajo.getById(params.id, {
        populate: 'servicios,localidad,cliente,profesional',
      })
      return { trabajo: data }
    } else {
      return { trabajo: null }
    }
  },
  data: () => ({
    // trabajo: {},
    ready: true,
  }),
  computed: {
    user() {
      return this.$store.state.user || {}
    },
  },
  mounted() {},
  methods: {},
}
</script>
