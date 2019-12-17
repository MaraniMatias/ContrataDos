#!/usr/bin/env node
process.title = "ContrataDos";
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const getMongoURL = require("../src/utilities/getMongoURL");
const getLocalIP = require("../src/utilities/getLocalIP");
const Agenda = require("../src/utilities/agendaTask");
const app = require("../src/server");

function startServer() {
  const mongoURL = getMongoURL();
  console.log("MongoDB URL", mongoURL);
  const mongooseOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  };
  mongoose.connect(mongoURL, mongooseOptions, err => {
    if (err) {
      console.error("Error al conectar a la base de datos: " + err);
      process.exit();
    } else {
      console.log(`Conexón establecida con '${mongoose.connections[0].name}'`);
      app.listen(PORT, "0.0.0.0", () => {
        if (!cluster.isMaster) {
          console.info(
            `Express server running as Worker ${cluster.worker.id} running @ process ${cluster.worker.process.pid}`
          );
        }
        Agenda.start();
        getLocalIP();
      });
    }
  });
}

if (process.env.NODE_ENV !== "production") {
  startServer();
} else {
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", worker => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork(); // Create a New Worker, If Worker is Dead
    });
  } else {
    console.log(`This process is pid ${process.pid}`);
    console.log(`The parent process is pid ${process.ppid}`);
    startServer();
  }
}
