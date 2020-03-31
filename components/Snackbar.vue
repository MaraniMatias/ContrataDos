<template>
  <v-layout column align-start class="orders">
    <v-card
      v-for="(alert, $i) in filtersItems"
      :key="$i"
      style="min-width: 350px;"
      :color="alert.color"
      class="ma-2"
    >
      <v-card-text class="pa-2 px-3">
        <v-layout align-center>
          <v-flex>
            <error :text="alert.text" type="none" />
          </v-flex>
          <v-btn icon text dark @click.stop="alert.show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    items: [],
  }),
  computed: {
    filtersItems() {
      return this.items.filter((alert) => alert.show)
    },
  },
  created() {
    this.$store.subscribe((mutation, { snackbar }) => {
      if (mutation.type === 'snackbar/show') {
        const alert = { show: true, ...snackbar.alert }
        this.items.push(alert)
        setTimeout(function () {
          alert.show = false
        }, alert.timeout)
      }
    })
  },
  methods: {},
}
</script>

<style scoped>
.orders {
  z-index: 1000;
  display: flex;
  position: fixed;
}
</style>
