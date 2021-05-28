const validateToken = require('../middleware/authorization').validateToken;
var taskNotes = require("../controllers/taskNotes.controller");
module.exports = function (app) {
    app.post("/api/taskNotes",validateToken, taskNotes.createTaskNotes);
    app.get("/api/taskNotes/:id",validateToken, taskNotes.getTaskNotesById);
  };
  