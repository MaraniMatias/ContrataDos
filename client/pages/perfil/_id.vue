<template>
  <v-layout column mb-2>
    <div class="hidden-md-and-down" style="margin-top: 60px;"></div>
    <div class="hidden-md-and-up" style="margin-top: 40px;"></div>
    <v-layout mb-2 px-2 justify-center>
      <v-flex xs12 sm12 md10 lg8 xl6 mt-4 mb-2>
        <v-layout wrap justify-center align-start>
          <v-flex xs12 lg4>
            <v-layout column align-center>
              <Avatar
                size="225"
                :src="perfil.picture"
                :editable="showBtnEditable"
                elevation
                class="ma-2"
                @change="changeUser"
              />
              <template v-if="isAProfessional && lgAndUp">
                <Rating v-if="showRating" :value="score.rating" star />
                <p v-else class="mb-0 text-center">
                  Trabajos realizados insuficientes para obtener una
                  clasificación.
                </p>
              </template>
            </v-layout>
          </v-flex>
          <v-flex xs12 lg8>
            <div class="overline mt-2">{{ cantidadTrabajosLabel }}</div>
            <v-layout align-center mb-1>
              <v-flex>
                <p class="headline mb-0" v-text="headline" />
              </v-flex>
              <template v-if="showBtnEditable">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon text @click="enableEmailNotify" v-on="on">
                      <v-icon v-if="form.notification">
                        notifications_active
                      </v-icon>
                      <v-icon v-else>notifications_off</v-icon>
                    </v-btn>
                  </template>
                  <span>
                    {{ form.notification ? 'Deshabilitar ' : 'Habilitar ' }}
                    notificaciones de email
                  </span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      text
                      @click.stop="showModalEdit = true"
                      v-on="on"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  Editar perfil
                </v-tooltip>
              </template>
            </v-layout>
            <v-layout v-if="isAProfessional" align-center>
              <!-- <p class="mb-0">Profesiones:</p> -->
              <v-chip
                v-for="(h, $i) in perfil.servicios"
                :key="$i"
                outlined
                class="mx-2"
                v-text="h.nombre"
              />
            </v-layout>
            <p v-if="showBtnEditable" class="my-1">{{ perfil.email }}</p>
            <div style="min-height: 85px;" v-html="perfil.bibliography" />
            <v-layout align-center justify-end mt-2>
              <v-flex v-show="localidadNombre" xs12>
                Recide en {{ localidadNombre }}
              </v-flex>
              <v-flex d-flex>
                <v-layout v-if="isLoggedIn" justify-end>
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
                  <v-btn
                    color="red darken-4"
                    class="ml-2"
                    outlined
                    @click="contratar"
                  >
                    Contactar
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout justify-center align-start mt-4>
          <v-divider />
        </v-layout>
        <PerfilTrabajosList
          v-if="isAProfessional"
          :show-add-btn="showBtnEditable"
          :profil-id="perfil._id"
        />
      </v-flex>
      <v-dialog v-model="showModalEdit" width="550">
        <ModalProfesional
          v-if="showModalEdit"
          @submit="submit"
          @close="close"
        />
      </v-dialog>
      <ModalContratar v-model="showModalContrart" :perfil="perfil" />
    </v-layout>
  </v-layout>
</template>

<script>
import { isMobile } from 'mobile-device-detect'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import Avatar from '~/components/Avatar'
import Rating from '~/components/Rating'
import PerfilTrabajosList from '~/components/PerfilTrabajosList'
import ModalContratar from '~/components/ModalContratar'
import ModalProfesional from '~/components/ModalProfesional'
import ObjectId from '~/utils/formRules/objectId'
import camelCase from '~~/server/utilities/capitalizeWords'
import { Roles, RatingTrabajo, EstadoTrabajo } from '~~/server/utilities/enums'
import { Persona, Localidad, Habilidad, Trabajo } from '~/api'

