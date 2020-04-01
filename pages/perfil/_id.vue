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
                v-text="h"
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
          <v-layout align-center>
            <v-flex xs12 lg6 ma-2>
              <v-select
                v-model.lazy="form.servicios"
                dense
                hide-details
                :items="habilidades"
                label="Profesiones"
                multiple
                outlined
                return-object
                :readonly="loading"
                :rules="[rules.required()]"
              />
            </v-flex>
            <v-flex xs12 lg6 ma-2>
              <v-select
                v-model.lazy="form.localidad"
                dense
                hide-details
                :items="localidades"
                item-text="nombre"
                item-value="_id"
                label="Localidad"
                outlined
                return-object
                :readonly="loading"
                :rules="[rules.required()]"
              />
            </v-flex>
          </v-layout>
          <v-flex xs12 ma-2>
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
        <!--
        <template v-slot:message>
          <error :text="error" />
        </template>
        -->
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

import api from '~/api/baseApi'
const Persona = api('/Persona')
const Localidad = api('/Localidad')

export default {
  // middleware: 'authenticated', es publico
  components: { Avatar, Rating, CardForm, PerfilTrabajosList },
  validate({ params }) {
    return ObjectId()(params.id) === true
  },
  async asyncData({ params, store, redirect }) {
    if (params.id) {
      const { data: perfil } = await Persona.getById(params.id)
      return { perfil }
    } else if (store.getters.isLoggedIn) {
      return { perfil: store.state.user }
    } else {
      redirect('/login')
    }
  },
  data: () => ({
    perfil: {},
    loading: false,
    showModalEdit: false,
    habilidades: ['Ingeniero', 'Plomero'], // TODO lerr de db
    localidades: [],
    form: {},
  }),
  computed: {
    showBtnEditable() {
      return !this.$route.params.id
    },
    localidadNombre() {
      return this.perfil.localidad?.nombre
    },
    headline() {
      return camelCase(
        this.perfil.razon_social
          ? this.razon_social +
              `(${this.perfil.nombre} ${this.perfil.apellido})`
          : this.perfil.nombre + ' ' + this.perfil.apellido
      )
    },
  },
  async mounted() {
    if (this.showBtnEditable) {
      this.form = { ...this.perfil }
    }

    // TODO search query
    const { data } = await Localidad.getAll()
    this.localidades = data || []
  },
  methods: {
    ...mapMutations({ updateUser: 'SET_USER' }),
    changeUser(user) {
      this.updateUser(user)
    },
    async submit(formValid) {
      if (formValid) return
      this.loading = true
      const { data, error } = await Persona.save(this.form)
      if (error) {
        this.$notify({ color: 'error', text: error })
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
