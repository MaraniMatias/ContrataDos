const pkg = require("../package");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const restify = require("express-restify-mongoose");
const { passport, routAuth } = require("./utilities/passport");
const { sendRes } = require("./utilities/router");
Object.assign = require("object-assign");

// Sobre escribe la informacion de las tecnologias usadas en backend
app.use(helmet());

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Parsear el cueropo de dato en POST
app.use(bodyParser.json({ limit: "12mb" }));
app.use(bodyParser.urlencoded({ limit: "12mb", extended: true }));
app.use(cors({ exposedHeaders: ["X-Total-Count"] }));
restify.defaults({
  totalCountHeader: true,
  onError: (err, req, res) =>
    sendRes(res, req.erm.statusCode, null, "Error", err.message, null)
});

// Lista las pediciones al servidor en consola
app.use(
  morgan(process.env.NODE_ENV === "development" ? "dev" : "combined", {
    skip: (_, res) => process.env.NODE_ENV !== "development" && res.statusCode < 400
  })
);

// app.all("*", routAuth.isLogin);
// app.all("*", (req, res, next) => {
//   if (process.env.NODE_ENV === "development") next();
//   else if (/^\/(admin|mobile|auth)\/.*$/.test(req.path) === false) next();
//   else sendRes(res, 404, null, "page no found", "");
// });

// ------------------- Agregar routes ----------------------
// Inicializo las rutas
app.use("/provincia", require("./router/provincia"));
app.use("/localidad", require("./router/localidad"));
app.use("/agenda", require("./router/agenda"));
app.use("/persona", require("./router/persona"));
app.use("/trabajo", require("./router/trabajo"));
app.use("/auth", require("./router/auth"));

// Static, FronEnd
app.use(express.static(path.join(__dirname, "public")));
// ------------------- Agregar routes ----------------------

// Get /status
const date = new Date();
app.use("/status", function(req, res) {
  // const p = { pid: process.pid, ppid: process.ppid };
  res.json({
    server: process.env.NODE_ENV,
    uptime: process.uptime(),
    email: process.env.EMAIL_NOMBRE,
    // process: process.env.NODE_ENV === "development" ? p : {},
    version: `v${pkg.version}`,
    started: date.toString()
  });
});

// Error
process.on("uncaughtException", function(err) {
  console.info(`This process is pid ${process.pid}`);
  console.info(`The parent process is pid ${process.ppid}`);
  console.error("Exception", err.stack);
});

// Make dir to save file
const path_image = ["perfil", "jobs"];
fs.mkdir(path.join(__dirname, "images"), err => {
  if (err) console.log(err.errno === -17 ? "/images dir created" : err);
  path_image.forEach(folder => {
    fs.mkdir(path.join(__dirname, "images", folder), err => {
      if (err) console.log(err.errno === -17 ? `/images/${folder} dir created` : err);
    });
  });
});

module.exports = app;
