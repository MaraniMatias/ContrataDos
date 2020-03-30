<template>
  <v-layout row pb-12 mb-2 px-2 justify-center>
    <v-flex xs12 sm12 md10 lg6 xl6 mt-4 mb-2>
      <v-layout justify-center align-start>
        <v-flex xs12 lg4>
          <v-layout column align-center>
            <Avatar size="225" :src="perfil.picture" class="ma-2" />
            <Rating :value="perfil.puntuacion" />
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

      <v-layout justify-center>
        <pre v-text="perfil" />
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
  methods: {
    changeBiblo() {
      Persona.save({
        _id: this.perfil._id,
        bibliography: '<p>I <b>think</b> this is good.</p>',
      })
    },
  },
}
</script>
