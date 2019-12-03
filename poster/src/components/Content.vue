<template>
<a-layout-content>
  <div :style="{ padding: '24px', minHeight: '380px', paddingTop: '0px'}">
    <a-row>
      <a-col>
        <ProfesionalItem v-for="(item, index) in items" :key="index"></ProfesionalItem>
      </a-col>
    </a-row>
  </div>
</a-layout-content>
</template>

<script>
import ProfesionalItem from "./ProfesionalItem.vue";
export default {
  name: "c2-content",
  components: {
    ProfesionalItem,
  },
  data() {
    return {
      items: [],
    };
  },
  beforeMount() {
    const items = this.$faker.random.number(7, 20) + 2;
    for (let i = 0; i < items; i++) {
      this.items.push(i);
    }
  },
};
</script>

<style scoped>
.ant-layout-content {
  min-height: 120px;
  line-height: 120px;
}
</style>
