<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    max-width="290px"
    min-width="290px"
    :disabled="disabled"
    offset-y
    transition="scale-transition"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="input"
        :index="index"
        :label="label"
        :hide-details="hideDetails"
        :clearable="clearable"
        class="pt-0"
        prepend-icon="alarm"
        :dense="dense"
        :color="color"
        readonly
        :rules="rule"
        @click:clear="clear"
        v-on="on"
      />
    </template>
    <v-time-picker
      v-model="parseDate"
      locale="es"
      format="24hr"
      full-width
      :min="min"
      :max="max"
      @click:minute="saveHora"
    />
  </v-menu>
</template>

<script>
import parseDateFormat from '../utils/dateFormat'
import formRules from '../utils/formRules'

export default {
  props: {
    label: String,
    disabled: { type: Boolean, default: false },
    hideDetails: Boolean,
    value: [Date, String],
    index: [Number, String],
    clearable: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    min: String,
    max: String,
  },
  data: () => ({
    date: '',
    input: '',
    menu: '',
  }),
  computed: {
    formRules: () => formRules,
    color() {
      return this.disabled ? 'black' : 'primary'
    },
    rule() {
      const rules = []
      if (this.required) rules.push(this.formRules.required())
      return rules
    },
    parseDate: {
      get() {
        const parseDate = this.value
        if (!parseDate) return null
        return parseDateFormat(parseDate, 'HH:mm')
      },
      set(val) {
        if (val) {
          const [hours, minutes] = val.split(':')
          const parseDate = this.value
          parseDate.setHours(hours, minutes, 0, 0)
          this.input = val
          this.date = parseDate
        }
      },
    },
  },
  watch: {
    date(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.input = parseDateFormat(val, 'HH:mm')
    },
  },
  created() {},
  mounted() {
    this.input = parseDateFormat(this.value, 'HH:mm')
  },
  methods: {
    saveHora(parseDate) {
      this.$refs.menu.save(parseDate)
    },
    clear() {
      this.$emit('input', null)
    },
  },
}
</script>
