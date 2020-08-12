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
              <div class="overline mt-2">
                Trabajos realizados: {{ cantidadTrabajos }}
              </div>
              <v-layout align-center mb-1>
                <v-flex xs12 d-inline-flex>
                  <p class="headline mb-0" v-text="headline" />
                </v-flex>
                <Rating :value="perfil.puntuacion" star />
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
              <v-layout column fill-height align-start>
                <p class="mb-2" v-html="perfil.bibliography" />
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
import { mapGetters } from 'vuex'
import { Trabajo } from '~/api'
import Avatar from '~/components/Avatar'
import Rating from '~/components/Rating'
import camelCase from '~~/server/utilities/capitalizeWords'
import { EstadoTrabajo } from '~~/server/utilities/enums'

export default {
  components: { Avatar, Rating },
  props: {
    perfil: { type: Object, required: true },
  },
  data: () => ({
    cantidadTrabajos: 0,
  }),
  computed: {
    ...mapGetters(['isLoggedIn']),
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
  async mounted() {
    const query = {
      estado: EstadoTrabajo.TERMINADO,
      profesional: this.perfil._id,
    }
    const { data } = await Trabajo.count({ query })
    this.cantidadTrabajos = data.count || 0
  },
  methods: {
    contactar() {
      if (this.isLoggedIn) {
        this.$emit('contactar', this.perfil)
      } else {
        // TODO si tiene que logearse despues de login ok regresar y abrir el modal para contratar
        this.$router.replace({ name: 'login', query: { back: 'search' } })
      }
    },
  },
}
</script>
