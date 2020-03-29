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
        <v-btn icon nuxt @click="goToPerfil">
          <v-icon size="32" style="cursor: pointer;">account_circle</v-icon>
        </v-btn>
      </v-layout>
    </v-app-bar>
    <v-app-bar v-else fixed app color="primary" dark>
      <v-toolbar-title>
        <v-btn nuxt text to="/" color="transparent">
          <Logo />
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <v-layout justify-end align-center>
        <v-btn nuxt text to="/agenda">Agenda</v-btn>
        <v-btn nuxt text to="/trabajos">Trabajos</v-btn>
        <v-btn nuxt text to="/perfil">Perfil</v-btn>
        <!--
        <v-btn icon @click.stop="clipped = !clipped">
          <v-icon>mdi-application</v-icon>
        </v-btn>
        -->

        <v-menu offset-y bottom>
          <template v-slot:activator="{ on: menu }">
            <Avatar class="ml-2" :src="user.picture" :on="menu" />
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
import Avatar from '~/components/Avatar.vue'
import Copyright from '~/components/Copyright.vue'

export default {
  components: { Copyright, Avatar, Logo },
  data: () => ({
    fixed: false,
  }),
  computed: {
    ...mapGetters(['isLoggedIn']),
    user() {
      return this.$store.state.user || {}
    },
  },
  created() {
    this.getMe()
  },
  methods: {
    ...mapActions(['logout', 'getMe']),
    async loginOut() {
      await this.logout()
      this.$router.replace('/')
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
ng-cloak {
  display: none !important;
}
</style>
