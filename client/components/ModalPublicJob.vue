<template>
  <CardForm @submit="saveTrabajo">
    <template v-slot:header>Publicar trabajo</template>
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
          label="Habilidad"
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
          <error v-if="error" :text="error" />
          <p v-else class="mb-0 mx-4" v-text="form.fileName" />
          <CardCropper :on.sync="pickupImg" @submit="saveTrabajoImg" />
        </v-layout>
      </v-flex>
    </template>
    <template v-slot:actions-left>
      <v-btn v-if="trabajo._id" color="red darken-4" text @click="delJob()">
        Eliminar
      </v-btn>
    </template>
    <template v-slot:actions>
      <v-btn text :disabled="loading" @click="close()">Cancelar </v-btn>
      <v-btn :disabled="loading" color="primary" type="submit">
        {{ form._id ? 'Guardar' : 'Publicar' }}
      </v-btn>
    </template>
  </CardForm>
</template>

<script>
import CardForm from '~/components/CardForm'
import CardCropper from '~/components/CardCropper'

import { EstadoTrabajo, TipoTrabajo } from '~~/server/utilities/enums'

import { Localidad, Trabajo } from '~/api'
import apiFile from '~/api/file'
const onFileUpload = 'progressFileUpload'
const { trabajo: saveImg } = apiFile(onFileUpload)

function NewTrabajo() {
  return {
    estado: EstadoTrabajo.TERMINADO,
    tipo: TipoTrabajo.PUBLICO,
    fileName: '',
    localidad: {},
    servicios: [],
    descripcion_breve: '',
    descripcion: '',
  }
}

export default {
  components: { CardForm, CardCropper },
  props: {
    trabajo: { type: Object, default: () => ({}) },
  },
  data: () => ({
    loading: false,
    pickupImg: false,
    localidades: [],
    habilidades: [],
    form: NewTrabajo(),
    pickedFile: null,
    error: '',
  }),
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  created() {
    if (this.trabajo?._id) {
      this.form = { ...this.trabajo }
    } else {
      this.form.localidad = this.user.localidad?._id
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
      this.error = ''
      if (!formValid) return
      if (!this.form._id && !this.pickedFile) {
        this.error = 'Elija una imagen para mostrar'
        return
      }
      this.loading = true
      this.form.tipo = TipoTrabajo.PUBLICO
      this.form.descripcion_breve = this.form.descripcion_breve.toLowerCase()
      let err
      if (this.pickedFile) {
        const { error } = await saveImg(this.pickedFile, this.form)
        err = error
      } else {
        const { error } = await Trabajo.save(this.form)
        err = error
      }
      if (err) {
        this.$notify({ type: 'error', text: err.message || err })
      } else {
        this.$notify({ type: 'success', text: 'Trabajo actualizado.' })
        this.$emit('change', this.form)
      }
      this.loading = false
    },
    close() {
      this.form = NewTrabajo()
      this.pickedFile = null
      this.pickupImg = false
      this.$emit('close')
    },
    async delJob() {
      this.loading = true
      const { error } = await Trabajo.delete(this.trabajo)
      if (error) {
        this.$notify({ type: 'error', text: error.message || error })
      } else {
        this.$notify({ type: 'success', text: 'Trabajo eliminado.' })
        this.$emit('change', this.form)
      }
      this.loading = false
    },
  },
}
</script>
