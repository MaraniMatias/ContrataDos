<template>
  <v-app ng-cloak>
    <Snackbar />
    <v-app-bar
      fixed
      app
      :color="hideAppBar ? 'transparent' : 'primary'"
      :dark="!hideAppBar"
      :class="{ 'elevation-0': hideAppBar }"
    >
      <v-btn nuxt text to="/" color="transparent">
        <Logo :bg="!hideAppBar" class="mb-2" />
      </v-btn>
      <v-toolbar-title>
        <h1 v-show="!hideAppBar" class="headline">{{ pageTitle }}</h1>
      </v-toolbar-title>
      <v-spacer />
      <v-layout justify-end align-center>
        <template v-if="isLoggedIn">
          <v-btn v-show="!hideAppBar" nuxt text icon to="/">
            <v-icon>search</v-icon>
          </v-btn>
          <v-btn nuxt text to="/agenda">Agenda</v-btn>
          <v-btn nuxt text to="/trabajos">Trabajos</v-btn>
          <v-btn v-if="isACliente" nuxt text to="/markers">
            Marcadores
          </v-btn>
          <v-btn nuxt text to="/perfil">Perfil</v-btn>
          <v-btn text href="/docs">Ayuda</v-btn>
          <!--
          <v-btn icon @click.stop="clipped = !clipped">
            <v-icon>mdi-application</v-icon>
          </v-btn>
          -->
          <v-menu offset-y bottom>
            <template v-slot:activator="{ on: menu }">
              <Avatar class="ml-4" :src="user.picture" :on="menu" />
            </template>
            <v-list class="mt-2">
              <v-list-item @click="loginOut()">Cerrar Sesión</v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <v-btn text href="/docs">Ayuda</v-btn>
          <v-btn depressed class="ml-4" color="primary" @click="goToPerfil">
            Iniciar session
          </v-btn>
        </template>
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

import Snackbar from '~/components/Snackbar.vue'
import Logo from '~/components/Logo.vue'
import Avatar from '~/components/Avatar.vue'
import Copyright from '~/components/Copyright.vue'

export default {
  components: { Copyright, Avatar, Logo, Snackbar },
  data: () => ({
    fixed: false,
  }),
  computed: {
    ...mapGetters(['isLoggedIn', 'isACliente']),
    user() {
      return this.$store.state.user || {}
    },
    hideAppBar() {
      return ['index', 'login', 'loginout', 'singup'].includes(this.$route.name)
    },
    pageTitle() {
      switch (this.$route.name) {
        case 'trabajos':
          return 'Trabajos'
        case 'agenda':
          return 'Agenda'
        case 'perfil-id':
          return 'Perfil'
        default:
          // console.log(this.$route.name)
          return ''
      }
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
  head() {
    const base = this.pageTitle ? this.pageTitle + ' - ' : ''
    return {
      title: base + 'ContrataDos',
    }
  },
}
</script>

<style>
ng-cloak {
  display: none !important;
}
</style>
