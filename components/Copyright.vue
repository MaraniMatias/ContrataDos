<template>
  <a-layout>
    <p class="text--center" style="margin: 0px;">
      Copyright © <span v-text="year" /> ContrataDos by
      <a class="link-footer" href="http://www.qutap.com.ar" target="_blank">
        Qutap, We do it.
      </a>
    </p>
  </a-layout>
</template>

<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>
