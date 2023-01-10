const express = require("express");
const path = require("path");
const MONGODB_URI =
  "mongodb+srv://sohaibrao:lahore123@cluster0.5nz1pmh.mongodb.net/shop";
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const User = require("./models/user");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require('connect-flash');


const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs"); // template engine
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//middleware
// we can use app.get ->for the exact path , app.post , app.path ----> the app.use() have all the requests..
app.use(bodyParser.urlencoded({ extended: false })); // for receiving data from the browser
app.use(express.static(path.join(__dirname, "public"))); // serving files staticlly => it is showing public only
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);


app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});


app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
  });
  

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "page not found" }); // using templating engine for randring dynamic content
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("Connected!!!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Not Connected!!  ", err);
  });
