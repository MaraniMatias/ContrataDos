<template>
  <v-layout column justify-center pb-12 mb-2 px-2>
    <v-flex v-if="user.show_tutorial" xs12 sm12 md10 lg10 xl6 mt-4 mb-2>
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
      <v-flex xs12 sm12 md10 lg10 xl6 class="text-center mb-2">
        <span>Resultados de la búsqueda: {{ totalElement }}</span>
      </v-flex>

      <v-flex v-show="loadingApunte" xs12 md10 class="text-center my-12">
        <v-progress-circular
          width="2"
          indeterminate
          :active="loadingApunte"
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
    totalElement: 0,
  }),
  computed: {
    user() {
      return this.$store.state.user || {}
    },
  },
  methods: {},
}
</script>
