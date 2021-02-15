module.exports = (router) => {
  const controllers = require('../controllers')
  return {
    folders:require('./modules/folders')(router,controllers),
    notes:require('./modules/notes')(router,controllers),
    login:require('./modules/login')(router,controllers)
  }
}