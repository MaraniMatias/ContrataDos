<template>
  <v-layout column justify-start mt-4>
    <v-layout fill-height>
      <v-flex>
        <p class="headline mb-0">Trabajos</p>
      </v-flex>
      <!--<v-btn v-if="showAddBtn" icon text @click.stop="showModal = true">
        <v-icon>add</v-icon>
      </v-btn>-->
    </v-layout>

    <v-layout v-show="loadingTrabajos" my-4>
      <v-flex xs12 class="text-center">
        <v-progress-circular
          width="2"
          indeterminate
          active
          color="grey darken-1"
        />
      </v-flex>
    </v-layout>

    <v-layout v-if="!loadingTrabajos" column>
      <v-flex xs12>
        <CardTrabajoAdd @click.stop="showModal = true" />
      </v-flex>
      <v-flex v-for="(trabajo, $i) in listTrabajos" :key="$i" xs12>
        <CardTrabajo :trabajo="trabajo" />
      </v-flex>
    </v-layout>
    <ModalPublicJob v-model="showModal" @change="getTrabajos" />
  </v-layout>
</template>

<script>
import CardTrabajoAdd from '~/components/CardTrabajoAdd'
import CardTrabajo from '~/components/CardTrabajo'
import ModalPublicJob from '~/components/ModalPublicJob'

import { TipoTrabajo } from '~~/server/utilities/enums'

import { Trabajo } from '~/api'

export default {
  components: { CardTrabajo, CardTrabajoAdd, ModalPublicJob },
  props: {
    showAddBtn: { type: Boolean, default: false },
    profilId: { type: String, required: true },
  },
  data: () => ({
    loadingTrabajos: true,
    listTrabajos: [],
    showModal: false,
  }),
  computed: {},
  mounted() {
    this.getTrabajos()
  },
  methods: {
    async getTrabajos() {
      this.loadingTrabajos = true
      // get los del perfil
      const params = {
        query: { profesional: this.profilId, tipo: TipoTrabajo.PUBLICO },
        populate: 'servicios,localidad,cliente,profesional',
        sort: '-createdAt',
      }
      const { data } = await Trabajo.get(params)
      // populate Localidation Habilidad
      this.listTrabajos = data || []
      this.loadingTrabajos = false
    },
  },
}
</script>
