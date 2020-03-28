<template>
  <v-layout justify-center>
    <v-layout v-show="!loading" column justify-center align-center>
      <v-flex xs12 md6 lg4 xl3>
        <CardForm hide-header @submit="authLocal">
          <template v-slot:header>Acceder</template>
          <template v-slot:default="{ rules }">
            <v-text-field
              v-model.lazy="email"
              label="E-mail"
              name="email"
              required
              type="email"
              :rules="[rules.required(), rules.email()]"
              :readonly="loading"
            />
            <v-text-field
              v-model.lazy="password"
              label="Contraseña"
              name="password"
              required
              :append-icon="showPass ? 'visibility_off' : 'visibility'"
              :type="showPass ? 'text' : 'password'"
              :rules="[rules.required()]"
              :readonly="loading"
              @click:append="showPass = !showPass"
            />
            <v-flex xs12 my-1 pb-2>
              <a :disabled="loading" href="#/forget-password">
                ¿Olvidaste tu contraseña?
              </a>
            </v-flex>
          </template>
          <template v-slot:message>
            <error :text="error" />
          </template>
          <template v-slot:actions>
            <v-btn text :disabled="loading" :to="{ path: '/register' }" replace>
              Crear Cuenta
            </v-btn>
            <v-btn :disabled="loading" color="primary" type="submit">
              Iniciar Sesión
            </v-btn>
          </template>
        </CardForm>
      </v-flex>

      <v-flex xs12 md6 lg4 mt-4>
        <v-flex>
          <v-layout align-center my-3>
            <v-divider class="mr-4" />
            <span>Iniciar Sección o Crear Cuenta</span>
            <v-divider class="ml-4" />
          </v-layout>
        </v-flex>

        <v-row align="center" justify="center">
          <v-col>
            <v-btn dark color="#3c66c4" depressed x-large @click="authFacebook">
              Facebook
            </v-btn>
          </v-col>
          <v-col>
            <v-btn dark color="#cf4332" depressed x-large @click="authGoogle">
              Google
            </v-btn>
          </v-col>
          <v-col>
            <v-btn dark color="#0077b5" depressed x-large @click="authLinkedin">
              Linkedin
            </v-btn>
          </v-col>
        </v-row>
      </v-flex>
    </v-layout>
    <v-layout v-show="loading" column justify-center align-center>
      <v-progress-circular :size="70" :width="7" color="grey" indeterminate />
      <p class="mt-4">Iniciando Sección</p>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import CardForm from '../components/CardForm'
// style="max-width: 400px; margin: auto;"

export default {
  middleware: 'authenticated',
  components: { CardForm },
  data: () => ({
    error: '',
    showPass: false,
    password: '',
    email: '',
    loading: false,
  }),
  computed: {},
  methods: {
    ...mapActions(['login']),
    authFacebook() {},
    authLinkedin() {},
    authGoogle() {
      this.loading = true
      window.location.replace(
        'api/auth/google'
        // 'Google',
        // 'width=500,height=600,scrollbars=no'
      )
    },
    authLocal() {
      this.login({ email: this.email, password: this.password })
    },
  },
}
</script>
>
