require('dotenv').config()
var express = require('express');
const cors = require('cors')
var app = express();
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser')
 app.use(cookieParser())
// Configuring the database
const dbConfig = require('./app/config/mongodb.config.js');
const mongoose = require('mongoose');
//read the model of colletion
const User = require('./app/models/user.model');
const Role = require('./app/models/role.model');
const Team = require('./app/models/team.model');
const Source = require('./app/models/source.model');
const Status = require('./app/models/status.model');
const Lead = require('./app/models/lead.model');
 
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Successfully connected to MongoDB.");   
    }).catch(err => {
        console.log('Could not connect to MongoDB.');
        process.exit();
    });

require('./app/routes/user.router.js')(app);
require('./app/routes/role.router.js')(app);
require('./app/routes/team.router.js')(app);
require('./app/routes/source.router.js')(app);
require('./app/routes/status.router.js')(app);
require('./app/routes/lead.router.js')(app);
require('./app/routes/login.router')(app)
// Create a Server
const server = app.listen(8080, function () {
 
    let host = server.address().address
    let port = server.address().port
   
    console.log("App listening at http://%s:%s", host, port); 
  })