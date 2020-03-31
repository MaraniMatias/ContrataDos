const colors = {
  info: 'info',
  success: 'success',
  error: 'red darken-3',
  warn: 'orange darken-3',
  none: 'grey darken-4',
}

function Snackbar({ text, type, timeout = 5000 }) {
  const obj = {
    color: colors[type] || colors.none,
    text,
    timeout: type === 'error' && timeout < 7000 ? 7000 : timeout,
    // button: { show: false },
  }

  /*
  if (typeof button === 'object') {
    obj.button.show = true
    obj.button.text = button.text
    obj.button.cb = button.cb
    obj.timeout = 7000
  }
  */
  return obj
}

export const state = () => ({
  alert: {},
})

export const getters = {}

export const mutations = {
  show(state, payload) {
    state.alert = new Snackbar(payload)
  },
}

export const actions = {}
