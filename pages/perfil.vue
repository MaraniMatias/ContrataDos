<template>
  <a-layout>
    <a-layout-header style="background: #086b94;">
      <a-row style="max-width: 1300px; margin: auto; padding: 0 20px;">
        <a-row type="flex" justify="space-between" class="header">
          <a-row type="flex" :span="6" justify="start" style="width: 300px;">
            <a-col>
              <img alt="logo" src="~/assets/logo.jpeg" class="logo" />
            </a-col>
          </a-row>
          <a-row type="flex" :span="12" justify="center">
            <a-col>
              <a-input-search
                placeholder="Buscar profesional"
                style="width: 100%;"
                @search="onSearch"
              />
            </a-col>
          </a-row>
          <a-row type="flex" :span="6" justify="end" style="width: 300px;">
            <a-col>
              <a-avatar
                icon="user"
                style="margin-left: 12px; margin-top: -4px;"
              />
            </a-col>
          </a-row>
        </a-row>
      </a-row>
    </a-layout-header>
    <a-layout-content class="app-content">
      <a-layout style="padding: 24px 0; background: #fff;">
        Content
      </a-layout>
    </a-layout-content>
    <a-layout-footer>
      <Copyright />
    </a-layout-footer>
  </a-layout>
</template>

<script>
export default {
  components: {},
}
</script>

<style scoped>
img.logo {
  margin: 2px 0 0 0;
  height: 42px;
}
</style>
