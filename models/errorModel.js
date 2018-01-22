var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("errorModel");

exports.insertError = function (openid, reason, callback) {
    db.query("insert into error(openid, reason, create_time) values(?,?,?);",
        [openid, reason, new Date()], callback
    );
};

