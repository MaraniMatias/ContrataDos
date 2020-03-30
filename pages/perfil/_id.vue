<template>
  <v-layout row pb-12 mb-2 px-2 justify-center>
    <v-flex xs12 sm12 md10 lg6 xl6 mt-4 mb-2>
      <v-layout justify-center align-start>
        <v-flex xs12 lg4>
          <v-layout column align-center>
            <Avatar size="225" :src="perfil.picture" class="ma-2 elevation-3" />
            <Rating :value="perfil.puntuacion" star />
          </v-layout>
        </v-flex>
        <v-flex xs12 lg8>
          <v-layout column>
            <div class="overline mt-2">
              Trabajos: {{ perfil.cantidad_trabajos || 0 }}
            </div>
            <p class="headline mb-1" v-text="headline" />
            <p>Profesiones: {{ perfil.servicios }}</p>
            <p>{{ perfil.bibliography }}</p>
            <p>Vive en: {{ perfil.localidad }}</p>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout justify-center align-start mt-4>
        <v-divider />
      </v-layout>

      <v-layout mt-4>
        <p class="headline">Trabajos</p>
        <v-flex v-show="loadingTrabajos" xs12 class="text-center my-12">
          <v-progress-circular
            width="2"
            indeterminate
            :active="loadingTrabajos"
            color="grey darken-1"
          />
        </v-flex>
      </v-layout>
      <v-layout v-if="!loadingTrabajos" justify-center fill-height mt-0>
        <v-flex xs12>
          <v-hover v-slot:default="{ hover }" open-delay="200">
            <v-card outlined :elevation="hover ? 1 : 0" @click="add()">
              <v-card-text class="text-center mt-1 mb-3">
                <v-icon size="120" color="grey lighten-1">
                  add_circle_outline
                </v-icon>
                <p class="headline mb-0">Agregar nuevo trabajo.</p>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Avatar from '~/components/Avatar'
import Rating from '~/components/Rating'
import ObjectId from '~/utils/formRules/objectId'
import camelCase from '~/utils/capitalizeWords'

import api from '~/api/baseApi'
const Persona = api('/Persona')

export default {
  // middleware: 'authenticated', es publico
  components: { Avatar, Rating },
  validate({ params }) {
    return ObjectId()(params.id) === true
  },
  async asyncData({ params, store }) {
    if (params.id) {
      const { data: perfil } = await Persona.getById(params.id)
      return { perfil }
    } else {
      return { perfil: store.state.user }
    }
  },
  data: () => ({
    perfil: {},
    loadingTrabajos: true,
  }),
  computed: {
    editable() {
      return !this.$route.params.id
    },
    headline() {
      return camelCase(
        this.perfil.razon_social
          ? this.razon_social + `(${this.perfil.display_name})`
          : this.perfil.display_name
      )
    },
  },
  mounted() {
    const self = this
    setTimeout(function () {
      self.loadingTrabajos = false
    }, 3000)
  },
  methods: {
    changeBiblo() {
      Persona.save({
        _id: this.perfil._id,
        bibliography: '<p>I <b>think</b> this is good.</p>',
      })
    },
    add() {},
  },
}
</script>
