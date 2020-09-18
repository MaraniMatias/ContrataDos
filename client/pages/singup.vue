<template>
  <v-layout column mb-2 px-2 justify-start fill-height>
    <v-layout justify-center align-center>
      <v-flex xs12 md6 lg4 mb-12>
        <CardForm @submit="authLocal">
          <template v-slot:header>Crear Cuenta</template>
          <template v-slot:default="{ rules }">
            <v-layout wrap align-center>
              <v-flex xs12 md6 py-0>
                <v-text-field
                  v-model.lazy="form.nombre"
                  index="0"
                  class="mt-0"
                  label="Nombre"
                  required
                  :rules="[
                    rules.required(),
                    rules.alphaSpaces(),
                    rules.min(3),
                    rules.max(20),
                  ]"
                />
              </v-flex>
              <v-flex xs12 md6 py-0>
                <v-text-field
                  v-model.lazy="form.apellido"
                  index="1"
                  class="mt-0"
                  label="Apellido"
                  required
                  :rules="[
                    rules.required(),
                    rules.alphaSpaces(),
                    rules.min(3),
                    rules.max(20),
                  ]"
                />
              </v-flex>
              <v-flex xs12 md6 py-0>
                <v-text-field
                  v-model.lazy="form.email"
                  label="E-mail"
                  index="2"
                  class="mt-0"
                  required
                  type="email"
                  :rules="[rules.required(), rules.email()]"
                  :readonly="loading"
                />
              </v-flex>
              <v-flex xs12 md6 py-0>
                <!--
                <v-select
                  v-model.lazy="form.roles"
                  index="3"
                  multiple
                  class="mt-0"
                  :items="listTipoUsuario"
                  item-text="label"
                  item-value="key"
                  hint="Se puede cambiar desde perfil."
                  label="Tipo de usuario"
                />
                -->
              </v-flex>
              <v-flex xs12 md6 py-0>
                <v-text-field
                  v-model.lazy="form.password"
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
              <v-flex xs12 md6 py-0>
                <v-text-field
                  v-model.lazy="form.password2"
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
                    rules.passwordEqual(form.password),
                  ]"
                  @click:append="showPass = !showPass"
                />
              </v-flex>
            </v-layout>
          </template>
          <template v-slot:message>
            <error :text="error" />
          </template>
          <template v-slot:actions>
            <v-btn text :disabled="loading" to="/login" replace>
              Cancelar
            </v-btn>
            <v-btn :disabled="loading" color="primary" type="submit">
              Crear cuenta
            </v-btn>
          </template>
        </CardForm>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <CardForm>
          <template v-slot:header> Activación de cuenta </template>
          <template>
            Hemos enviado un email a su dirección de correo electrónico para
            activar su cuenta.
          </template>
          <template v-slot:actions>
            <v-btn color="primary" to="/login">Aceptar</v-btn>
          </template>
        </CardForm>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { isMobile } from 'mobile-device-detect'
import { mapActions } from 'vuex'
import CardForm from '../components/CardForm'
import Token from '~/api/Token'
import { Roles, RolesLabel } from '~~/server/utilities/enums'

export default {
  components: { CardForm },
  data: () => ({
    error: '',
    loading: true,
    dialog: false,
    showPass: false,
    form: {
      nombre: null,
      apellido: null,
      email: null,
      roles: [Roles.CLIENTE],
      showPass: false,
      password: null,
      password2: null,
    },
  }),
  layout() {
    return isMobile ? 'mobile' : 'default'
  },
  computed: {
    listTipoUsuario: () => RolesLabel.filter(({ show }) => show),
  },
  created() {
    const token = this.$route.query.token
    if (token) Token.set(token)
    else if (!Token.get()) this.loading = false
    else this.loading = false
  },
  methods: {
    ...mapActions(['signup']),
    async authLocal(formValid) {
      if (!formValid) return
      this.loading = true
      const { error } = await this.signup(this.form)
      if (error) {
        this.error = error
      } else {
        this.dialog = true
      }
      this.loading = false
    },
  },
}
</script>
