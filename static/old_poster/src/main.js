"use strict";
import faker from "faker/locale/es_MX";
import Vue from "vue";
// https://github.com/vueComponent/ant-design-vue/blob/master/site/components.js
import "./ant-design-vue.js";
import App from "./App";

Vue.prototype.$faker = faker;

Vue.filter("limit", function(value, limit) {
  if (!value) return "";
  value = value.toString();
  return typeof value !== "undefined"
    ? value.substring(0, limit) + (value.length > limit ? "..." : "")
    : "";
});

Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
