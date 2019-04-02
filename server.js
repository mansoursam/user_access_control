const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const PORT = process.env.PORT || 3001;
const expressValidator = require("express-validator");

mongoose
  .connect("YOUR KEY", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("mlab connected");
  });
//setup express session
app.use(
  session({
    secret: "sam",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
    resave: false,
    saveUninitialized: true
  })
);
//setup hbs
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use("/", require("./routes/index"));
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
