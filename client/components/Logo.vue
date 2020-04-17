<template functional>
  <img :src="props.bg ? '/logo_bg.png' : '/logo.png'" class="logo" />
</template>

<style scoped>
.logo {
  height: 42px;
}
</style>
