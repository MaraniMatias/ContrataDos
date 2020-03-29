import http from '../api/http'

export const state = () => ({
  user: {},
  userId: null,
})

export const getters = {
  isLoggedIn: (state) => !!state.userId,
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_USER_ID(state, id) {
    state.userId = id
  },
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    if (req.session?.passport?.user) {
      commit('SET_USER_ID', req.session.passport.user)
      //  commit('SET_USER', req.session.authUser)
    }
  },
  async login({ commit }, { email, password }) {
    try {
      const { data } = await http.post('/api/auth/login', { email, password })
      commit('SET_USER_ID', data._id)
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
    commit('SET_USER_ID', null)
    commit('SET_USER', {})
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
