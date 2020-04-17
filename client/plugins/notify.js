'use strict'
export default ({ store }, inject) => {
  inject('notify', function (playload) {
    store.commit('snackbar/show', playload)
  })
}
