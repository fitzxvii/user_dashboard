//Initializations
const express = require('express');
const app = express();
const config = require('./config.js');
var session = require("express-session");
const router = require('./routes.js');

//Configurations
config.set_config(app, express, session);

//Database connect
config.db_connect.connect(function(err) {
    if (err) throw err;
});

//Adding routes
app.use("/", router);

//Set up server
app.listen(8000, function(){
    console.log("Listening on port: 8000");
});