const express = require("express");
const { MongoClient } = require("mongodb");
const passport = require("passport");
const debug = require("debug")("app:authRoutes");

const authRouter = express.Router();

function router(nav) {
  authRouter.route("/signUp").post((req, res) => {
    //  create user
    const { username, password } = req.body;
    const url = "mongodb://127.0.0.1:27017";
    const dbName = "libraryApp";

    (async function addUser() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug("Connection to server established...");

        const db = client.db(dbName);

        const userCol = db.collection("users");
        const user = { username, password };
        const result = await userCol.insertOne(user);
        debug(result);
        req.login(result.insertedId, () => {
          res.redirect("/auth/profile");
        });
      } catch (err) {
        debug(err);
      }
    })();
  });
  authRouter
    .route("/signin")
    .get((req, res) => {
      res.render("signin", {
        nav,
        title: "Sign In",
      });
    })
    .post(
      passport.authenticate("local", {
        successRedirect: "/auth/profile",
        failureRedirect: "/",
      })
    );
  authRouter
    .route("/profile")
    // .all((req, res, next) => {
    //   if (req.user) {
    //     next();
    //   } else {
    //     res.redirect("/");
    //   }
    // })
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
}

// function router() {
//   authRouter.route("/signUp").post((req, res) => {
// //  create user
// const { username, password } = req.body;
// const url = "mongodb://127.0.0.1:27017";
// const dbName = "libraryApp";

// (async function addUser() {
//   let client;
//   try {
//     client = await MongoClient.connect(url);
//     debug("Connection to server established...");

//     const db = client.db(dbName);

//     const userCol = db.collection("users");
//     const user = { username, password };
//     const result = userCol.insertOne(user);
//     debug(result);
//   } catch (err) {
//     debug(err);
//   }
// })();

//     debug(req.body);
//     //  log user in
//     req.login(req.body, () => {
//       res.redirect("/auth/profile");
//     });
//     res.json(req.body);
//   });
//   authRouter.route("/profile").get((req, res) => {
//     res.json(req.user);
//   });
//   return authRouter;
// }

module.exports = router;
