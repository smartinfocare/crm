var express = require('express');
const cors = require('cors')
var app = express();
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.json())
// Configuring the database
const dbConfig = require('./app/config/mongodb.config.js');
const mongoose = require('mongoose');

//read the model of colletion
const User = require('./app/models/user.model');
 
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
// Create a Server
const server = app.listen(8080, function () {
 
    let host = server.address().address
    let port = server.address().port
   
    console.log("App listening at http://%s:%s", host, port); 
  })