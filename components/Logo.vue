<template functional>
  <img :src="props.bg ? '/logo_bg.png' : '/logo.png'" class="logo" />
</template>

<style scoped>
.logo {
  margin: 2px 0 0 0;
  height: 42px;
}
</style>
