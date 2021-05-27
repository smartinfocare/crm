module.exports = function (app) {
    var notes = require("../controllers/notes.controller");
    app.post("/api/notes", notes.createNotes);
  };
  