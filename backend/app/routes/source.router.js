module.exports = function (app) {
  var source = require("../controllers/source.controller");
  app.post("/api/source", source.createSource);
  app.get("/api/sources", source.getSource);
};
