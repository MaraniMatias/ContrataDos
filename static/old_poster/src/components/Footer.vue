<template>
<a-layout-footer class="ant-layout-footer">
  <p>Contrata2 © {{year}}</p>
  <p>{{ msg }}</p>
</a-layout-footer>
</template>

<script>
export default {
  name: "c2-footer",
  props: {
    msg: String,
  },
  data() {
    return {
      year: null,
    };
  },
  computed: {},
  beforeMount() {
    this.year = new Date().getFullYear();
  },
};
</script>

<style scoped>
.ant-layout-footer {
  text-align: center;
  line-height: 1.5;
}
</style>
