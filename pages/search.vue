<template>
  <v-layout row pb-12 mb-2 px-2 justify-center>
    <v-flex xs12 sm12 md10 lg8 xl6 mt-4 mb-2>
      <v-layout column justify-start>
        <v-flex xs12 sm12 md10 lg10 xl6 mt-1 mb-2 class="text-center">
          <v-chip
            v-for="(item, key) in filters"
            :key="key"
            class="mx-2"
            v-text="item.nombre"
          />
        </v-flex>
        <v-flex xs12 class="text-center" mt-1 mb-2>
          <p class="mb-0">Resultados de la búsqueda: {{ totalItems }}</p>
        </v-flex>
        <v-layout v-show="loading" justify-center mt-3>
          <v-flex xs12 class="text-center">
            <v-progress-circular
              width="2"
              indeterminate
              active
              color="grey darken-1"
            />
          </v-flex>
        </v-layout>
      </v-layout>
      <v-layout v-if="!loading" column>
        <v-flex v-for="(perfil, $i) in items" :key="$i" xs12>
          <CardPerfil :perfil="perfil" @contactar="contactar" />
        </v-flex>
        <v-flex v-if="totalItems == 0" class="text-center" xs12 mt-4>
          <v-btn rounded color="primary" outlined x-large to="/">
            Volver al buscar
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-dialog v-model="showModal" width="550" persistent @keyup.esc="close">
      <CardForm @submit="submit">
        <template v-slot:header>
          Contratar con {{ form.cliente.apellido }} {{ form.cliente.nombre }}
        </template>
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
              :rules="[rules.max(500)]"
            />
          </v-flex>
          <!-- Avanzada -->
          <v-flex xs12 mt-2>
            <v-select
              v-model.lazy="form.servicios"
              dense
              hide-details
              :items="form.perfil.servicios"
              item-text="nombre"
              item-value="_id"
              label="Profesiones"
              :disabled="form.perfil.servicios.length === 0"
              multiple
              outlined
              :readonly="loading"
              :rules="[rules.required()]"
            />
          </v-flex>
          <!--
          <v-flex xs12 mt-2>
            <v-select
              v-model.lazy="form.localidad"
              dense
              hide-details
              :items="form.perfil.localidades"
              item-text="nombre"
              item-value="_id"
              label="Localidad"
              :loading="form.perfil.localidades.length === 0"
              outlined
              :readonly="loading"
              :rules="[rules.required()]"
            />
          </v-flex>
          -->
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
import { mapGetters } from 'vuex'
import { Persona, Habilidad, Localidad, Trabajo } from '~/api'
import CardPerfil from '~/components/CardPerfil'
import CardForm from '~/components/CardForm'
import { Roles, TipoTrabajo } from '~~/server/utilities/enums'

export default {
  components: { CardPerfil, CardForm },
  async asyncData({ query = {}, redirect, error }) {
    // error({ message: 'Internal error', statusCode: 500 })
    if (
      typeof query.profesion === 'undefined' &&
      typeof query.localidad === 'undefined'
    ) {
      redirect('/')
    }

    let filters = []
    if (query.localidad?.length) {
      const { data: localidades } = await Localidad.getAll({
        query: { _id: { $in: query.localidad } },
      })
      filters = filters.concat(localidades || [])
    }
    if (query.profesion?.length) {
      const { data: servicios } = await Habilidad.getAll({
        query: { _id: { $in: query.profesion } },
      })
      filters = filters.concat(servicios || [])
    }
    return { filters }
  },
  data: () => ({
    loading: true,
    items: [],
    // filters: [],
    showModal: false,
    totalItems: 0,
    form: {},
  }),
  computed: {
    ...mapGetters(['isLoggedIn']),
    user() {
      return this.$store.state.user
    },
  },
  mounted() {
    this.loadItems()
  },
  methods: {
    async loadItems() {
      const userLoginId = this.user._id
      const query = {
        roles: { $in: Roles.PROFECIONAL },
        _id: userLoginId ? { $nin: userLoginId } : undefined,
      }
      const servicios = this.$route?.query?.profesion
      const localidad = this.$route?.query?.localidad

      if (servicios?.length) query.servicios = servicios
      if (localidad?.length) query.localidad = localidad

      const { data, totalItems } = await Persona.get({
        query,
        populate: JSON.stringify([
          { path: 'localidad' },
          { path: 'servicios' },
        ]),
      })
      this.items = data
      this.totalItems = totalItems || 0

      this.loading = false
    },
    contactar(perfil) {
      if (this.isLoggedIn) {
        this.form = {
          perfil,
          cliente: this.user._id,
          profesional: perfil,
          localidad: this.user.localidad,
          tipo: TipoTrabajo.PRIVADO,
          descripcion: '',
          descripcion_breve: '', // Asunto
          servicios: perfil.servicios,
        }
        this.showModal = true
      } else {
        // TODO si tiene que logearse despues de login ok regresar y abrir el modal para contratar
        this.$router.replace({ name: 'login', query: { back: 'search' } })
      }
    },
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
          text: 'Listo, esperando respuesta de ' + this.form.perfil.nombre,
        })
        this.showModal = false
      }
      this.loading = false
    },
    close() {
      this.showModal = false
      this.form = {}
    },
  },
}
</script>
