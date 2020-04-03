<template>
  <v-row align="center" justify="center" class="mb-12">
    <div class="text-center">
      <!--
        <h1 style="font-size: 64px;">ContrataDos</h1>
        -->
      <img
        alt="logo"
        src="/logo.png"
        style="margin: 2px 0 0 0; height: 160px;"
      />
      <v-col cols="12">
        <v-autocomplete
          ref="search"
          v-model="select"
          append-icon=""
          border-radius
          cache-items
          flat
          hide-details
          hide-no-data
          :items="items"
          item-text="text"
          :loading="loading"
          menu-props="closeOnContentClick"
          multiple
          outlined
          return-object
          @keyup.enter="btnSearch()"
          @click:append="btnSearch()"
        >
          <template v-slot:selection="data">
            <v-chip
              close
              :input-value="data.selected"
              @click="data.select"
              @click:close="remove(data.item)"
              v-text="data.item.text"
            />
          </template>
          <template v-slot:item="data">
            {{ data.item.text }}
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-btn rounded color="primary" x-large @click="btnSearch">
          Buscar profesional
        </v-btn>
      </v-col>
    </div>
  </v-row>
</template>

<script>
import { Localidad, Habilidad } from '~/api'

export default {
  components: {},
  async asyncData() {
    let items = []
    const { data: localidades } = await Localidad.getAll()
    const localidadList = localidades.map(({ _id, nombre }) => ({
      _id,
      text: nombre,
      type: 'localidad',
    }))
    items = items.concat(localidadList)

    const { data: habilidades } = await Habilidad.getAll()
    const habilidadList = habilidades.map(({ _id, nombre }) => ({
      _id,
      text: nombre,
      type: 'habilidad',
    }))
    items = items.concat(habilidadList)

    return { items }
  },
  data: () => ({
    loading: false,
    items: [],
    search: null,
    select: [],
  }),
  computed: {},
  /* watch: {
    search(val) {
      if (this.loading === false) {
        val && val.length > 2 && this.querySelections(val)
      }
    },
  }, */
  methods: {
    makeQuery(type) {
      return this.select
        .filter((item) => item.type === type)
        .map(({ _id }) => _id)
    },
    btnSearch() {
      if (this.select.length) {
        this.$router.replace({
          name: 'search',
          query: {
            profesion: this.makeQuery('habilidad'),
            localidad: this.makeQuery('localidad'),
          },
        })
      } else {
        const self = this
        this.$nextTick(function () {
          self.$refs.search.focus()
        })
      }
    },
    /* querySelections(q) {
      this.loading = true
      this.items = []
      this.$http.get('/api/search', { params: { q } }).then(({ data }) => {
        this.items = data
        this.loading = false
      })
    }, */
  },
}
</script>
