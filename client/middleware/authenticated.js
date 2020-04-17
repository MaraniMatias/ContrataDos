import Token from '~/api/Token'

export default function ({ store, redirect, route }) {
  // If the user is not authenticated
  if (route.name !== 'login' && (!store.state.user._id || !Token.get())) {
    return redirect('/login')
  }
}
