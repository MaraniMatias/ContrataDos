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

app.all("*", (req, res, next) => {
  // FIXME parche para no renegar, no chequea la version de la app constancia and receta
  // Check app version
  const clientVersion = req.header("Client-Version") || "0.0.0";
  if (process.env.NODE_ENV === "development") next();
  else if (/^\/(admin|mobile|auth)\/.*$/.test(req.path) === false) next();
  else if (/^\/mobile\/aplicaciones\/constancia\/(.+\/.*)?$/.test(req.path)) next();
  else if (/^\/mobile\/aplicaciones\/receta\/(.+\/.*)?$/.test(req.path)) next();
  else if (clientVersion.split(".")[0] === pkg.version.split(".")[0]) next();
  else {
    sendRes(
      res,
      444,
      null,
      "Actualize la app de Municipio Verde",
      "This version app is olders"
    );
  }
});
app.all("/admin/*", routAuth.isResponsableMuniOrAdmin);
app.all("/mobile/*", (_, __, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log("\n>>> You need auth for access to mobile app routes <<<");
  }
  next();
});

// ------------------- Agregar routes ----------------------
// Inicializo las rutas
app.use("/admin", require("./routes/admin/provincias"));
app.use("/admin", require("./routes/admin/localidades"));
app.use("/admin", require("./routes/admin/export"));
app.use("/mobile", require("./routes/mobile/aplicaciones"));
app.use("/mobile", require("./routes/mobile/cultivos"));
app.use("/mobile", require("./routes/mobile/lotes"));
app.use("/mobile", require("./routes/mobile/maquinaria"));
app.use("/mobile", require("./routes/mobile/municipios"));
app.use("/mobile", require("./routes/mobile/personas_empresas"));
app.use("/auth", require("./routes/auth"));

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
fs.mkdir(path.join(__dirname, "image"), err => {
  if (err) console.log(err.errno === -17 ? "/image dir created" : err);
  fs.mkdir(path.join(__dirname, "image", "recetas"), err => {
    if (err) console.log(err.errno === -17 ? "/image/recetas dir created" : err);
  });
});

module.exports = app;
