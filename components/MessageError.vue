<template>
  <p v-show="show" class="show-error mb-0" :class="colorClass">
    <slot>
      <div v-html="html"></div>
    </slot>
  </p>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Error',
  props: {
    // eslint-disable-next-line
    text: { type: [String, Array, Function] },
    type: {
      type: String,
      default: 'error',
      validator(value) {
        return ['none', 'success', 'info', 'warm', 'error'].includes(value)
      },
    },
  },
  computed: {
    ...mapGetters('auth', ['getUserEmail']),
    show() {
      return Array.isArray(this.text) ? !!this.text.length : !!this.text
    },
    colorClass() {
      const colors = {
        none: 'white--text',
        info: 'info--text',
        success: 'success--text',
        error: 'red--text text--darken-3',
        warn: 'orange--text text--darken-3',
      }
      return colors[this.type]
    },
    html() {
      if (typeof this.text === 'function') {
        return this.text(this.getUserEmail)
      } else if (Array.isArray(this.text)) {
        return this.text
          .map((item) => '<p class="mb-0">' + item + '</p>')
          .join('')
      } else {
        return this.text
      }
    },
  },
  // methods: {},
  // created() {},
  // watch: {}
}
</script>
