<template>
  <v-layout align-center justify-center fill-height>
    <v-layout v-show="!changeOk" column justify-center align-center>
      <v-flex xs12 md6 lg4 xl3>
        <CardForm @submit="summit">
          <template v-slot:header>Cambio de contraseña</template>
          <template v-slot:default="{ rules }">
            <p class="title">{{ email }}</p>
            <v-flex xs12 py-0>
              <v-text-field
                v-model.lazy="password"
                :append-icon="showPass ? 'visibility_off' : 'visibility'"
                hint="Ej: Qwerty123"
                index="4"
                class="mt-0"
                label="Contraseña"
                :type="showPass ? 'text' : 'password'"
                :rules="[rules.required(), rules.password()]"
                @click:append="showPass = !showPass"
              />
            </v-flex>
            <v-flex xs12 py-0>
              <v-text-field
                v-model.lazy="password2"
                :append-icon="showPass ? 'visibility_off' : 'visibility'"
                hint="Ej: Qwerty123"
                index="5"
                class="mt-0"
                label="Confirmar contraseña"
                name="password2"
                :type="showPass ? 'text' : 'password'"
                validate-on-blur
                :rules="[
                  rules.required(),
                  rules.password(),
                  rules.passwordEqual(password),
                ]"
                @click:append="showPass = !showPass"
              />
            </v-flex>
          </template>
          <template v-slot:message>
            <error :text="error" />
          </template>
          <template v-slot:actions>
            <v-btn :disabled="loading" color="primary" type="submit">
              Cambiar
            </v-btn>
          </template>
        </CardForm>
      </v-flex>
    </v-layout>
    <v-layout v-show="changeOk" column justify-center align-center>
      <v-icon size="94">check</v-icon>
      <p>Se ha cambiado la contraseña</p>
      <v-btn rounded color="primary" outlined x-large to="/login">
        Iniciar section
      </v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
import { isMobile } from 'mobile-device-detect'
import { mapActions } from 'vuex'
import CardForm from '../components/CardForm'

export default {
  components: { CardForm },
  asyncData({ query = {}, redirect }) {
    const { token, email } = query
    if (!token || !email) redirect('/login')
    return query
  },
  data: () => ({
    error: '',
    showPass: false,
    password: '',
    password2: '',
    email: '',
    loading: false,
    changeOk: false,
  }),
  layout() {
    return isMobile ? 'mobile' : 'default'
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    ...mapActions(['login', 'changeForgetPassword']),
    async summit(formValid) {
      if (!formValid) return
      this.loading = true
      const { error } = await this.changeForgetPassword({
        token: this.token,
        email: this.email,
        password: this.password,
      })
      if (error) {
        this.error = error
      } else {
        this.changeOk = true
      }
      this.loading = false
    },
  },
}
</script>