export default {
  middleware: 'if_token_get_user',
  components: {
    PerfilTrabajosList,
    ModalProfesional,
    ModalContratar,
    Avatar,
    Rating,
  },
  validate({ params }) {
    return ObjectId()(params.id) === true
  },
  filters: {
    camelCase(value) {
      return camelCase(value)
    },
  },
  async asyncData({ params, store, redirect, $vuetify }) {
    const lgAndUp = $vuetify.breakpoint.lgAndUp
    const mdAndDown = $vuetify.breakpoint.mdAndDown
    if (typeof params.id === 'undefined') {
      if (store.getters.isLoggedIn) {
        return {
          perfil: store.state.user,
          showBtnEditable: true,
          lgAndUp,
          mdAndDown,
        }
      } else {
        redirect('/login')
      }
    } else {
      const { data } = await Persona.getById(params.id, {
        populate: 'servicios,localidad',
      })
      if (data) {
        return { perfil: data, showBtnEditable: false, lgAndUp, mdAndDown }
      } else {
        redirect('/trabajos')
      }
    }
  },
  data: () => ({
    // perfil: {},
    loading: false,
    showModalContrart: false,
    showModalEdit: false,
    habilidades: [],
    localidades: [],
    score: {},
    form: {}, // localidad: {}   razon_social: {}
    changeAvatar: false,
    cantidadTrabajos: 0,
    saveMark: false,
  }),
  layout() {
    return isMobile ? 'mobile' : 'default'
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    user() {
      return this.$store.state.user
    },
    headline() {
      const nombre = this.perfil.nombre || ''
      const apellido = this.perfil.apellido || ''
      return camelCase(
        this.perfil.razon_social
          ? this.razon_social + `(${nombre} ${apellido})`
          : nombre + ' ' + apellido
      )
    },
    localidadNombre() {
      return camelCase(this.perfil.localidad?.nombre)
    },
    isAProfessional() {
      if (this.showBtnEditable) {
        return this.form.roles?.includes(Roles.PROFESIONAL)
      } else {
        return this.perfil.roles?.includes(Roles.PROFESIONAL)
      }
    },
    showRating() {
      return this.score.total > 10
    },
    cantidadTrabajosLabel() {
      const text = this.isAProfessional ? 'realizados' : 'contratados'
      return `Trabajos ${text}: ` + this.cantidadTrabajos
    },
    isInMarks() {
      return this.user?.marks_professional
        ? this.user.marks_professional.includes(this.perfil._id)
        : false
    },
  },
  async mounted() {
    if (this.showBtnEditable) {
      this.loadForm(this.perfil)
    }
    this.getScore()

    // TODO search query
    const { data: l } = await Localidad.getAll()
    this.localidades = l || []
    // TODO search query
    const { data: h } = await Habilidad.getAll()
    this.habilidades = h || []

    const query = { estado: EstadoTrabajo.TERMINADO }
    if (this.isAProfessional) {
      query.profesional = this.perfil._id
    } else {
      query.cliente = this.perfil._id
    }
    const { data } = await Trabajo.count({ query })
    this.cantidadTrabajos = data.count || 0
  },
  methods: {
    ...mapMutations({ updateUser: 'SET_USER' }),
    ...mapActions(['getMe']),
    loadForm(user) {
      this.form = { ...user }
      this.form.roles = Array.from(user.roles)
    },

    changeUser(user) {
      this.updateUser(user)
      this.loadForm(user)
      this.perfil = { ...user }
      this.localidad = user.localidad
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

    async enableEmailNotify() {
      this.loading = true
      this.form.notification = !this.form.notification
      const { data, error } = await Persona.save(this.form)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.changeUser(data)
      }
      this.loading = false
    },

    async submit() {
      const { data } = await this.getMe()
      this.changeUser(data)
      this.showModalEdit = false
    },
    close() {
      this.form = { ...this.perfil }
      this.showModalEdit = false
    },
    contratar() {
      if (this.isLoggedIn) {
        this.showModalContrart = true
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
  },
  head() {
    return { title: this.headline + ' - ContrataDos' }
  },
}
</script>
