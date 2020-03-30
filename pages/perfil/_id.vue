<template>
  <v-layout column pb-12 mb-2 px-2 align-center>
    <v-flex xs12 sm12 md10 lg10 xl6 mt-4 mb-2>
      <v-layout>
        <Avatar size="225" src="/avatars/helen.jpg" />
      </v-layout>
      <pre v-text="perfil" />
    </v-flex>
  </v-layout>
</template>

<script>
import api from '~/api/baseApi'
import Avatar from '~/components/Avatar'
const Persona = api('/Persona')

export default {
  // middleware: 'authenticated', es publico
  components: { Avatar },
  validate({ params }) {
    return params.id
      ? /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(params.id)
      : true
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
  },
  methods: {},
}
</script>
