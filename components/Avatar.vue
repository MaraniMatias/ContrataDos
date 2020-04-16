<template>
  <div>
    <v-hover v-slot:default="{ hover }">
      <v-avatar
        :size="size"
        :class="{ cursor: editable && hover, 'elevation-3': elevation }"
        :color="editable && hover ? '' : ''"
        v-on="{ ...on }"
        @click.stop="openCorp"
      >
        <template v-if="editable && hover">
          <v-icon size="96">camera_alt</v-icon>
        </template>
        <template v-else>
          <v-icon v-if="avatarError || !src || loading" :size="size">
            account_circle
          </v-icon>
          <img v-else :src="base64img" />
        </template>
      </v-avatar>
    </v-hover>
    <CardCropper :on.sync="modalUpdateImg" circle @submit="savePerfilImg" />
  </div>
</template>

<script>
import CardCropper from '~/components/CardCropper'
import apiFile from '~/api/file'
const onFileUpload = 'progressFileUpload'
const { perfil: savePerfil } = apiFile(onFileUpload)

export default {
  components: { CardCropper },
  props: {
    size: { type: String, default: '32' },
    src: { type: String, default: '' },
    on: { type: Object, default: () => {} },
    editable: { type: Boolean, default: false },
    elevation: { type: Boolean, default: false },
  },
  data: () => ({
    avatarError: true,
    modalUpdateImg: false,
    loading: false,
    base64img: null,
  }),
  computed: {},
  watch: {
    src: 'loadImg',
  },
  mounted() {
    this.loadImg()
  },
  created() {
    this.$store.subscribe(({ type }) => {
      if (type === 'SET_USER') {
        this.loadImg()
      }
    })
  },
  methods: {
    openCorp() {
      if (this.editable) this.modalUpdateImg = true
    },
    async savePerfilImg({ file }) {
      this.loading = true
      const { data, error } = await savePerfil(file)
      if (error) {
        this.$notify({ type: 'error', text: 'Error al subir la foto.' })
      } else {
        this.modalUpdateImg = false
        this.$emit('change', data)
        // this.loadImg()
      }
      this.loading = false
    },
    async loadImg() {
      try {
        this.loading = true
        this.avatarError = true
        const { data: imgFile } = await this.$http.get(this.src, {
          responseType: 'arraybuffer',
        })
        this.base64img =
          'data:image/jpeg;base64,' +
          Buffer.from(imgFile, 'binary').toString('base64')
        this.avatarError = false
      } catch (err) {
        this.avatarError = true
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
