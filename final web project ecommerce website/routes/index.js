var express = require("express");
var router = express.Router();
var Product = require("../models/Product");
var Contact = require("../models/contact");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* GET home page. */
router.get("/login", function (req, res, next) {
  return res.render("site/login");
});

router.post("/login", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("danger", "User with this email not present");
    return res.redirect("/login");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    req.session.user = user;
    req.flash("success", "Logged in Successfully");
    return res.redirect("/");
  } else {
    req.flash("danger", "Invalid Password");
    return res.redirect("/login");
  }
});


router.get("/register", function (req, res, next) {
  return res.render("site/register");
});


router.get("/logout", async (req, res) => {
  req.session.user = null;
  console.log("session clear");
  return res.redirect("/login");
});

router.get('/shop', async function(req,res,next){
  let products = await Product.find();
  return res.render("site/shop", {
    pagetitle: "Shop",
    products,
  });
});


router.post("/register", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "User with given email already registered");
    return res.redirect("/register");
  }
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();
  return res.redirect("/login");
});


router.get('/detail/:productId', function(req, res, next){
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      console.log("Details Product: ", product);
      res.render("site/detail", {
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get("/contact-us", function (req, res, next) {
  return res.render("site/contact", { layout: "layout" });
});


router.post('/contact-submit' , function(req,res,next){
  const contact = new Contact(req.body);
  console.log()
   contact.save().then(ok=>{
    return res.redirect("/");
   });
   res.redirect("/contact-us")
});

router.get("/", async function (req, res, next) {
  let products = await Product.find();
  return res.render("site/homepage", {
    pagetitle: "Awesome Products",
    products,
  });
});

module.exports = router;
