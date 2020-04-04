//  process.server
//  process.client

import http from '../api/http'

export const state = () => ({
  user: {},
  token: null,
})

export const getters = {
  isLoggedIn: (state) => !!state.user._id,
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, val) {
    state.token = val
  },
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    // console.log('nuxtServerInit', req.headers)
    if (req.session?.passport?.user) {
      commit('SET_TOKEN', req.session.passport.user) // user es _id
      //  commit('SET_USER', req.session.authUser)
    }
  },
  async login({ commit }, { email, password }) {
    try {
      const { data } = await http.post('/api/auth/login', { email, password })
      commit('SET_TOKEN', data._id)
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
      commit('SET_TOKEN', null)
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
