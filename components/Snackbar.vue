<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout" top>
    <error :text="text" type="none" />
    <v-btn icon text dark @click.stop="show = false">
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    show: false,
    color: 'info',
    timeout: 0,
    text: '',
    button: {},
  }),
  computed: {
    // alert() {
    //   return this.$store.state.alert || {}
    // },
  },
  created() {
    this.$store.subscribe((mutation, { snackbar }) => {
      if (mutation.type === 'snackbar/show') {
        const alert = snackbar.alert
        const self = this
        Object.keys(alert).forEach((key) => {
          self[key] = alert[key]
        })
      }
    })
  },
}
</script>
