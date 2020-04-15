<template>
  <v-layout mb-2 px-2 justify-center>
    <v-flex xs12 sm12 md10 lg8 xl6 mt-4 mb-2>
      <v-layout justify-center align-start>
        <v-flex xs12 lg4>
          <v-layout column align-center>
            <Avatar
              size="225"
              :src="perfil.picture"
              :editable="showBtnEditable"
              elevation
              class="ma-2"
            />
            <template v-if="isAProfessional">
              <Rating v-if="showRating" :value="score.rating" star />
              <p v-else class="mb-0">Todavía no tiene suficientes trabajos</p>
            </template>
          </v-layout>
        </v-flex>
        <v-flex xs12 lg8>
          <v-layout column>
            <div class="overline mt-2">
              Trabajos: {{ perfil.cantidad_trabajos || 0 }}
            </div>
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
            <p class="my-2">Vive en: {{ localidadNombre }}</p>
            <div v-html="perfil.bibliography" />
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
      <CardForm @submit="submit">
        <template v-slot:header>Perfil</template>
        <template v-slot:default="{ rules }">
          <v-layout mt-2>
            <v-flex xs12 lg6 mx-2>
              <v-text-field
                v-model.lazy="form.nombre"
                dense
                hide-details
                label="Nombre"
                outlined
                :readonly="loading"
                :rules="[rules.required(), rules.alphaSpaces()]"
              />
            </v-flex>
            <v-flex xs12 lg6 mx-2>
              <v-text-field
                v-model.lazy="form.apellido"
                dense
                hide-details
                label="Apellido"
                outlined
                :readonly="loading"
                :rules="[rules.required(), rules.alphaSpaces()]"
              />
            </v-flex>
          </v-layout>
          <v-flex xs12 ma-2 mt-2>
            <v-select
              v-model.lazy="form.localidad"
              dense
              hide-details
              :items="localidades"
              item-text="nombre"
              item-value="_id"
              label="Localidad"
              :loading="localidades.length === 0"
              outlined
              :readonly="loading"
              :rules="[rules.required()]"
            />
          </v-flex>
          <v-layout align-center ma-2 mt-2>
            <template v-if="isAProfessional">
              <v-flex>
                <v-select
                  v-model.lazy="form.servicios"
                  dense
                  hide-details
                  :items="habilidades"
                  item-text="nombre"
                  item-value="_id"
                  label="Profesiones"
                  :loading="habilidades.length === 0"
                  multiple
                  outlined
                  :readonly="loading"
                  :rules="[rules.required()]"
                />
              </v-flex>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn color="red" icon @click="setLikeCliente" v-on="on">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </template>
                <span>Darme de baja como trabajador</span>
              </v-tooltip>
            </template>
            <v-flex v-else style="height: 48px;">
              <v-btn color="teal" text block @click="setLikeProfesional">
                Darme de alta como trabajador
              </v-btn>
            </v-flex>
          </v-layout>
          <v-flex xs12 ma-2 mt-2>
            <FieldTextArea v-model.lazy="form.bibliography" />
            <!--
            <v-textarea
              v-model.lazy="form.bibliography"
              auto-grow
              counter="500"
              dense
              label="Bibliografía"
              outlined
              :readonly="loading"
              :rules="[rules.max(500)]"
            />
            -->
          </v-flex>
        </template>
        <template v-slot:actions>
          <v-btn text :disabled="loading" @click="close">Cancelar </v-btn>
          <v-btn :disabled="loading" color="primary" type="submit">
            Guardar
          </v-btn>
        </template>
      </CardForm>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'
import Avatar from '~/components/Avatar'
import Rating from '~/components/Rating'
import FieldTextArea from '~/components/FieldTextArea'
import PerfilTrabajosList from '~/components/PerfilTrabajosList'
import CardForm from '~/components/CardForm'
import ObjectId from '~/utils/formRules/objectId'
import camelCase from '~~/server/utilities/capitalizeWords'
import { Roles, RatingTrabajo, EstadoTrabajo } from '~~/server/utilities/enums'
import { Persona, Localidad, Habilidad, Trabajo } from '~/api'

export default {
  // middleware: 'authenticated', es publico
  components: { Avatar, Rating, CardForm, PerfilTrabajosList, FieldTextArea },
  validate({ params }) {
    return ObjectId()(params.id) === true
  },
  async asyncData({ params, store, redirect }) {
    if (typeof params.id === 'undefined') {
      if (store.getters.isLoggedIn) {
        return { perfil: store.state.user }
      } else {
        redirect('/login')
      }
    } else {
      const { data } = await Persona.getById(params.id, {
        populate: 'servicios,localidad',
      })
      return { perfil: data }
    }
  },
  data: () => ({
    // perfil: {},
    loading: false,
    showModalEdit: false,
    habilidades: [],
    localidades: [],
    score: {},
    form: {}, // TODO: zona_trabajo: [], localidad: {}   razon_social: {}
    changeAvatar: false,
  }),
  computed: {
    showBtnEditable() {
      return !this.$route.params.id
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
      return this.form.roles?.includes(Roles.PROFECIONAL)
    },
    showRating() {
      return this.score.total > 10
    },
  },
  async mounted() {
    if (this.showBtnEditable) {
      this.form = { ...this.perfil }
      this.form.roles = Array.from(this.perfil.roles)
    }
    this.getScore()

    // TODO search query
    const { data: l } = await Localidad.getAll()
    this.localidades = l || []
    // TODO search query
    const { data: h } = await Habilidad.getAll()
    this.habilidades = h || []
  },
  methods: {
    ...mapMutations({ updateUser: 'SET_USER' }),
    changeUser(user) {
      this.updateUser(user)
      this.perfil = { ...user }
      this.localidad = user.localidad
    },

    setLikeProfesional() {
      const set = new Set(this.perfil.roles)
      set.add(Roles.PROFECIONAL)
      set.delete(Roles.CLIENTE)
      this.form.roles = Array.from(set)
    },
    setLikeCliente() {
      const set = new Set(this.perfil.roles)
      set.add(Roles.CLIENTE)
      set.delete(Roles.PROFECIONAL)
      this.form.roles = Array.from(set)
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

    async submit(formValid) {
      if (!formValid) return
      this.loading = true
      const { data, error } = await Persona.save(this.form)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.changeUser(data)
        this.showModalEdit = false
      }
      this.loading = false
    },
    close() {
      this.form = { ...this.perfil }
      this.showModalEdit = false
    },
  },
  head() {
    return { title: this.headline + ' - ContrataDos' }
  },
}
</script>
