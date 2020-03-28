export const state = () => ({
  token: null,
})

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    // localStorage.setItem('_t', token)
  },
  DELETE_TOKEN(state) {
    // localStorage.removeItem('_t')
    state.token = null
  },
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  // TODO save user on session
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
    }
    if (req.session && req.session.token) {
      commit('SET_TOKEN', req.session.token)
    }
  },
}
