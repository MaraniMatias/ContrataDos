<template>
  <v-hover v-slot:default="{ hover }">
    <v-card outlined :elevation="hover ? 1 : 0" class="my-4">
      <v-card-text>
        <v-layout align-center mb-2 mr-4>
          <Avatar :size="avatarSize" :src="perfil.picture" />
          <v-flex d-flex>
            <v-layout column fill-height>
              <div class="overline mt-2 ml-2">
                Trabajos realizados: {{ score.total }}
              </div>
              <v-layout align-center mb-1 ml-2>
                <v-flex d-inline-flex>
                  <p class="headline mb-0" v-text="headline" />
                </v-flex>
                <template v-if="lgAndUp">
                  <Rating v-if="showRating" :value="score.rating" star />
                  <p v-else class="mb-0 text-center">Sin clasificar.</p>
                </template>
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
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout column>
          <v-layout column fill-height align-start>
            <p class="mb-0" v-html="perfil.bibliography" />
          </v-layout>
          <v-layout wrap align-center justify-end>
            <v-flex v-show="localidadNombre" class="mb-2">
              Recide en {{ localidadNombre }}
            </v-flex>
            <v-flex d-flex>
              <v-layout justify-end>
                <template v-if="isLoggedIn">
                  <v-btn
                    v-if="mdAndDown"
                    color="sencudary"
                    icon
                    text
                    :loading="saveMark"
                    @click="marker()"
                  >
                    <v-icon v-if="isInMarks">bookmark</v-icon>
                    <v-icon v-else>bookmark_border</v-icon>
                  </v-btn>
                  <v-tooltip v-else bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="sencudary"
                        outlined
                        :loading="saveMark"
                        @click="marker()"
                        v-on="on"
                      >
                        <v-icon v-if="isInMarks" left>bookmark</v-icon>
                        <v-icon v-else left>bookmark_border</v-icon>
                        Marcadores
                      </v-btn>
                    </template>
                    {{ isInMarks ? 'Sacar de ' : 'Agregar a ' }} marcadores
                  </v-tooltip>
                </template>
                <v-btn color="primary" text :to="perfilLink" class="mx-2">
                  Ver Perfil
                </v-btn>
                <v-btn color="red darken-4" outlined @click="contactar">
                  Contactar
                </v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { Persona, Trabajo } from '~/api'
import Avatar from '~/components/Avatar'
import Rating from '~/components/Rating'
import camelCase from '~~/server/utilities/capitalizeWords'
import { EstadoTrabajo, RatingTrabajo } from '~~/server/utilities/enums'

export default {
  components: { Avatar, Rating },
  props: {
    perfil: { type: Object, required: true },
  },
  data: () => ({
    saveMark: false,
    score: { total: 0 },
  }),
  computed: {
    ...mapGetters(['isLoggedIn']),
    lgAndUp() {
      return this.$vuetify.breakpoint.lgAndUp
    },
    mdAndDown() {
      return this.$vuetify.breakpoint.mdAndDown
    },
    smAndDown() {
      return this.$vuetify.breakpoint.smAndDown
    },
    avatarSize() {
      return this.mdAndDown ? '56' : '128'
    },
    user() {
      return this.$store.state.user
    },
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
    isInMarks() {
      return this.user
        ? this.user.marks_professional.includes(this.perfil._id)
        : false
    },
    showRating() {
      return this.score.total >= 10
    },
  },
  mounted() {
    this.getScore()
  },
  methods: {
    ...mapMutations({ updateUser: 'SET_USER' }),
    contactar() {
      if (this.isLoggedIn) {
        this.$emit('contactar', this.perfil)
      } else {
        // TODO si tiene que logearse despues de login ok regresar y abrir el modal para contratar
        this.$router.replace({ name: 'login', query: { back: 'search' } })
      }
    },
    async marker() {
      this.saveMark = true
      const user = { ...this.user }
      user.marks_professional = Array.from(this.user.marks_professional)
      const index = user.marks_professional.findIndex(
        (_id) => _id === this.perfil._id
      )
      if (index === -1) {
        user.marks_professional.push(this.perfil._id)
      } else {
        user.marks_professional.splice(index, 1)
      }
      const { error } = await Persona.save(user)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.updateUser(user)
      }
      this.saveMark = false
    },
    async getScore() {
      const { data } = await Trabajo.get({
        query: {
          profesional: this.perfil._id,
          estado: EstadoTrabajo.TERMINADO,
        },
      })
      let like = 0
      let dontLike = 0
      data.forEach((job) => {
        if (job.rating === RatingTrabajo.LIKE) {
          like++
        }
        if (job.rating === RatingTrabajo.DONT_LIKE) {
          dontLike++
        }
      })
      const rating = (like * (like + dontLike)) / 100
      this.score = { total: data.length || 0, like, dontLike, rating }
    },
  },
}
</script>
