<template>
  <v-hover v-slot:default="{ hover }">
    <v-card outlined :elevation="hover ? 1 : 0" class="my-4">
      <v-card-text>
        <v-layout :column="$vuetify.breakpoint.smAndDown">
          <v-flex xs12 lg3 d-inline-flex>
            <Avatar size="196" :src="perfil.picture" class="ma-2" />
          </v-flex>
          <v-flex xs12>
            <v-layout column pl-4 fill-height>
              <v-layout align-center mb-1>
                <v-flex xs12 d-inline-flex>
                  <p class="headline mb-0" v-text="headline" />
                </v-flex>
                <Rating :value="perfil.puntuacion" star />
                <!--
                <v-layout column align-end>
                  <Rating :value="perfil.puntuacion" star />
                  {{ perfil.cantidad_trabajos }} veces contratoados
                </v-layout>
                -->
              </v-layout>
              <v-layout align-center mb-2>
                <v-chip
                  v-for="(h, $i) in perfil.servicios"
                  :key="$i"
                  outlined
                  class="mx-2"
                  v-text="h.nombre"
                />
              </v-layout>
              <v-layout column fill-height align-start mb-1>
                {{ perfil.cantidad_trabajos }} veces contratoados
              </v-layout>
              <v-layout column fill-height align-start>
                <p class="mb-2" v-text="perfil.bibliography" />
              </v-layout>
              <v-layout align-center>
                <v-flex xs12> Recide en {{ localidadNombre }} </v-flex>
                <v-btn color="primary" text :to="perfilLink">Ver Perfil</v-btn>
                <v-btn color="red darken-4" outlined @click="contactar">
                  Contactar
                </v-btn>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
import Avatar from '~/components/Avatar'
import Rating from '~/components/Rating'
import camelCase from '~/utils/capitalizeWords'

export default {
  components: { Avatar, Rating },
  props: {
    perfil: { type: Object, required: true },
  },
  computed: {
    headline() {
      return camelCase(
        this.perfil.razon_social
          ? this.razon_social +
              `(${this.perfil.nombre} ${this.perfil.apellido})`
          : this.perfil.nombre + ' ' + this.perfil.apellido
      )
    },
    localidadNombre() {
      return camelCase(this.perfil.localidad?.nombre)
    },
    perfilLink() {
      return '/perfil/' + this.perfil._id
    },
  },
  methods: {
    contactar() {
      this.$emit('contactar', this.perfil)
    },
  },
}
</script>
