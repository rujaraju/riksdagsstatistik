'use strict';

var calc = require(process.cwd() + '/app/controllers/calc.server.js');

module.exports = function (app, db) {

    var clickHandler = new ClickHandler(db);

    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        });

    app.route('/api/clicks')
        .get(clickHandler.getClicks)
        .post(clickHandler.addClick)
        .delete(clickHandler.resetClicks);
};