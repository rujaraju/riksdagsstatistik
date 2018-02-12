'use strict';

var express = require('express'),
    routes = require('./app/routes/index.js'),
    calc = require('./app/controllers/calc.server.js'),
    fs = require('fs');
    //mongo = require('mongodb').MongoClient; // npm install mongodb & the rest of setup for c9, ./mongod to start it

var app = express();
var port = process.env.PORT || 8080;

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

routes(app); //gets routes from the index.js under /app/routes

app.listen(port, function () {
        console.log('Listening on port ' + port);
    });