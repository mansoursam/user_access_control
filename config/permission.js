module.exports = function permission(req, res, next) {
  if (req.session.role == "Admin") return next();
  res.render("permission");
};
module.exports.checkLogin = (req, res, next) => {
  if (!req.session.user) return next();
  res.redirect("/");
};
