module.exports = function (app) {
    var login = require("../controllers/login.controller");
    app.post("/api/loginWithPassword", login.LoginWithPassword);
  };
    