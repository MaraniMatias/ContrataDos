import http from '../utils/http'

export const state = () => ({
  user: {},
})

export const getters = {
  userId: (state) => state.user._id,
  isLoggedIn: (state) => !!state.user._id,
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
    }
  },
  async login({ commit }, { email, password }) {
    try {
      const { data } = await http.post('/api/auth/login', { email, password })
      commit('SET_USER', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  async logout({ commit }) {
    await http.post('/api/auth/logout')
    commit('SET_USER', {})
  },
}
