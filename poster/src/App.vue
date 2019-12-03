<template>
<div id="app" ng-cloak>
  <a-layout>
    <a-row>
      <a-col>
        <Header></Header>
        <a-layout-content class="app-content">
          <a-layout style="padding: 24px 0; background: #fff">
            <Sider></Sider>
            <Content></Content>
          </a-layout>
        </a-layout-content>
        <Footer msg="Rosario, Santa Fe, Argentina"></Footer>
      </a-col>
    </a-row>
  </a-layout>
</div>
</template>

<script>
import Footer from "./components/Footer.vue";
import Content from "./components/Content.vue";
import Header from "./components/Header.vue";
import Sider from "./components/Sider.vue";

export default {
  name: "app",
  components: {
    Footer,
    Content,
    Header,
    Sider,
  },
};
</script>

<style>
ng-cloak {
  display: none !important;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #2c3e50;
}

body {
  background: #f0f2f5;
}

.ant-layout-content.app-content {
  padding: 0 10px;
  margin-top: 10px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}
</style>
