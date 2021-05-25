const validateToken = require('../middleware/authorization').validateToken;
module.exports = function (app) {
  var team = require("../controllers/team.controller");
  app.get("/api/teams",validateToken, team.teams);
  app.post("/api/team", team.createTeam);
  app.put("/api/team/:id", team.updateTeamById);
  app.delete("/api/team/:id", team.deleteTeamById);
  app.get("/api/team/:id", team.getTeamById);
};
  