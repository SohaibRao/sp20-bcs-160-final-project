const User = require("./../models/User");

//sets user variable for pug files
async function checkSessionAuth(req, res, next) {
  if (!req.session.user) {
    req.flash("danger", "You need to login for this route");
    return res.redirect("/login");
  }
   User.findById(req.session.user._id)
    .then((user) => {
      console.log("User***************: ", user)
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
}

module.exports = checkSessionAuth;
