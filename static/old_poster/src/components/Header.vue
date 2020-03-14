<template>
<a-layout-header style="background: #086b94;">
  <a-row style="max-width: 1300px; margin: auto; padding: 0 20px;">
    <a-row type="flex" justify="space-between" class="header">
      <a-row type="flex" :span="6" justify="start" style="width: 300px;">
        <a-col>
          <img alt="Vue logo" src="./../assets/logo.jpeg" class="logo">
        </a-col>
      </a-row>
      <a-row type="flex" :span="12" justify="center">
        <a-col>
          <a-input-search placeholder="Buscar profesional" style="width: 100%" @search="onSearch" />
        </a-col>
      </a-row>
      <a-row type="flex" :span="6" justify="end" style="width: 300px;">
        <a-col>
          <a-menu v-model="current" mode="horizontal">
            <a-menu-item key="mail">
              <a-icon type="calendar" />
            </a-menu-item>
            <a-menu-item key="app">
              <a-icon type="team" />
            </a-menu-item>
            <a-menu-item key="noty">
              <a-icon type="bell" />
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col>
          <a-avatar shape="square" :src="uss.avatar" style="margin-left: 12px; margin-top: -4px;" />
        </a-col>
      </a-row>
    </a-row>
  </a-row>
</a-layout-header>
</template>

<script>
export default {
  name: "c2-header",
  data() {
    return {
      current: [],
      uss: {
        // avatar: this.$faker.image.avatar(),
        avatar: this.$faker.internet.avatar(),
        usuario: this.$faker.internet.userName(),
        name: {
          firstName: this.$faker.name.firstName(),
          lastName: this.$faker.name.lastName(),
        },
      },
    };
  },
  computed: {},
  methods: {
    onSearch(v) {
      console.log(v);
    },
  },
};
</script>

<style>
.ant-layout-header {
  padding: 0 50px;
  height: 46px;
  line-height: 64px;
}

img.logo {
  margin: 2px 0 0 0;
  height: 42px;
}

.header {
  height: 46px;
}

.header div {
  height: 46px;
  align-items: center;
  display: flex;
}

.header .ant-menu.ant-menu-horizontal.ant-menu-root.ant-menu-light {
  background: #086b94;
  color: #fff;
}

.header
  .ant-menu.ant-menu-horizontal.ant-menu-root.ant-menu-light
  .ant-menu-item {
  font-size: 28px;
  padding: 0 4px 0 4px;
}
</style>
