'use strict';

var calc = require(process.cwd() + '/app/controllers/calc.server.js');//where all the calculation happens
var fs = require('fs')

module.exports = function (app) {

    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        });

    app.route('/age')
        .get(function (req, res) {
            calc.age(fs,res);
        });
        
    app.route('/gender')
        .get(function (req, res) {
            calc.gender(fs,res);
        });

    app.route('/leftist')
        .get(function (req, res) {
            calc.leftist(fs,res);
        });
        
        
};