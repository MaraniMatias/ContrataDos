<template>
  <v-layout column justify-start mt-4>
    <v-layout fill-height>
      <v-flex>
        <p class="headline mb-0">Trabajos</p>
      </v-flex>
      <v-btn v-if="showAddBtn" icon text @click="add">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>

    <v-layout v-show="loadingTrabajos" my-4>
      <v-flex xs12 class="text-center">
        <v-progress-circular
          width="2"
          indeterminate
          :active="loadingTrabajos"
          color="grey darken-1"
        />
      </v-flex>
    </v-layout>

    <v-layout v-if="!loadingTrabajos" column>
      <v-flex v-if="listTrabajos.length === 0" xs12>
        <CardTrabajoAdd @click="add" />
      </v-flex>
      <v-flex xs12>
        <CardTrabajo publish />
      </v-flex>
      <v-flex xs12>
        <CardTrabajo />
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import CardTrabajoAdd from '~/components/CardTrabajoAdd'
import CardTrabajo from '~/components/CardTrabajo'

export default {
  components: { CardTrabajo, CardTrabajoAdd },
  props: {
    showAddBtn: { type: Boolean, default: false },
    profilId: { type: String, required: true },
  },
  data: () => ({
    loadingTrabajos: true,
    listTrabajos: [],
  }),
  computed: {},
  mounted() {
    const self = this
    setTimeout(function () {
      self.loadingTrabajos = false
    }, 3000)
  },
  methods: {
    add() {
      console.log('Add')
    },
  },
}
</script>
