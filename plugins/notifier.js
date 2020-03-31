'use strict'
export default ({ store }, inject) => {
  inject('notifier', {
    show(playload) {
      store.commit('snackbar/show', playload)
    },
  })
}
