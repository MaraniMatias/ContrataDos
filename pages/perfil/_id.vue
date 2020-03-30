<template>
  <v-layout>
    <pre v-text="perfil" />
  </v-layout>
</template>

<script>
import api from '~/api/baseApi'
const Persona = api('/Persona')

export default {
  // middleware: 'authenticated', es publico
  components: {},
  validate({ params }) {
    if (params.id) {
      return /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(params.id)
    } else {
      return true
    }
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
  methods: {},
}
</script>
