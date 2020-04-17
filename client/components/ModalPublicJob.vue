<template>
  <v-dialog v-model="value" width="550" persistent @keyup.esc="close()">
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
        <v-btn text :disabled="loading" @click="close()">Cancelar </v-btn>
        <v-btn :disabled="loading" color="primary" type="submit">
          Guardar
        </v-btn>
      </template>
    </CardForm>
  </v-dialog>
</template>

<script>
import CardForm from '~/components/CardForm'
import CardCropper from '~/components/CardCropper'

import { EstadoTrabajo, TipoTrabajo } from '~~/server/utilities/enums'

import { Localidad } from '~/api'
import apiFile from '~/api/file'
const onFileUpload = 'progressFileUpload'
const { trabajo: saveImg } = apiFile(onFileUpload)

export default {
  components: { CardForm, CardCropper },
  props: {
    trabajo: { type: Object },
    value: { type: Boolean, default: false },
  },
  data: () => ({
    loading: false,
    pickupImg: false,
    localidades: [],
    habilidades: [],
    form: {},
    pickedFile: null,
  }),
  computed: {},
  watch: {},
  created() {
    this.close(true)
    if (this.trabajo) {
      this.form = { ...this.trabajo }
    }
  },
  async mounted() {
    // TODO search query
    const { data: l } = await Localidad.getAll()
    this.localidades = l || []
    // const { data: h } = await Habilidad.getAll()
    // this.habilidades = h || []
    this.habilidades = this.$store.state.user.servicios || []
  },
  methods: {
    saveTrabajoImg({ file, fileName }) {
      this.pickedFile = file
      this.form.fileName = fileName
      this.pickupImg = false
    },
    async saveTrabajo(formValid) {
      if (!formValid) return
      this.loading = true
      this.form.tipo = TipoTrabajo.PUBLICO
      const { error } = await saveImg(this.pickedFile, this.form)
      if (error) {
        this.$notify({ type: 'error', text: error.message || error })
      } else {
        this.$notify({ type: 'success', text: 'Trabajo actualizado.' })
        this.close()
      }
      this.loading = false
    },
    close(start = false) {
      if (!start) {
        this.$emit('input', false)
        this.$emit('change', this.form)
      }
      this.pickedFile = null
      this.pickupImg = false
      this.form = {
        estado: EstadoTrabajo.TERMINADO,
        tipo: TipoTrabajo.PUBLICO,
        fileName: '',
        localidad: {},
        servicios: [],
        descripcion_breve: '',
        descripcion: '',
      }
    },
  },
}
</script>
