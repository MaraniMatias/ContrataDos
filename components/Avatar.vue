<template>
  <v-avatar :size="size" style="cursor: pointer;" v-on="{ ...on }">
    <img
      v-if="!avatarError && !!src"
      :src="src"
      @error.stop="avatarError = true"
    />
    <img v-else src="~/assets/images/user_default.png" />
  </v-avatar>
</template>

<script>
export default {
  props: {
    size: { type: String, default: '32' },
    src: { type: String, default: '' },
    on: { type: Object, default: () => {} },
  },
  data: () => ({
    avatarError: false,
  }),
  methods: {},
}
</script>
>

<style scoped>
.logo {
  margin: 2px 0 0 0;
  height: 42px;
}
</style>
