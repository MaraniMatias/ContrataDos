<template>
  <v-app ng-cloak>
    <v-app-bar v-if="hideAppBar" fixed app color="primary" dark>
      <v-toolbar-title>
        <v-btn nuxt text to="/" color="transparent">
          <logo />
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <v-layout justify-end align-center>
        <v-btn nuxt text to="/perfil">Agenda</v-btn>
        <v-btn nuxt text to="/inspire">Trabajos</v-btn>
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
              <img src="~/assets/avatars/elyse.png" />
            </v-avatar>
          </template>
          <v-list class="mt-2">
            <v-list-item :to="{ name: 'operador-perfil' }">
              <v-list-item-title>
                <h3
                  class="my-0"
                  v-text="user.nombre + ' ' + user.apellido"
                ></h3>
              </v-list-item-title>
            </v-list-item>
            <v-list-item nuxt to="/perfil">Perfil</v-list-item>
            <v-list-item @click="cerrarSesion()">Cerrar Sesión</v-list-item>
          </v-list>
        </v-menu>
      </v-layout>
    </v-app-bar>
    <v-app-bar v-else fixed app color="transparent" class="elevation-0">
      <v-layout justify-end>
        <v-icon size="32" class="ml-2" style="cursor: pointer;">
          account_circle
        </v-icon>
      </v-layout>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <copyright />
    </v-footer>
  </v-app>
</template>

<script>
import Logo from '~/components/Logo.vue'
import Copyright from '~/components/Copyright.vue'

export default {
  components: { Copyright, Logo },
  data: () => ({
    fixed: false,
    user: { nombre: 'Matias', apellido: 'marani' },
  }),
  computed: {
    hideAppBar() {
      return this.$route.name !== 'index'
    },
  },
}
</script>

<style>
ng-cloak {
  display: none !important;
}
</style>
