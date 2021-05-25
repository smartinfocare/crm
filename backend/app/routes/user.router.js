module.exports = function (app) {
  var users = require("../controllers/user.controller");
  app.post("/api/user", users.createUser);
  app.get("/api/users", users.users);
  app.get("/api/user/:id", users.getUserById);
  app.put("/api/user", users.updateRole);
  app.put("/api/updateStatus", users.updateStatus);
  // app.post('/api/login',users.loginUserByOtp);
  app.post("/api/setPassword/:key", users.setPassword);
};
