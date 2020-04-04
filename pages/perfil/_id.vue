<template>
  <v-layout row pb-12 mb-2 px-2 justify-center>
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
              @change="changeUser"
            />
            <Rating :value="perfil.puntuacion" star />
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
                <v-btn icon text @click.stop="showModalEdit = true">
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
            </v-layout>
            <v-layout align-center>
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
            <p>{{ perfil.bibliography }}</p>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout justify-center align-start mt-4>
        <v-divider />
      </v-layout>
      <PerfilTrabajosList
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
import PerfilTrabajosList from '~/components/PerfilTrabajosList'
import CardForm from '~/components/CardForm'
import ObjectId from '~/utils/formRules/objectId'
import camelCase from '~/utils/capitalizeWords'
import { Roles } from '~/utils/enums'

import { Persona, Localidad, Habilidad } from '~/api'

export default {
  // middleware: 'authenticated', es publico
  components: { Avatar, Rating, CardForm, PerfilTrabajosList },
  validate({ params }) {
    return ObjectId()(params.id) === true
  },
  async asyncData({ params, store, redirect }) {
    if (typeof params.id === 'undefined' && !store.getters.isLoggedIn) {
      redirect('/login')
    } else {
      const perfil = params.id
        ? await Persona.getById(params.id).data
        : store.state.user
      return { perfil }
    }
  },
  data: () => ({
    perfil: {},
    loading: false,
    showModalEdit: false,
    habilidades: [],
    localidades: [],
    form: {},
  }),
  computed: {
    showBtnEditable() {
      return !this.$route.params.id
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
    isAProfessional() {
      return this.form.roles?.includes(Roles.PROFECIONAL)
    },
  },
  async mounted() {
    if (this.showBtnEditable) {
      this.form = { ...this.perfil }
      this.form.roles = this.perfil.roles.map((item) => ({ ...item }))
    }

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
}
</script>
