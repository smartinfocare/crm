const validateToken = require('../middleware/authorization').validateToken;
var notes = require("../controllers/notes.controller");
module.exports = function (app) {
    app.post("/api/notes",validateToken, notes.createNotes);
    app.get("/api/getNotesByLeadId/:id",validateToken, notes.getNotesByLeadId);
  };
  