<template>
  <a-layout>
    <a-layout-header style="background: transparent;">
      <a-row type="flex" justify="end" style="width: 100%;">
        <a-col>
          <a-dropdown :placement="bottomCenter">
            <a-avatar
              icon="user"
              shape
              style="margin-left: 12px; margin-top: -4px;"
              @click="(e) => e.preventDefault()"
            />
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;">1st menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">2nd menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">3rd menu item</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content class="app-content">
      <a-row type="flex" :span="12" justify="center" style="width: 400px;">
        <img alt="logo" src="~/assets/logo.jpeg" class="logo" />
        <a-input-search
          style="margin: 12px 0px;"
          size="large"
          @search="onSearch"
        />
        <a-button>Buscar profesional</a-button>
      </a-row>
    </a-layout-content>
    <a-layout-footer>
      <Copyright />
    </a-layout-footer>
  </a-layout>
</template>

<script>
import Copyright from '~/components/Copyright'

export default {
  components: { Copyright },
  // data: () => ({}),
  // computed: {},
  // methods: {},
  // created(){},
  // mounted(){},
  // watch: {}
}
</script>
