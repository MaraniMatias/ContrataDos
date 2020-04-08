//  process.server
//  process.client

import http from '~/api/http'
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
      commit('SET_USER', data)
      return { data }
    } catch ({ status }) {
      return {
        error: status === 401 && 'Contraseña o email erroneas',
      }
    }
  },
  async logout({ commit }) {
    try {
      await http.post('/api/auth/logout')
      commit('SET_USER', {})
    } catch (e) {
      return { error: 'Error' }
    }
  },
  async getMe({ commit }) {
    try {
      const { data, error } = await http.get('/api/auth/me')
      commit('SET_USER', data)
      return { data, error }
    } catch (e) {
      return { error: 'Error' }
    }
  },
}
