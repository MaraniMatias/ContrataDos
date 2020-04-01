<template>
  <div>
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
    <v-dialog v-model="modalUpdateImg" width="400">
      <CardForm @submit="savePerfilImg">
        <template v-slot:header>Perfil</template>
        <template v-slot:default>
          <Cropper
            :src="fileUrl"
            :stencil-component="corpType"
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
import base64 from '~/utils/base64'

export default {
  components: { Cropper, CardForm },
  props: {
    circle: { type: Boolean, default: false },
    on: { type: Boolean, default: false },
  },
  data: () => ({
    modalUpdateImg: false,
    fileUrl: undefined,
    fileName: 'Sin nombre',
    cropImgBase64: '',
    loading: false,
  }),
  computed: {
    corpType() {
      return this.circle ? 'circle-stencil' : 'rectangle-stencil'
    },
  },
  watch: {
    on(val) {
      if (val) this.$refs.file.click()
      this.$emit('update:on', false)
    },
  },
  methods: {
    crop({ canvas }) {
      this.cropImgBase64 = canvas.toDataURL('image/jpeg')
    },
    async savePerfilImg() {
      this.loading = true
      const file = await base64.toFile(this.cropImgBase64, 'crop')
      this.$emit('submit', { file, fileName: this.fileName })
      this.modalUpdateImg = false
      this.loading = false
    },
    handleFilesUpload() {
      const file = this.$refs.file.files[0]
      this.fileName = file.name
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
.cropper {
  height: 350px;
  background: #ddd;
}
</style>
