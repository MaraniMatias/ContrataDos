<template>
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
          return-object
          outlined
          :readonly="loading"
          :rules="[rules.required()]"
        />
      </v-flex>
      <template v-if="isAProfessional">
        <v-flex xs12 ma-2 mt-2>
          <v-layout wrap align-center mt-2 fill-height>
            <v-flex xs12>
              <v-layout align-center>
                <v-flex>
                  <v-autocomplete
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
                    :search-input.sync="queryHabilidades"
                    :readonly="loading"
                    :rules="[rules.required()]"
                  >
                    <template v-slot:no-data>
                      <v-divider class="mb-2" />
                      <v-list-item @click="addProfession">
                        <v-list-item-content>
                          <v-list-item-title>
                            Agregar profesión
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ queryHabilidades }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-flex>
                <v-tooltip v-if="!loadLikeProfessional" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn color="red" icon @click="setLikeCliente" v-on="on">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Soy un trabajador</span>
                </v-tooltip>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model.lazy="form.matricula"
                dense
                hide-details
                label="Número de matrícula"
                outlined
                :readonly="loading"
                :rules="[rules.alphaSpacesNumLodash()]"
              />
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 ma-2 mt-2>
          <FieldTextArea
            v-model.lazy="form.bibliography"
            placeholder="Bibliografía, cuenta algo que resulta útil para el cliente, como trabajas, lo que se te da bien, servicio distintivo a otros profesional."
          />
        </v-flex>
      </template>
      <v-flex v-else xs12>
        <v-btn color="primary" text block @click="setLikeProfesional">
          Darme de alta como trabajador
        </v-btn>
      </v-flex>
    </template>
    <template v-slot:actions>
      <v-btn text :disabled="loading" @click="close">Cancelar </v-btn>
      <v-btn :disabled="loading" color="primary" type="submit"> Guardar </v-btn>
    </template>
  </CardForm>
</template>

<script>
import FieldTextArea from '~/components/FieldTextArea'
import CardForm from '~/components/CardForm'
import { Roles } from '~~/server/utilities/enums'
import { Persona, Localidad, Habilidad } from '~/api'
import CapitalizeWords from '~~/server/utilities/capitalizeWords'

export default {
  components: {
    FieldTextArea,
    CardForm,
  },
  props: {
    loadLikeProfessional: { type: Boolean, default: false },
  },
  data: () => ({
    loading: false,
    form: { roles: [], servicios: [] }, // localidad: {}   razon_social: {}
    habilidades: [],
    localidades: [],
    queryHabilidades: '',
  }),
  computed: {
    user() {
      return this.$store.state.user
    },
    isAProfessional() {
      return this.form.roles?.includes(Roles.PROFESIONAL)
    },
  },
  created() {
    this.form = { ...this.user }
    if (this.loadLikeProfessional) {
      this.form.show_tutorial = false
      this.form.roles = [Roles.CLIENTE, Roles.PROFESIONAL]
    } else {
      this.form.roles = Array.from(this.user.roles)
    }
  },
  async mounted() {
    // TODO search query
    const { data: l } = await Localidad.getAll()
    this.localidades = l || []
    // TODO search query
    const { data: h } = await Habilidad.getAll()
    this.habilidades = h || []
  },
  methods: {
    setLikeProfesional() {
      const set = new Set(this.user.roles)
      set.add(Roles.PROFESIONAL)
      set.delete(Roles.CLIENTE)
      this.form.roles = Array.from(set)
    },
    setLikeCliente() {
      const set = new Set(this.user.roles)
      set.add(Roles.CLIENTE)
      set.delete(Roles.PROFESIONAL)
      this.form.roles = Array.from(set)
    },

    async submit(formValid) {
      if (!formValid) return
      this.loading = true
      const { error } = await Persona.save(this.form)
      if (error) {
        this.$notify({ type: 'error', text: error })
      } else {
        this.$emit('submit', this.form)
      }
      this.loading = false
    },
    close() {
      this.$emit('close')
    },

    async addProfession() {
      const { error, data } = await Habilidad.save({
        nombre: CapitalizeWords(this.queryHabilidades),
      })
      this.$notify({
        type: error ? 'error' : 'success',
        text: error || 'Profesión agregada',
      })
      if (data) {
        this.queryHabilidades = null
        this.habilidades.push(data)
        this.form.servicios.push(data)
      }
    },
  },
}
</script>
