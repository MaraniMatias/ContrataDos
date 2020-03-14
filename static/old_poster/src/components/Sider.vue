<template>
<a-layout-sider width="160" style="background: #fff">
  <a-menu mode="inline" :defaultSelectedKeys="[]" :defaultOpenKeys="[]" style="height: 100%">
    <a-sub-menu key="sub1">
      <span slot="title">
        <a-icon type="user" />Oficios</span>
      <a-menu-item :key="index" v-for="(item, index) in profesiones">{{item}}</a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="sub2">
      <span slot="title">
        <a-icon type="laptop" />Profesiones</span>
      <a-menu-item :key="index" v-for="(item, index) in oficios">{{item}}</a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="sub3">
      <span slot="title">
        <a-icon type="global" />Ciudades</span>
      <a-menu-item :key="index" v-for="(item, index) in ['Rosario','Casilda','Alcorta']">{{item}}</a-menu-item>
    </a-sub-menu>
  </a-menu>
</a-layout-sider>
</template>

<script>
import List from "./../mixing/professional.js";

export default {
  name: "c2-sider",
  data() {
    return {
      oficios: List.oficios,
      profesiones: List.profesiones,
    };
  },
  computed: {},
  methods: {},
};
</script>

<style>
.ant-menu-sub.ant-menu-inline > .ant-menu-item,
.ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  line-height: 25px;
  height: 25px;
  list-style-type: disc;
  list-style-position: inside;
}
.ant-menu-sub.ant-menu-inline > li.ant-menu-submenu > div {
  padding-left: 0px !important;
}
</style>
