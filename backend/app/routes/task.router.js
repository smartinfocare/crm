const validateToken = require('../middleware/authorization').validateToken;
module.exports = function (app) {
    var task = require("../controllers/task.controller");
    app.post("/api/task",validateToken, task.createTask);
    app.get("/api/getTasksByLeadId/:id",validateToken, task.getTasksByLeadId);
  };
  