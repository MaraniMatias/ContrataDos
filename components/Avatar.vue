<template>
  <div>
    <v-hover v-slot:default="{ hover }">
      <v-avatar
        :size="size"
        :class="{ cursor: editable && hover, 'elevation-3': elevation }"
        :color="editable && hover ? '' : ''"
        v-on="{ ...on }"
        @click="showModalEdit"
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
        </template>
        <template v-else>
          <img
            v-if="(!avatarError && !!src) || !loading"
            :src="src"
            @error.stop="avatarError = true"
          />
          <v-icon v-else :size="size">account_circle</v-icon>
        </template>
      </v-avatar>
    </v-hover>
    <v-dialog v-model="modalUpdateImg" width="400">
      <CardForm @submit="savePerfilImg">
        <template v-slot:header>Perfil</template>
        <template v-slot:default>
          <Cropper
            :src="fileUrl"
            stencil-component="circle-stencil"
            class="cropper"
            @change="crop"
          />
        </template>
        <!--
        <template v-slot:message>
          <error :text="error" />
        </template>
        -->
        <template v-slot:actions>
          <v-btn text :disabled="loading" @click.stop="modalUpdateImg = false">
            Cancelar
          </v-btn>
          <v-btn :disabled="loading" color="primary" type="submit">
            Guardar
          </v-btn>
        </template>
      </CardForm>
    </v-dialog>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import CardForm from '~/components/CardForm'
import apiFile from '~/api/file'
import base64 from '~/utils/base64'
const onFileUpload = 'progressFileUpload'
const { perfil: savePerfil } = apiFile(onFileUpload)

export default {
  components: { Cropper, CardForm },
  props: {
    size: { type: String, default: '32' },
    src: { type: String, default: '' },
    on: { type: Object, default: () => {} },
    editable: { type: Boolean, default: false },
    elevation: { type: Boolean, default: false },
  },
  data: () => ({
    avatarError: false,
    modalUpdateImg: false,
    fileUrl: undefined,
    cropImgBase64: '',
    loading: false,
  }),
  computed: {},
  watch: {},
  // created() {
  //   this.$store.subscribe((mutation, { user }) => {
  //     if (mutation.type === 'SET_USER') {
  //       this.loading = true
  //       this.$nextTick(function () {
  //         this.loading = false
  //       })
  //     }
  //   })
  // },
  methods: {
    showModalEdit() {
      if (this.editable) this.$refs.file.click()
    },
    crop({ canvas }) {
      this.cropImgBase64 = canvas.toDataURL('image/jpeg')
    },
    async savePerfilImg() {
      this.loading = true
      const file = await base64.toFile(this.cropImgBase64, 'perfil')
      const { data, error } = await savePerfil(file)
      if (error) {
        this.$notify({ type: 'error', text: 'Error al subir la foto.' })
      } else {
        this.$emit('change', data)
        this.modalUpdateImg = false
      }
      this.loading = false
    },
    handleFilesUpload() {
      const file = this.$refs.file.files[0]
      if (file.size < 5 * 1000000) {
        this.fileUrl = (window.URL || window.webkitURL).createObjectURL(file)
        this.modalUpdateImg = true
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
.cursor {
  cursor: pointer;
}
.cropper {
  height: 350px;
  background: #ddd;
}
</style>
