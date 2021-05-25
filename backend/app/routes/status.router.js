module.exports = function (app) {
  var status = require("../controllers/status.controller");
  app.post("/api/status", status.createStatus);
  app.get("/api/status", status.getStatus);
};
 