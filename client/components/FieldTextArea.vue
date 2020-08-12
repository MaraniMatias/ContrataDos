<template>
  <tiptap-vuetify
    v-model="content"
    :extensions="extensions"
    placeholder="Escribe un mensaje"
    :card-props="{ outlined: true }"
  />
</template>

<script>
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  // Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  // Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  // History,
} from 'tiptap-vuetify'

export default {
  components: { TiptapVuetify },
  props: {
    disabled: { type: Boolean, default: false },
    value: { type: [Date, String], default: '' },
    heading: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
  },
  data: () => ({
    // starting editor's content
    content: '',
  }),
  computed: {
    extensions() {
      const arr = [
        // History,
        Blockquote,
        // Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        Bold,
        // Code,
        HorizontalRule,
        Paragraph,
        HardBreak,
      ]
      if (this.heading) {
        arr.push([Heading, { options: { levels: [1, 2] } }])
      }
      return arr
    },
  },
  watch: {
    content(val) {
      this.$emit('input', val)
    },
  },
  created() {
    this.content = this.value
  },
  mounted() {},
  methods: {},
}
</script>

<style>
.tiptap-vuetify-editor
  div.v-card.v-card--outlined.v-sheet.theme--light
  div.tiptap-vuetify-editor__content
  div.ProseMirror {
  max-height: 200px;
  height: 100px;
}
</style>
