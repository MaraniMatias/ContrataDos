<template>
  <v-layout fill-height align-center justify-center>
    <v-flex xs12 lg5 xl4>
      <v-layout column>
        <img src="/logo.png" style="margin: 2px 0 0 0; height: 160px;" />
        <v-autocomplete
          ref="search"
          v-model="select"
          append-icon=""
          autofocus
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
        <v-layout fill-height justify-center mt-4>
          <v-btn rounded color="primary" x-large @click="btnSearch">
            Buscar profesional
          </v-btn>
        </v-layout>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { Localidad, Habilidad } from '~/api'

export default {
  components: {},
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
  async mounted() {
    this.loading = true
    const { data: localidades } = await Localidad.getAll()
    const localidadList = localidades?.map(({ _id, nombre }) => ({
      _id,
      text: nombre,
      type: 'localidad',
    }))
    const { data: habilidades } = await Habilidad.getAll()
    const habilidadList = habilidades?.map(({ _id, nombre }) => ({
      _id,
      text: nombre,
      type: 'habilidad',
    }))
    this.items = localidadList.concat(habilidadList)
    this.loading = false
  },
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
        this.$nextTick(function () {
          this.$refs.search.focus()
        })
      }
    },
  },
}
</script>
