<template>
  <v-app ng-cloak>
    <v-app-bar
      v-if="!isLoggedIn"
      fixed
      app
      color="transparent"
      class="elevation-0"
    >
      <v-toolbar-title v-show="$route.name === 'login'">
        <v-btn nuxt text to="/" color="transparent">
          <img
            alt="logo"
            src="/logo.png"
            style="margin: 2px 0 0 0; height: 42px;"
          />
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <v-layout justify-end>
        <v-btn icon nuxt @click.stop="$router.replace('/login')">
          <v-icon size="32" style="cursor: pointer;">account_circle</v-icon>
        </v-btn>
      </v-layout>
    </v-app-bar>
    <v-app-bar v-else fixed app color="primary" dark>
      <v-toolbar-title>
        <v-btn nuxt text to="/" color="transparent">
          <logo />
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <v-layout justify-end align-center>
        <v-btn nuxt text to="/perfil">Agenda</v-btn>
        <v-btn nuxt text to="/trabajos">Trabajos</v-btn>
        <v-btn nuxt text to="/perfil">Perfil</v-btn>
        <!--
        <v-btn icon @click.stop="clipped = !clipped">
          <v-icon>mdi-application</v-icon>
        </v-btn>
        -->
        <v-menu offset-y bottom>
          <template v-slot:activator="{ on: menu }">
            <v-avatar
              size="32px"
              class="ml-2"
              style="cursor: pointer;"
              v-on="{ ...menu }"
            >
              <object data="/images/user_default.png" type="image/png">
                <img :src="user.picture" />
              </object>
            </v-avatar>
          </template>
          <v-list class="mt-2">
            <v-list-item @click="loginOut()">Cerrar Sesión</v-list-item>
          </v-list>
        </v-menu>
      </v-layout>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <copyright />
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Logo from '~/components/Logo.vue'
import Copyright from '~/components/Copyright.vue'

export default {
  components: { Copyright, Logo },
  data: () => ({
    fixed: false,
  }),
  computed: {
    ...mapGetters(['isLoggedIn']),
    user() {
      return this.$store.state.user || {}
    },
  },
  methods: {
    ...mapActions(['logout']),
    async loginOut() {
      await this.logout()
      this.$router.replace('/')
    },
  },
}
</script>

<style>
ng-cloak {
  display: none !important;
}
</style>
