<template>
  <v-hover v-slot:default="{ hover }">
    <v-avatar
      :size="size"
      :class="{ cursor: editable && hover }"
      :color="editable && hover ? '' : ''"
      v-on="{ ...on }"
    >
      <v-icon v-if="editable && hover" size="96">
        camera_alt
      </v-icon>
      <template v-else>
        <img
          v-if="!avatarError && !!src"
          :src="src"
          @error.stop="avatarError = true"
        />
        <v-icon v-else :size="size">account_circle</v-icon>
      </template>
    </v-avatar>
  </v-hover>
  <!--
  <div>
    <cropper
      :src="src"
      stencil-component="circle-stencil"
      :style="style"
      @change="change"
    />
  </div>
  -->
</template>

<script>
// import { Cropper } from 'vue-advanced-cropper'

export default {
  // components: { Cropper },
  props: {
    size: { type: String, default: '32' },
    src: { type: String, default: '' },
    on: { type: Object, default: () => {} },
    editable: { type: Boolean, default: false },
  },
  data: () => ({
    avatarError: false,
    modal: false,
  }),
  computed: {
    style() {
      return {
        height: this.size + 'px',
        background: '#ddd',
      }
    },
  },
  watch: {},
  methods: {
    showModalEdit() {
      this.modal = true
    },
    change({ coordinates }) {
      console.log(coordinates)
    },
  },
}
</script>

<style scoped>
.logo {
  margin: 2px 0 0 0;
  height: 42px;
}
.cursor {
  cursor: pointer;
}
</style>
