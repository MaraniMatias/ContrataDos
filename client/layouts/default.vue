<template>
  <v-app ng-cloak>
    <Snackbar />
    <v-app-bar
      fixed
      app
      dense
      :color="hideAppBar ? 'transparent' : 'primary'"
      :dark="!hideAppBar"
      :class="{ 'elevation-0': hideAppBar }"
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
          <!--
          <v-btn nuxt text to="/perfil">
            <span>{{ user.nombre }}</span>
            <Avatar class="ml-4" :src="user.picture" />
          </v-btn>
          -->
          <!-- <v-btn nuxt text to="/perfil">Perfil</v-btn> -->
          <v-menu offset-y bottom>
            <template v-slot:activator="{ on: menu }">
              <v-btn nuxt text tp="/perfil" v-on="menu">
                <span>{{ user.nombre }}</span>
                <Avatar class="ml-4" :src="user.picture" />
              </v-btn>
            </template>
            <v-list class="mt-2">
              <v-list-item nuxt to="/perfil">Perfil</v-list-item>
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
