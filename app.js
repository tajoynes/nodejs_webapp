//  initialize required constiables
const express = require("express");
const debug = require("debug")("app");
const chalk = require("chalk");
const morgan = require("morgan");
const path = require("path");
const sql = require("mssql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

//  Azure sql server configurations
//  ENV variables used to connect to the Azure sql database
const sqlConfig = {
  user: "libraryadmin",
  password: "$9Bermuda",
  database: "NodeLibraryApp",
  server: "nodelibraryapp.database.windows.net",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

//  application middleware
sql.connect(sqlConfig).catch((err) => {
  debug(err);
});
app.use(morgan("tiny"));
//  Pulls out post adding it to the post body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "library" }));

//
require("./src/config/passport")(app);
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js"))
);
app.set("views", "./src/views");
app.set("view engine", "ejs");

const nav = [
  { link: "/books", title: "Books" },
  { link: "/authors", title: "Authors" },
];

const bookRouter = require("./src/routes/bookRoutes")(nav);
const adminRouter = require("./src/routes/adminRoutes")(nav);
const authRouter = require("./src/routes/authRoutes")(nav);

app.use("/books", bookRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);

//  serve static html file
app.get("/", (req, res) => {
  //   res.sendFile(path.join(__dirname, "views", "index.html"));
  res.render("index", {
    title: "Library",
    nav: [
      { link: "/books", title: "Books" },
      { link: "/authors", title: "Authors" },
    ],
  });
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
