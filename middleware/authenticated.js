export default function ({ store, redirect, route }) {
  // If the user is not authenticated
  if (route.name !== 'login' && !store.state.userId) {
    return redirect('/login')
  }
}

/**
export default function ({ store, error }) {
  if (!store.state.authUser) {
    error({
      message: 'You are not connected',
      statusCode: 403
    })
  }
}
*/
