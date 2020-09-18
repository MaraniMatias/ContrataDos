<template>
  <v-app ng-cloak>
    <v-card class="overflow-hidden">
      <v-app-bar
        absolute
        :color="hideAppBar ? 'transparent' : 'primary'"
        :class="{ 'elevation-0': hideAppBar }"
        dense
        :dark="!hideAppBar"
        scroll-target="#scrolling-techniques-6"
      >
        <v-app-bar-nav-icon
          v-if="isLoggedIn"
          @click.native="drawer = !drawer"
        />
        <!-- <v-toolbar-title v-if="pageTitle" class="title" v-text="pageTitle" /> -->
        <v-btn
          v-if="showLogo"
          nuxt
          text
          to="/"
          color="transparent"
          tag="a"
          class="pa-0"
        >
          <Logo :bg="!hideAppBar" />
        </v-btn>
        <template v-if="!isLoggedIn">
          <v-spacer />
          <v-btn outlined class="mt-2" color="primary" @click="goToPerfil">
            Iniciar session
          </v-btn>
        </template>
      </v-app-bar>
      <v-navigation-drawer
        v-if="isLoggedIn"
        v-model="drawer"
        :hide-overlay="hideOverlay"
        class="grey lighten-4"
        width="250"
        clipped
        fixed
        app
      >
        <v-list class="pa-0" two-line>
          <v-list-item to="/perfil">
            <v-list-item-avatar>
              <Avatar :src="user.picture" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <p class="title mb-0">{{ menuPerfil }}</p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list class="grey lighten-4 pt-0">
          <v-list-item nuxt to="/">
            <v-list-item-action>
              <v-icon>search</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Buscar</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item nuxt to="/agenda">
            <v-list-item-action>
              <v-icon>today</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Agenda</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item nuxt to="/trabajos">
            <v-list-item-action>
              <v-icon>work</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Trabajos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item nuxt to="/markers">
            <v-list-item-action>
              <v-icon>bookmark</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Marcadores</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item nuxt to="/perfil">
            <v-list-item-action>
              <v-icon>account_circle</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Perfil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item herf="/docs">
            <v-list-item-action>
              <v-icon>help</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Ayuda</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="loginOut()">
            <v-list-item-action>
              <v-icon>power_settings_new</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Cerrar Sesión</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div class="mb-12 hidden-lg-and-up"></div>
      </v-navigation-drawer>
      <v-sheet
        id="scrolling-techniques-6"
        class="overflow-y-auto"
        max-height="100vh"
        style="min-height: 100vh"
      >
        <v-container class="fill-height" fluid style="height: 100vh">
          <nuxt />
        </v-container>
      </v-sheet>
    </v-card>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import Avatar from '../components/Avatar'
import Logo from '~/components/Logo.vue'
import camelCase from '~~/server/utilities/capitalizeWords'

export default {
  components: { Avatar, Logo },
  data: () => ({
    collapseOnScroll: true,
    drawer: false,
  }),
  computed: {
    ...mapState(['user']),
    ...mapGetters(['isLoggedIn']),
    hideOverlay() {
      return this.$vuetify.breakpoint.smAndUp
    },
    user() {
      return this.$store.state.user
    },
    showLogo() {
      return this.$route.name !== 'index'
    },
    hideAppBar() {
      return ['index', 'login', 'loginout', 'singup'].includes(this.$route.name)
    },
    menuPerfil() {
      const nombre = this.user.nombre || ''
      return camelCase(this.user.razon_social ? this.razon_social : nombre)
    },
    pageTitle() {
      if (this.hideAppBar) return ''
      return this.$route.meta?.name || 'ContrataDos'
    },
  },
  created() {},
  mounted() {
    const self = this
    this.getMe().then(function ({ data }) {
      if (data && ['login', 'loginout', 'singup'].includes(self.$route.name)) {
        self.$router.replace('/trabajos')
      }
    })
  },
  methods: {
    ...mapActions(['logout', 'getMe']),
    async loginOut() {
      await this.logout()
      this.$router.replace('/loginout')
    },
    goToPerfil() {
      if (this.$route.name !== 'login') {
        this.$router.replace('/login')
      }
    },
  },
}
</script>

<style>
.theme--light.v-list .v-list__group__header:hover,
.theme--light.v-list .v-list__tile--highlighted,
.theme--light.v-list .v-list__tile--link:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>
