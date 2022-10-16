const express = require("express");
const debug = require("debug")("app:adminRoutes");
const { MongoClient } = require("mongodb");
const adminRouter = express.Router();

const books = [
  {
    title: "Yossi & Jagger",
    genre: "Drama|Romance",
    author: "Niki Klainer",
    read: false,
  },
  {
    title: "Caliber 9",
    genre: "Action|Crime|Thriller",
    author: "Brook Leigh",
    read: true,
  },
  {
    title: "Salmon Fishing in the Yemen",
    genre: "Comedy|Drama|Romance",
    author: "Krishna Derrick",
    read: false,
  },
  {
    title: "Frances",
    genre: "Drama",
    author: "Stanfield Agneau",
    read: false,
  },
  {
    title: "Frances",
    genre: "Drama",
    author: "Stanfield Agneau",
    read: false,
  },
  {
    title: "Zeisters (Fat Guy Goes Nutzoid)",
    genre: "Comedy",
    author: "Abbie Narracott",
    read: false,
  },
  {
    title: "Stories We Tell",
    genre: "Documentary",
    author: "Jamey Lawlan",
    read: false,
  },
  {
    title: "Age of Tomorrow",
    genre: "Action|Sci-Fi|Thriller",
    author: "Regan MacGowing",
    read: false,
  },
  {
    title: "Helter Skelter",
    genre: "Action|Crime|Drama|Horror",
    author: "Tybie Garett",
    read: false,
  },
  {
    title: "Helter Skelter",
    genre: "Action|Crime|Drama|Horror",
    author: "Tybie Garett",
    read: false,
  },
  {
    title: "Intimate Relations",
    genre: "Comedy",
    author: "Sanders Meddows",
    read: false,
  },
  {
    title: "Too Shy to Try (Je suis timide... mais je me soigne)",
    genre: "Comedy",
    author: "Rosanne Boothby",
    read: false,
  },
];

function router(nav) {
  adminRouter.route("/").get((req, res) => {
    const url = "mongodb://127.0.0.1:27017";
    const dbName = "libraryApp";

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug("Connected correct to server");

        const db = client.db(dbName);

        const response = await db.collection("books").insertMany(books);
        res.json(response);
      } catch (err) {
        debug(err);
      }
      client.close();
    })();
  });
  return adminRouter;
}

module.exports = router;
