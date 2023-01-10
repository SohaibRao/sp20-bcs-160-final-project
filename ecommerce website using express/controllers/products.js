
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "add product",
    path: "/admin/add-product",
    hasProducts: Product.length > 0,
    activeShop: true,
    productCSS: true,
    isAuthenticated: req.session.isLoggedIn,

  });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body); // for receiving the request form the browser -> we have to use body parser -> npm install --save body-parser
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      isAuthenticated: req.session.isLoggedIn,

    });
  });
};
