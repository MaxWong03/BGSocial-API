const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

const db = require("./db");

//Posible routes
const gamesRouter = require("./routes/games.js");
const usersRouter = require("./routes/users.js");
const eventsRouter = require("./routes/events");
const playsRouter = require("./routes/plays");
// function read(file) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(
//       file,
//       {
//         encoding: "utf-8"
//       },
//       (error, data) => {
//         if (error) return reject(error);
//         resolve(data);
//       }
//     );
//   });
// }

module.exports = function application(
  // ENV,
  // actions = { updateAppointment: () => {} }
) {
  app.use(cors());
  app.use(helmet());
  app.use(bodyparser.json());

  // app.use("/api", appointments(db, actions.updateAppointment));
  app.use("/api/", gamesRouter(db));
  app.use("/api/users", usersRouter(db));
  app.use("/api/plays", playsRouter(db));
  app.use("/api/events", eventsRouter(db));
  app.use("/api/games", gamesRouter(db));

  // Maybe we will use it later for test 
  // if (ENV === "development" || ENV === "test") {
  //   Promise.all([
  //     read(path.resolve(__dirname, `db/schema/create.sql`)),
  //     read(path.resolve(__dirname, `db/schema/${ENV}.sql`))
  //   ])
  //     .then(([create, seed]) => {
  //       app.get("/api/debug/reset", (request, response) => {
  //         db.query(create)
  //           .then(() => db.query(seed))
  //           .then(() => {
  //             console.log("Database Reset");
  //             response.status(200).send("Database Reset");
  //           });
  //       });
  //     })
  //     .catch(error => {
  //       console.log(`Error setting up the reset route: ${error}`);
  //     });
  // }

  app.close = function() {
    return db.end();
  };

  return app;
};
