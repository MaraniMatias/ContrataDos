const express = require("express");
const restify = require("express-restify-mongoose");
const router = express.Router();
const { block } = require("./../utilities/router");
const { Provincia } = require("./../models/provincia");

restify.serve(router, Provincia, {
  preDelete: block,
  preUpdate: block,
  postUpdate: block,
  preCreate: block,
  postCreate: block,
  preRead: []
});

module.exports = router;
