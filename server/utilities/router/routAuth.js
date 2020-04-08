const { sendRes } = require('.')

const isLogin = [
  (req, res, next) => {
    if (req.user) {
      return next()
    } else {
      return sendRes(res, 401, null, 'Unauthorized', 'No tienes permiso')
    }
  },
]

module.exports = { isLogin }
