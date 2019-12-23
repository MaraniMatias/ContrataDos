const express = require("express");
const restify = require("express-restify-mongoose");
const router = express.Router();
const { routAuth } = require("./../utilities/passport");
const { deleteProp } = require("./../utilities/router");
// const Batch = require("./../utilities/agendaTask");
const { Agenda } = require("./../models/agenda");

restify.serve(router, Agenda, {
  preDelete: routAuth.isLogin, // TODO, solo borrar lo de el
  preUpdate: [routAuth.isLogin, deleteProp], // TODO, solo borrar lo de el
  postUpdate: [],
  preCreate: routAuth.isLogin, // TODO, solo borrar lo de el
  postCreate: [],
  preRead: routAuth.isLogin // TODO, solo borrar lo de el
});

module.exports = router;
