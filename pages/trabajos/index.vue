<template>
  <v-layout column pb-12 mb-2 px-2 align-center>
    <v-flex v-if="showTutorial" xs12 sm12 md10 lg10 xl6 mt-4 mb-2>
      <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">
              Bienvenido
            </v-list-item-title>
            <v-list-item-subtitle>
              <p>
                Eres nuevo, deberías completar tus perfil y contarnos de tus
                trabajos terminados.
              </p>
              <p>
                Para ayudar a que otros encuentre tus trabajo y tus servicios,
                te recomendamos completar tu perfil.
              </p>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-actions>
          <v-spacer />
          <v-btn text to="/perfil" color="primary">Ir a tú perfil</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <template v-else>
      <v-layout fill-height>
        <v-flex>
          <p class="headline mb-0">Trabajos Pendientes</p>
        </v-flex>
        <v-btn v-if="showAddBtn" icon text @click.stop="showModal = true">
          <v-icon>add</v-icon>
        </v-btn>
      </v-layout>

      <v-flex v-show="loadingTrabajos" xs12 md10 class="text-center my-12">
        <v-progress-circular
          width="2"
          indeterminate
          :active="loadingTrabajos"
          color="grey darken-1"
        />
        <p class="mt-6">Buscando...</p>
      </v-flex>

      <v-layout justify-center fill-height mt-0>
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
    </template>
  </v-layout>
</template>

<script>
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
      return this.user?.['show_tutorial'] || false
    },
  },
  methods: {},
}
</script>
