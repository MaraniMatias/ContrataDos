<template>
  <v-layout row pb-12 mb-2 px-2 justify-center>
    <v-flex xs12 sm12 md10 lg8 xl6 mt-4 mb-2>
      <v-layout justify-center align-start>
        <v-flex xs12 lg4>
          <v-layout column align-center>
            <Avatar
              size="225"
              :src="perfil.picture"
              class="ma-2 elevation-3"
              :editable="enableEdit"
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
                <p v-if="!enableEdit" class="headline mb-0" v-text="headline" />
                <v-layout v-else mt-2>
                  <v-flex xs12 lg6 mx-2>
                    <v-text-field
                      v-model.lazy="form.nombre"
                      dense
                      label="Nombre"
                      outlined
                      hide-details
                    />
                  </v-flex>
                  <v-flex xs12 lg6 mx-2>
                    <v-text-field
                      v-model.lazy="form.apellido"
                      label="Apellido"
                      dense
                      outlined
                      hide-details
                    />
                  </v-flex>
                </v-layout>
              </v-flex>
              <template v-if="showBtnEditable">
                <v-btn v-show="enableEdit" text color="primary" @click="save()">
                  Guardar
                </v-btn>
                <v-btn
                  v-show="!enableEdit"
                  icon
                  text
                  @click.stop="enableEdit = true"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
            </v-layout>
            <div v-show="!enableEdit">
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
              <p class="my-2">Vive en: {{ perfil.localidad }}</p>
              <p>{{ perfil.bibliography }}</p>
            </div>
            <v-layout v-show="enableEdit" column>
              <v-layout align-center>
                <v-flex xs12 lg6 ma-2>
                  <v-select
                    v-model.lazy="form.servicios"
                    dense
                    hide-details
                    :items="habilidades"
                    item-text="_descripcion"
                    label="Profesiones"
                    multiple
                    outlined
                    return-object
                  />
                </v-flex>
                <v-flex xs12 lg6 ma-2>
                  <v-select
                    v-model.lazy="form.localidad"
                    dense
                    hide-details
                    :items="localidades"
                    item-value="_id"
                    item-text="nombre"
                    label="Localidad"
                    outlined
                    return-object
                  />
                </v-flex>
              </v-layout>
              <v-flex xs12 lg6 ma-2>
                <v-textarea
                  v-model.lazy="form.bibliography"
                  auto-grow
                  counter="500"
                  dense
                  hide-details
                  label="Bibliografía"
                  outlined
                />
              </v-flex>
            </v-layout>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout justify-center align-start mt-4>
        <v-divider />
      </v-layout>

      <v-layout mt-4>
        <p class="headline">Trabajos</p>
        <v-flex v-show="loadingTrabajos" xs12 class="text-center my-12">
          <v-progress-circular
            width="2"
            indeterminate
            :active="loadingTrabajos"
            color="grey darken-1"
          />
        </v-flex>
      </v-layout>
      <v-layout v-if="!loadingTrabajos" justify-center fill-height mt-0>
        <v-flex xs12>
          <v-hover v-slot:default="{ hover }" open-delay="200">
            <v-card
              outlined
              :elevation="hover ? 1 : 0"
              class="my-4"
              @click="add()"
            >
              <v-card-text class="text-center py-4">
                <v-icon size="120" color="grey lighten-1">
                  add_circle_outline
                </v-icon>
                <p class="headline mb-1">Agregar nuevo trabajo.</p>
              </v-card-text>
            </v-card>
          </v-hover>
          <!-- -->
          <v-hover v-slot:default="{ hover }" open-delay="200">
            <v-card
              outlined
              :elevation="hover ? 1 : 0"
              class="my-4"
              @click="add()"
            >
              <v-card-text>
                <!-- -->
                <v-layout :column="$vuetify.breakpoint.smAndDown">
                  <v-flex xs12 md4 d-inline-flex>
                    <v-img
                      src="/avatars/molly.png"
                      height="225"
                      width="225"
                      aspect-ratio="1"
                    />
                  </v-flex>
                  <v-flex xs12 md8>
                    <v-layout
                      column
                      :pt-2="$vuetify.breakpoint.smAndDown"
                      :pl-4="$vuetify.breakpoint.mdAndUp"
                    >
                      <v-layout align-center fill-height mb-2>
                        <v-flex xs12 md8>
                          <v-layout
                            class="flex-row text-no-wrap"
                            align-center
                            fill-height
                          >
                            <p class="headline black--text text-truncate mb-0">
                              Reparación de cañería.
                            </p>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12 md4>
                          <v-layout justify-end align-start>
                            <Rating value="3.5" star />
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout column fill-height align-start>
                        <p>
                          Material Design Component Framework Vuetify is a Vue
                          UI Library with beautifully handcrafted Material
                          Components. No design skills required — everything you
                          need to create amazing applications is at your
                          fingertips.
                        </p>
                      </v-layout>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <!-- -->
              </v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Avatar from '~/components/Avatar'
import Rating from '~/components/Rating'
import ObjectId from '~/utils/formRules/objectId'
import camelCase from '~/utils/capitalizeWords'

import api from '~/api/baseApi'
const Persona = api('/Persona')
const Localidad = api('/Localidad')

export default {
  // middleware: 'authenticated', es publico
  components: { Avatar, Rating },
  validate({ params }) {
    return ObjectId()(params.id) === true
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
    loadingTrabajos: true,
    enableEdit: false,
    habilidades: ['Ingeniero', 'Plomero'],
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
  },
  async mounted() {
    const self = this
    setTimeout(function () {
      self.loadingTrabajos = false
    }, 3000)

    if (this.showBtnEditable) {
      this.form = { ...this.perfil }
    }

    // TODO search query
    const { data } = await Localidad.getAll()
    this.localidades = data || []
  },
  methods: {
    add() {},
    async save() {
      const { data } = await Persona.save(this.form)
      console.log(data)
      this.enableEdit = false
    },
  },
}
</script>
