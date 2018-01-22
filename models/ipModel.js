var db = require('../lib/db.js');

exports.queryIPs = function (callback) {
    var params = [];
    var sql = 'select ip from ip_block;'
    db.query(sql, params, callback);
};


exports.saveIP = function (ip, callback) {
    var params = [];
    var sql = 'insert into ip_block(ip, create_time) values(?,?);';
    params.push(ip);
    params.push(new Date());
    db.query(sql, params, callback);
};