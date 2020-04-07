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
  // Heading,
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
    value: [Date, String],
    required: { type: Boolean, default: false },
  },
  data: () => ({
    extensions: [
      // History,
      Blockquote,
      // Link,
      Underline,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      // [Heading, { options: { levels: [1, 2, 3] } }],
      Bold,
      // Code,
      HorizontalRule,
      Paragraph,
      HardBreak,
    ],
    // starting editor's content
    content: '',
  }),
  computed: {},
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
