<template>
  <v-layout align-center justify-center fill-height>
    <v-layout column align-center justify-center fill-height>
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
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  components: {},
  data: () => ({
    query: '',
  }),
  methods: {
    search() {
      if (this.query) {
        this.$router.replace({ name: 'search', query: { q: this.query } })
      }
    },
  },
}
</script>
