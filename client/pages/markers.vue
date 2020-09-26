<template>
  <v-layout column mb-2>
    <div class="hidden-md-and-down" style="margin-top: 60px"></div>
    <div class="hidden-md-and-up" style="margin-top: 40px"></div>
    <v-layout row pb-12 mb-2 px-2 justify-center>
      <v-flex xs12 sm12 md10 lg8 xl6 mt-4 mb-2>
        <v-layout column justify-start>
          <v-layout v-show="loading" justify-center mt-3>
            <v-flex xs12 class="text-center">
              <v-progress-circular
                width="2"
                indeterminate
                active
                color="grey darken-1"
              />
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout v-if="!loading" column>
          <v-flex v-for="(perfil, $i) in items" :key="$i" xs12>
            <CardPerfil :perfil="perfil" />
          </v-flex>
          <v-flex v-if="totalItems == 0" class="text-center" xs12 mt-4>
            <p class="title">Sin profesional guardados.</p>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<router>
  meta:
    name: "Marcadores"
</router>

<script>
import { isMobile } from 'mobile-device-detect'

import { Persona } from '~/api'
import CardPerfil from '~/components/CardPerfil'

export default {
  middleware: 'authenticated',
  components: { CardPerfil },
  data: () => ({
    loading: true,
    items: [],
    totalItems: 0,
  }),
  layout() {
    return isMobile ? 'mobile' : 'default'
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  mounted() {
    this.loadItems()
  },
  methods: {
    async loadItems() {
      this.loading = true
      const { data } = await Persona.getById(this.user._id, {
        populate: JSON.stringify([
          { path: 'marks_professional' },
          // { path: 'marks_professional', populate: 'localidad' },
          { path: 'marks_professional', populate: 'servicios' },
        ]),
      })
      if (data) {
        this.items = data.marks_professional
        this.totalItems = data.marks_professional.length
      } else {
        this.items = []
        this.totalItems = 0
      }
      this.loading = false
    },
  },
}
</script>
