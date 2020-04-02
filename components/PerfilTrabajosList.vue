<template>
  <v-layout column justify-start mt-4>
    <v-layout fill-height>
      <v-flex>
        <p class="headline mb-0">Trabajos</p>
      </v-flex>
      <v-btn v-if="showAddBtn" icon text @click.stop="showModal = true">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>

    <v-layout v-show="loadingTrabajos" my-4>
      <v-flex xs12 class="text-center">
        <v-progress-circular
          width="2"
          indeterminate
          :active="loadingTrabajos"
          color="grey darken-1"
        />
      </v-flex>
    </v-layout>

    <v-layout v-if="!loadingTrabajos" column>
      <v-flex v-if="listTrabajos.length === 0" xs12>
        <CardTrabajoAdd @click.stop="showModal = true" />
      </v-flex>
      <v-flex v-for="(trabajo, $i) in listTrabajos" :key="$i" xs12>
        <CardTrabajo :trabajo="trabajo" />
      </v-flex>
    </v-layout>
    <v-dialog v-model="showModal" width="550" persistent @keyup.esc="close">
      <CardForm @submit="saveTrabajo">
        <template v-slot:header>Agregar Trabajo</template>
        <template v-slot:default="{ rules }">
          <v-flex xs12 mx-2>
            <v-text-field
              v-model.lazy="form.descripcion_breve"
              dense
              hide-details
              label="Titulo o Descripción breve"
              outlined
              :readonly="loading"
              counter
              :rules="[rules.required(), rules.max(120)]"
            />
          </v-flex>
          <v-flex xs12 ma-2>
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
          <v-flex xs12 ma-2>
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
          <v-flex xs12 ma-2>
            <v-textarea
              v-model.lazy="form.descripcion"
              auto-grow
              counter="500"
              dense
              label="Descripción"
              outlined
              :readonly="loading"
              :rules="[rules.max(500)]"
            />
          </v-flex>
          <v-flex xs12 ma-2>
            <v-layout align-center>
              <v-btn
                depressed
                color="secondary"
                :disabled="loading"
                @click.stop="pickupImg = true"
              >
                Elegir foto
              </v-btn>
              <p class="mb-0 mx-4" v-text="form.fileName" />
              <CardCropper :on.sync="pickupImg" @submit="saveTrabajoImg" />
            </v-layout>
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
import CardTrabajoAdd from '~/components/CardTrabajoAdd'
import CardTrabajo from '~/components/CardTrabajo'
import CardForm from '~/components/CardForm'
import CardCropper from '~/components/CardCropper'

import { Trabajo, Localidad, Habilidad } from '~/api'
import apiFile from '~/api/file'
const onFileUpload = 'progressFileUpload'
const { trabajo: saveImg } = apiFile(onFileUpload)

export default {
  components: { CardTrabajo, CardTrabajoAdd, CardForm, CardCropper },
  props: {
    showAddBtn: { type: Boolean, default: false },
    profilId: { type: String, required: true },
  },
  data: () => ({
    loading: false,
    loadingTrabajos: true,
    listTrabajos: [],
    pickupImg: false,
    showModal: false,
    localidades: [],
    form: {
      fileName: '',
      localidad: {},
      descripcion_breve: '',
      descripcion: '',
    },
    pickedFile: null,
  }),
  computed: {},
  async mounted() {
    this.getTrabajos()

    // TODO search query
    const { data: l } = await Localidad.get()
    this.localidades = l || []
    // TODO search query
    const { data: h } = await Habilidad.get()
    this.habilidades = h || []
  },
  methods: {
    async getTrabajos() {
      this.loadingTrabajos = true
      // get los del perfil
      const params = {
        query: { profesional: this.profilId },
        populate: 'servicios,localidad',
      }
      const { data } = await Trabajo.get(params)
      // populate Localidation Habilidad
      this.listTrabajos = data || []
      this.loadingTrabajos = false
    },
    saveTrabajoImg({ file, fileName }) {
      this.pickedFile = file
      this.form.fileName = fileName
      this.pickupImg = false
    },
    async saveTrabajo() {
      this.loading = true
      const { error } = await saveImg(this.pickedFile, this.form)
      if (error) {
        this.$notify({ type: 'error', text: error.message })
      } else {
        this.close()
        this.getTrabajos()
      }
      this.loading = false
    },
    close() {
      this.showModal = false
      this.pickedFile = null
      this.pickupImg = false
      this.form = {
        fileName: '',
        localidad: {},
        descripcion_breve: '',
        descripcion: '',
      }
    },
  },
}
</script>
