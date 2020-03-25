const { routAuth } = require('./../utilities/passport')
const { deleteProp } = require('./../utilities/router')
// const Batch = require("./../utilities/agendaTask");
const { Trabajo } = require('./../models/trabajo')

module.exports = (restify, router) => {
  restify.serve(router, Trabajo, {
    preDelete: routAuth.isLogin, // TODO, solo borrar lo de el
    preUpdate: [routAuth.isLogin, deleteProp], // TODO, solo borrar lo de el
    postUpdate: [],
    preCreate: routAuth.isLogin, // TODO, solo borrar lo de el
    postCreate: [],
    preRead: routAuth.isLogin, // TODO, solo borrar lo de el
  })
  return router
}
