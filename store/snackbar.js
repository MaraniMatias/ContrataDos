const colors = {
  info: 'info',
  success: 'success',
  error: 'red darken-3',
  warn: 'orange darken-3',
}

function Snackbar({ text, color, timeout = 5000, button }) {
  const obj = {
    color: colors[color],
    show: true,
    text,
    timeout: color === 'error' && timeout < 7000 ? 7000 : timeout,
    button: { show: false },
  }

  if (typeof button === 'object') {
    obj.button.show = true
    obj.button.text = button.text
    obj.button.cb = button.cb
    obj.timeout = 7000
  }
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
