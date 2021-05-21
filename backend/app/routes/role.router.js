module.exports = function (app) {
  var roles = require("../controllers/role.controller");
  app.get("/api/roles", roles.roles);
};
