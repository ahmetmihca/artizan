const express = require("express");
const apiRouter = require("./routes/apis");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const collectionRouter = require("./routes/collection");
const utilsRouter = require("./routes/utils");
const marketRouter = require("./routes/market");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
var session = require("express-session");
var cors = require("cors");
const formidable = require("formidable");

const app = express();
const port = 3001;

app.use(cors());

// app.all('/*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Content-Type", 'application/json');
//     next();
// });
app.use("/public", express.static("public"));
app.get("/", (req, res) => {
  return res.json("ok");
});
app.use(
  session({
    secret: "e15515da-7c02-48fe-bf21-0a964275c620",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30000 },
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "20mb",
  })
);
app.use(
  bodyParser.json({
    limit: "20mb",
  })
);

mongoose
  .connect(process.env["MONGO_URI"])
  .then(() => console.log("db connceted"))
  .catch((err) => console.log(err));

app.use("/api/v1", apiRouter);
app.use("/api/v1/u", utilsRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/collection", collectionRouter);
app.use("/api/v1/market", marketRouter);

app.use((error, req, res, next) => {
  // Bad request error
  console.log(error);
  res.status(400);
  res.send({
    "status code": "400",
    message: "bad request",
    request: error.body,
  });
});

// Print the routes
function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(
      print.bind(null, path.concat(split(layer.route.path)))
    );
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach(
      print.bind(null, path.concat(split(layer.regexp)))
    );
  } else if (layer.method) {
    console.log(
      "%s /%s",
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join("/")
    );
  }
}

function split(thing) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

app._router.stack.forEach(print.bind(null, []));

app.listen(port, () => {
  console.log(`Artizan backend listening on port ${port}`);
});
