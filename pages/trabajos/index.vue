<template>
  <v-layout pb-12 mb-2 px-2 fill-height>
    <v-layout column>
      <v-flex xs12 sm12 md10 lg8 xl6 mt-4 mb-2>
        <p class="headline mb-0">Trabajos Pendientes</p>

        <v-flex v-show="loadingTrabajos" x12 mt-4 mb-2 class="text-center">
          <v-progress-circular
            width="2"
            indeterminate
            :active="loadingTrabajos"
            color="grey darken-1"
          />
          <p class="mt-6">Buscando...</p>
        </v-flex>

        <v-layout justify-center mt-0>
          <v-flex xs12 md11 lg10 xl6>
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

    <v-dialog v-model="showTutorial" width="550">
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
import { mapMutations } from 'vuex'

import { Persona } from '~/api'

export default {
  middleware: 'authenticated',
  data: () => ({
    loadingTrabajos: false,
    totalElement: 0,
  }),
  computed: {
    user() {
      return this.$store.state.user || {}
    },
    showTutorial() {
      return this.user?.['show_tutorial'] ?? true
    },
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
  },
}
</script>
