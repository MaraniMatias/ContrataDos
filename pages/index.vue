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
        <v-text-field
          ref="search"
          v-model.lazy="query"
          outlined
          border-radius
          hide-details
          append-icon="search"
          @keyup.enter="search()"
          @click:append="search()"
        />
      </v-col>
      <v-col cols="12">
        <v-btn rounded color="primary" x-large @click="search">
          Buscar profesional
        </v-btn>
      </v-col>
    </div>
  </v-row>
</template>

<script>
export default {
  components: {},
  data: () => ({
    query: '',
  }),
  computed: {},
  methods: {
    search() {
      if (this.query) {
        this.$router.replace({ name: 'search', query: { q: this.query } })
      } else {
        const self = this
        this.$nextTick(function () {
          self.$refs.search.focus()
        })
      }
    },
  },
}
</script>
