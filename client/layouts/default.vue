<template>
  <v-app ng-cloak>
    <Snackbar />
    <v-app-bar
      fixed
      app
      dense
      :color="hideAppBar ? 'transparent' : user.picture ? 'black' : 'primary'"
      :dark="!hideAppBar"
      :class="{ 'elevation-0': hideAppBar }"
      :src="hideAppBar ? '' : user.picture"
    >
      <v-btn nuxt text to="/" color="transparent">
        <Logo :bg="!hideAppBar" class="mb-2" />
      </v-btn>
      <template v-if="isLoggedIn">
        <v-layout justify-center align-center>
          <v-btn nuxt text to="/agenda">Agenda</v-btn>
          <v-btn nuxt text to="/trabajos">Trabajos</v-btn>
          <v-btn v-show="!hideAppBar" nuxt text icon to="/">
            <v-icon>search</v-icon>
          </v-btn>
          <v-spacer />
          <!-- <v-btn text href="/docs" target="_blank"> Ayuda</v-btn> -->
          <v-btn text href="/docs" target="_blank" icon>
            <v-icon>help_outline</v-icon>
          </v-btn>
          <v-btn nuxt text to="/markers">Marcadores</v-btn>
          <v-btn nuxt text to="/perfil">Perfil</v-btn>
          <v-menu offset-y bottom>
            <template v-slot:activator="{ on: menu }">
              <Avatar class="ml-4" :src="user.picture" :on="menu" />
            </template>
            <v-list class="mt-2">
              <v-list-item>{{ headline }}</v-list-item>
              <v-list-item @click="loginOut()">Cerrar Sesión</v-list-item>
            </v-list>
          </v-menu>
        </v-layout>
      </template>
      <template v-else>
        <v-spacer />
        <v-btn text href="/docs" target="_blank"> Ayuda</v-btn>
        <v-btn depressed class="ml-4" color="primary" @click="goToPerfil">
          Iniciar session
        </v-btn>
      </template>
    </v-app-bar>
    <v-container class="fill-height" fluid>
      <nuxt />
    </v-container>
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
import camelCase from '~~/server/utilities/capitalizeWords'

export default {
  components: { Copyright, Avatar, Logo, Snackbar },
  data: () => ({
    fixed: false,
  }),
  computed: {
    ...mapGetters(['isLoggedIn']),
    user() {
      return this.$store.state.user || {}
    },
    headline() {
      const nombre = this.user.nombre || ''
      const apellido = this.user.apellido || ''
      return camelCase(
        this.user.razon_social
          ? this.razon_social + `(${nombre} ${apellido})`
          : nombre + ' ' + apellido
      )
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
#app.v-application.v-application--is-ltr.theme--light
  div.v-application--wrap
  header.v-sheet.v-sheet--tile.theme--dark.v-toolbar.v-toolbar--dense.v-app-bar.v-app-bar--fixed.black
  div.v-toolbar__image
  div.v-responsive.v-image
  div.v-image__image.v-image__image--cover {
  opacity: 70%;
}
</style>
