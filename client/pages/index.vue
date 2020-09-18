<template>
  <v-layout align-center justify-center fill-height>
    <v-flex xs12 lg5 xl3>
      <v-layout column style="margin-bottom: 100px">
        <v-flex class="text-center">
          <img
            src="/logo.png"
            alt="logo de ContrataDos"
            width="100%"
            height="100%"
          />
        </v-flex>
        <v-flex xs12 lg4 xl3>
          <v-autocomplete
            ref="search"
            v-model="select"
            append-icon=""
            border-radius
            cache-items
            flat
            hide-details
            hide-no-data
            placeholder="Buscar"
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
        </v-flex>
        <v-flex mt-4>
          <v-layout fill-height justify-center>
            <v-btn rounded color="primary" x-large @click="btnSearch">
              Buscar profesional
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { isMobile } from 'mobile-device-detect'
import { Localidad, Habilidad } from '~/api'

function logoHeight(name) {
  switch (name) {
    case 'xs':
      return '180px'
    case 'sm':
      return '200px'
    case 'md':
      return '350px'
    default:
      return '400px'
  }
}

export default {
  components: {},
  asyncData({ $vuetify }) {
    return { logoHeight: logoHeight($vuetify.breakpoint.name) }
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
  layout() {
    return isMobile ? 'mobile' : 'default'
  },
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
