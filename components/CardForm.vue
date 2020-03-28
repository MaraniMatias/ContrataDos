<template>
  <v-card outlined :class="{ 'pt-3': hideHeader }">
    <v-toolbar v-if="!hideHeader" color="transparent" flat title>
      <v-toolbar-title><slot name="header" /></v-toolbar-title>
      <v-spacer />
      <slot name="header-right" />
    </v-toolbar>
    <v-form
      ref="form"
      v-model="valid"
      :enctype="enctype"
      lazy-validation
      @submit.prevent="submit()"
    >
      <v-container class="py-0 px-2" grid-list-md>
        <v-card-text class="py-0">
          <slot :rules="rules" />
          <v-flex xs12 my-2><slot name="message" /></v-flex>
        </v-card-text>
      </v-container>
      <v-card-actions class="pa-4">
        <slot name="actions-left" />
        <v-spacer />
        <slot name="actions" />
      </v-card-actions>
    </v-form>
    <slot name="footer" />
  </v-card>
</template>

<script>
import formRules from '../utils/formRules'

export default {
  name: 'CardForm',
  props: {
    enctype: { type: String, default: 'application/x-www-form-urlencoded' },
    reset: { type: Boolean, default: false },
    transparent: { type: Boolean, default: false },
    hideHeader: { type: Boolean, default: false },
  },
  data: () => ({
    valid: false,
  }),
  computed: {
    rules: () => formRules,
  },
  watch: {
    valid(newValue) {
      this.$emit('input', newValue)
    },
    reset: 'resetValidation',
  },
  mounted() {
    this.$nextTick(function () {
      this.$refs.form.resetValidation()
    })
  },
  methods: {
    // validate() {
    //   if (this.$refs.form.validate()) { }
    // },
    // reset() {
    //   this.$refs.form.reset();
    // },
    async resetValidation() {
      await this.$refs.form.resetValidation()
      this.$emit('update:reset', false)
    },
    async submit() {
      const valid = await this.$refs.form.validate()
      this.$emit('submit', valid)
    },
  },
}
</script>
