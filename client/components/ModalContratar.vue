<template>
  <v-dialog v-model="value" width="550" persistent @keyup.esc="close()">
    <CardForm @submit="submit">
      <template v-slot:header>Contratar con {{ headline }}</template>
      <template v-slot:default="{ rules }">
        <p>
          Cuente, describa la tarea a realizar, el problema, para que necesita
          los servicios del profesional.
        </p>
        <v-flex xs12 mt-2>
          <v-text-field
            v-model.lazy="form.descripcion_breve"
            dense
            hide-details
            label="Asunto"
            outlined
            :readonly="loading"
            counter
            :rules="[rules.required(), rules.max(120)]"
          />
        </v-flex>
        <v-flex xs12 mt-2>
          <v-textarea
            v-model.lazy="form.descripcion"
            auto-grow
            counter="500"
            dense
            label="Descripción"
            outlined
            :readonly="loading"
            :rules="[rules.max(500), rules.required()]"
          />
        </v-flex>
        <!-- Avanzada -->
        <v-flex xs12>
          <v-select
            v-model.lazy="form.localidad"
            dense
            :items="localidades"
            item-text="nombre"
            item-value="_id"
            label="Localidad"
            hide-details
            outlined
            :readonly="loading"
            :rules="[rules.required()]"
          />
        </v-flex>
        <v-flex xs12 mt-3>
          <v-select
            v-model.lazy="form.servicios"
            dense
            hide-details
            :items="form.profesional.servicios"
            item-text="nombre"
            item-value="_id"
            label="Profesiones"
            :disabled="form.profesional.servicios.length === 0"
            multiple
            outlined
            :readonly="loading"
            :rules="[rules.required()]"
          />
        </v-flex>
      </template>
      <template v-slot:actions>
        <v-btn text :disabled="loading" @click="close()">Cancelar </v-btn>
        <v-btn :disabled="loading" color="primary" type="submit">
          Contratar
        </v-btn>
      </template>
    </CardForm>
  </v-dialog>
</template>

<script>
import { Localidad, Trabajo } from '~/api'
import CardForm from '~/components/CardForm'
import { TipoTrabajo } from '~~/server/utilities/enums'
import camelCase from '~~/server/utilities/capitalizeWords'

export default {
  components: { CardForm },
  props: {
    perfil: { type: Object, required: true },
    value: { type: Boolean, default: false },
  },
  data: () => ({
    loading: false,
    form: { profesional: {} },
    localidades: [],
  }),
  computed: {
    user() {
      return this.$store.state.user
    },
    headline() {
      return camelCase(
        this.perfil.razon_social
          ? this.perfil.razon_social +
              `(${this.perfil.nombre} ${this.perfil.apellido})`
          : this.perfil.nombre + ' ' + this.perfil.apellido
      )
    },
  },
  created() {
    this.close(true)
  },
  async mounted() {
    const { data: l } = await Localidad.getAll()
    this.localidades = l || []
  },
  methods: {
    async submit(formValid) {
      if (!formValid) return
      this.loading = true
      // TODO check que no se pueda guardar y/o solitar en nombre de otro
      const { error } = await Trabajo.save(this.form)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.$notify({
          type: 'success',
          text: 'Listo, esperando respuesta de ' + this.perfil.nombre,
        })
        this.close()
      }
      this.loading = false
    },
    close(start = false) {
      if (!start) {
        this.$emit('input', false)
        this.$emit('change', this.form)
      }
      this.form = {
        cliente: this.user._id,
        profesional: this.perfil,
        localidad: this.user.localidad
          ? this.user.localidad
          : this.user.localidad._id,
        tipo: TipoTrabajo.PRIVADO,
        descripcion: '',
        descripcion_breve: '', // Asunto
        servicios: this.form.servicios,
      }
    },
  },
}
</script>
