import Token from '~/api/Token'

export default function ({ store }) {
  // If the user is not authenticated
  if (store.getters.isLoggedIn === false) {
    if (Token.get()) {
      return store.dispatch('getMe')
    }
  }
}
