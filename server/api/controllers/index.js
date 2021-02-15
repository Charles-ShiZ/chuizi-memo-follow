const models = require('../models')
const folders = require('./modules/folders')(models)
const notes = require('./modules/notes')(models)
const login = require('./modules/login')(models)
const controllers = {}
const sources = [folders,notes,login]
Object.assign(controllers, ...sources)

module.exports = controllers