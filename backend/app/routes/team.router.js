module.exports = function(app) {
    var team = require('../controllers/team.controller');
    app.get('/api/teams', team.teams);
    app.post('/api/team', team.createTeam);
    // app.put('/api/team',team.updateTeamById);
    app.delete('/api/team/:id',team.deleteTeamById);
    app.get('/api/team/:id',team.getTeamById);
  } 