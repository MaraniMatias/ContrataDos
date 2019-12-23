const express = require("express");
const restify = require("express-restify-mongoose");
const router = express.Router();
const { routAuth } = require("./../utilities/passport");
const { deleteProp, sendRes, block } = require("./../utilities/router");
const { checkErrors, check } = require("./../utilities/checkProps");
// const Batch = require("./../utilities/agendaTask");
const { Persona } = require("./../models/persona");

function isEmailUnique(req, res, next) {
  let entity = req.body;
  const error = checkErrors([check(entity, "email").isEmail()]);
  if (error.length > 0) {
    return sendRes(res, 400, null, "Body validation errors", error);
  } else {
    Persona.findOne({ email: entity.email, deleted: false }, (err, doc) => {
      if (err) {
        return sendRes(res, 500, null, "error", err.message);
      } else {
        if (!doc || doc._id.equals(entity._id)) {
          next();
        } else {
          return sendRes(res, 400, null, "Bad request", "Ese email ya esta registrado.");
        }
      }
    });
  }
}

restify.serve(router, Persona, {
  preDelete: routAuth.isLogin, // TODO, solo borrar lo de el
  preUpdate: [routAuth.isLogin, deleteProp, isEmailUnique],
  postUpdate: [],
  preCreate: block,
  postCreate: block,
  preRead: [
    function(req, _, next) {
      req.query.select = "-password";
      if (!req.erm.query) req.erm.query = {};
      if (!req.erm.query.select) req.erm.query.select = {};
      req.erm.query.select.password = 0;
      next();
    }
  ]
});

module.exports = router;
