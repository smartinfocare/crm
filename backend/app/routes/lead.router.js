const validateToken = require('../middleware/authorization').validateToken;
module.exports = function (app) {
  var lead = require("../controllers/lead.controller");
  app.post("/api/lead", lead.createLead);
  app.get("/api/lead",validateToken, lead.getLeads);
  app.delete("/api/lead/:id", lead.deleteLeadById);
  app.get("/api/lead/:id", lead.getLeadById);
  app.put("/api/lead/:id", lead.updateLeadById);
  app.put("/api/changeLeadStatus", lead.changeLeadStatus);
  app.put("/api/changeLeadSource", lead.changeLeadSource);
};
