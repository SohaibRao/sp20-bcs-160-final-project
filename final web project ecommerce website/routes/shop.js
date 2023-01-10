var express = require("express");
var router = express.Router();
var Product = require("../models/Product");
const User = require('../models/User');
const Order = require("../models/order");


router.get("/cart", async function (req, res, next) {
  let cart = req.cookies.cart;
  console.log("cart: " , cart);
  if (!cart) cart = [];
  let products = await Product.find({ _id: { $in: cart } });
  console.log("products: " , products);

  let total = products.reduce(
    (total, product) => total + Number(product.price),
    0
  );

  console.log('total: ', total)

  res.render("site/cart", { products, total });
});


router.get("/add-cart/:id", function (req, res, next) {
console.log("^^^^^^^^^: req.session.user._id : ", )
  User.findById(req.session.user._id)
    .then((user) => {
      console.log("User$$$$$$$$$: ", user)
      req.user = user;
    })
    .catch((err) => console.log(err));


  console.log("Checking req.user: ", req.user);
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  const prodId = req.params.id;
  console.log("product Id is: ", prodId);
  Product.findById(prodId)
    .then((product) => {
      console.log("products are: ", product);
      return req.user.addToCart(product);
    })
    .then((result) => {
      cart.push(req.params.id);
      res.cookie("cart", cart);
      req.flash("success", "Product Added To Cart");
      res.redirect("/");
      console.log(result);
    });

});



router.get('/orders',function(req, res, next) {
  Order.find({'user.userId': req.user._id})
    .then((orders) => {
      res.render("site/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
});

router.post('/create-order',function (req, res, next){
  console.log("what is req.user: ", req.user);
  req.user.populate("cart.items.productId").execPopulate()
  .then((user) => {
    const products = user.cart.items.map(i=>{
    return {quantity: i.quantity , product: {...i.productId._doc}};
    });
    const order = new Order({
      user: {
        name: req.user.name,
        email: req.user.email,
        userId: req.user,
      },
      products: products
    });
    return order.save();
  }).then((result) => {
    return req.user.clearCart();
    }).then(()=>{
      res.cookie("cart", []);
      console.log("I am after clear cart")
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
});



module.exports = router;
