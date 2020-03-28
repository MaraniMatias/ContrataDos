export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.user._id) {
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
