const passport = require("passport");
const { Strategy } = require("passport-local");
const { MongoClient } = require("mongodb");
const debug = require("debug")("app:local.strategy");

function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      (username, password, done) => {
        const url = "mongodb://127.0.0.1:27017";
        const dbName = "libraryApp";

        (async function mongo() {
          let client;
          try {
            client = await MongoClient.connect(url);
            debug("Server connection established...");

            const db = client.db(dbName);
            const userCol = db.collection("users");

            const user = await userCol.findOne({ username });

            if (user.password === password) {
              done(null, user);
            } else {
              done(null, false);
            }
          } catch (err) {
            debug(err);
          }
          client.close();
        })();
      }
    )
  );
}

module.exports = localStrategy;
