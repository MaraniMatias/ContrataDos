const fs = require('fs')

// Export the server middleware
module.exports = fs.readdirSync(__dirname).map((file) => {
  return {
    path: '/api/' + file.replace(/\.js$/, ''),
    handler: '~/server/router/' + file,
  }
})
