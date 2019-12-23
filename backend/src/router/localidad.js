const express = require("express");
const restify = require("express-restify-mongoose");
const router = express.Router();
const { block } = require("./../utilities/router");
const { Localidad } = require("./../models/localidad");

restify.serve(router, Localidad, {
  preDelete: block,
  preUpdate: block,
  postUpdate: block,
  preCreate: block,
  postCreate: block,
  preRead: []
});

module.exports = router;
