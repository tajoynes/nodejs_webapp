//  Connecting to azure sql server
//  Queries made to azure sql server retrieve books

const express = require("express");
const bookRouter = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const sql = require("mssql");
const debug = require("debug")("app:bookRoutes");

function router(nav) {
  bookRouter.route("/").get((req, res) => {
    const url = "mongodb://127.0.0.1:27017";
    const dbName = "libraryApp";

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug("Connected to mongo server...");

        const db = client.db(dbName);

        const dbColl = await db.collection("books");
        const books = await dbColl.find().toArray();

        res.render("bookListView", { nav, title: "Library", books });
      } catch (err) {
        debug("Error has occurred..." + err);
      }

      client.close();
    })();
  });
  bookRouter.route("/:id").get((req, res) => {
    const { id } = req.params;
    const url = "mongodb://127.0.0.1:27017";
    const dbName = "libraryApp";

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug("Connected to mongo server...");

        const db = client.db(dbName);

        const dbColl = await db.collection("books");
        const book = await dbColl.findOne({ _id: new ObjectId(id) });
        debug(book);
        res.render("bookView", { nav, title: "Library", book });
      } catch (err) {
        debug(err);
      }
      client.close();
    })();
  });

  // // Connecting and using Azure SQL server to query books from database
  //   bookRouter.route("/").get((req, res) => {
  //     (async function query() {
  //       const request = new sql.Request();
  //       const result = await request.query("select * from books");
  //       debug(result);
  //       res.render("bookListView", {
  //         title: "Library",
  //         nav,
  //         books: result.recordset,
  //       });
  //     })();
  //   });
  //   bookRouter
  //     .route("/:id")
  //     .all((req, res, next) => {
  //       (async function query() {
  //         const { id } = req.params;
  //         const request = new sql.Request();
  //         const { recordset } = await request
  //           .input("id", sql.Int, id)
  //           .query("select * from books where id =@id");
  //         req.book = recordset[0];
  //         next();
  //       })();
  //     })
  //     .get((req, res) => {
  //       res.render("bookView", {
  //         title: "Library",
  //         nav,
  //         book: req.book,
  //       });
  //     });
  //   bookRouter.route("/authors").get((req, res) => {
  //     res.send("authors page here");
  //   });

  return bookRouter;
}

module.exports = router;
