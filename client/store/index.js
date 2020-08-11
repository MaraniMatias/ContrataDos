//  process.server
//  process.client

import http from '~/api/http'
import Token from '~/api/Token'
import { Roles } from '~~/server/utilities/enums'

export const state = () => ({
  user: {},
})

export const getters = {
  isLoggedIn: (state) => !!state.user._id,
  isAProfessional: (state) => state.user.roles?.includes(Roles.PROFESIONAL),
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  // nuxtServerInit({ commit }, { req }) {commit('SET_TOKEN', req.session.passport.user)},
  async login({ commit }, { email, password }) {
    try {
      const { data } = await http.post('/api/auth/login', { email, password })
      if (data.email_verified) {
        commit('SET_USER', data)
      }
      return { data }
    } catch (resp) {
      return {
        error:
          resp.status === 401 &&
          (resp.error || 'Contraseña o email no valido.'),
      }
    }
  },
  async signup(_, user) {
    try {
      const { data } = await http.post('/api/auth/signup', user)
      return { data }
    } catch ({ error }) {
      return { error }
    }
  },
  async logout({ commit }) {
    try {
      const { data } = await http.post('/api/auth/logout')
      Token.deleteAll()
      commit('SET_USER', {})
      return { data }
    } catch ({ error }) {
      return { error }
    }
  },
  async sendEmail(_, { email }) {
    try {
      const { data } = await http.post('/api/auth/sendemail', { email })
      return { data }
    } catch ({ error }) {
      return { error }
    }
  },
  async signupVerification(_, { email, token }) {
    try {
      const { data } = await http.post('/api/auth/signup/verification', {
        email,
        token,
      })
      return { data }
    } catch ({ error }) {
      return { error }
    }
  },
  async forgetPassword(_, { email }) {
    try {
      const { data } = await http.post('/api/auth/forgetpassword', { email })
      return { data }
    } catch ({ error }) {
      return { error }
    }
  },
  async changeForgetPassword(_, { email, password, token }) {
    try {
      const { data } = await http.post('/api/auth/forgetpassword/change', {
        email,
        token,
        password,
      })
      return { data }
    } catch ({ error }) {
      return { error }
    }
  },
  async getMe({ commit }) {
    try {
      // if (Token.get()) {
      const { data, error } = await http.get('/api/auth/me')
      commit('SET_USER', data)
      return { data, error }
      // } else return {}
    } catch (error) {
      return error
    }
  },
}
