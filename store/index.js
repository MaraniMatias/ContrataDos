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
  isAProfessional: (state) => state.user.roles?.includes(Roles.PROFECIONAL),
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
    } catch ({ status }) {
      return {
        error: status === 401 && 'Contraseña o email erroneas',
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
    } catch (e) {
      return { error: 'Error' }
    }
  },
  async sendEmail(_, { email }) {
    try {
      const { data } = await http.post('/api/auth/sendemail', { email })
      return { data }
    } catch (e) {
      return { error: 'Error' }
    }
  },
  async getMe({ commit }) {
    try {
      // if (Token.get()) {
      const { data, error } = await http.get('/api/auth/me')
      commit('SET_USER', data)
      return { data, error }
      // } else return {}
    } catch (e) {
      return { error: 'Error' }
    }
  },
}
