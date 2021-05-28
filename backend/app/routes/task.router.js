const validateToken = require('../middleware/authorization').validateToken;
module.exports = function (app) {
    var task = require("../controllers/task.controller");
    app.post("/api/task",validateToken, task.createTask);
    app.get("/api/getTasksByLeadId/:id",validateToken, task.getTasksByLeadId);
    app.get("/api/getTaskById/:id",validateToken, task.getTaskById);
    app.get("/api/getTaskByRoleAndUserId",validateToken, task.getTaskByRoleAndUserId);
    app.put("/api/task/:id",validateToken,task.updateTask)
    app.delete("/api/task/:id",validateToken,task.deleteTaskById)
  };
  