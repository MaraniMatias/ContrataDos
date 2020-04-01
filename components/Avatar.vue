<template>
  <v-hover v-slot:default="{ hover }">
    <v-avatar
      :size="size"
      :class="{ cursor: editable && hover }"
      :color="editable && hover ? '' : ''"
      v-on="{ ...on }"
      @click="changeImg"
    >
      <form enctype="multipart/form-data" novalidate>
        <label for="files" style="display: none;">
          <input
            ref="file"
            name="file"
            type="file"
            accept="image/jpeg,image/jpg"
            @change="handleFilesUpload()"
          />
        </label>
      </form>
      <template v-if="editable && hover">
        <v-icon size="96">camera_alt</v-icon>
        <!-- <v-progress-circular /> -->
      </template>
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
import { mapMutations } from 'vuex'
// import { Cropper } from 'vue-advanced-cropper'
import apiFile from '~/api/file'
const onFileUpload = 'progressFileUpload'
const { perfil: savePerfil } = apiFile(onFileUpload)

/*
window.addEventListener(onFileUpload, function (progress) {
  console.log('printer state changed', progress)
})
*/

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
    ...mapMutations({ updateUser: 'SET_USER' }),
    showModalEdit() {
      this.modal = true
    },
    // crop({ coordinates, canvas }) {
    //   console.log(coordinates, canvas.toDataURL('image/png'))
    // },
    changeImg() {
      if (this.editable) this.$refs.file.click()
    },
    async handleFilesUpload() {
      const file = this.$refs.file.files[0]
      if (file.size < 5 * 1000000) {
        const { data, error } = await savePerfil(file)
        console.log(data, error)
        if (error) {
          this.$notify({
            type: 'error',
            text: error || 'Error al subir la foto.',
          })
        } else {
          this.updateUser()
        }
      } else {
        this.$notify({
          type: 'error',
          text: `Archivo demasiado grande, Máx 5 MB.`,
        })
      }
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
