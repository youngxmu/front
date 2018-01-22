var db = require('../lib/db.js');


var insertSql = 'insert into vote(uid, pid, use_time, ip, create_date, create_time) values(?,?,?,?,?,?);';
exports.insert = function (uid, pid, use_time, ip, create_date, callback) {
    db.query(insertSql, [uid, pid, use_time, ip, create_date, new Date()], callback);
};


exports.queryUserVotes = function(uid, date, type, callback){
    db.query("select * from vote where uid = ? and create_date = ? and type = ?;", [uid, date, type], callback);
};

exports.queryUserVote = function(uid, date, callback){
    db.query("select * from vote where uid = ? and create_date = ? ;", [uid, date], callback);
};

var insertVotesSql = 'insert into vote (uid, pid, use_time, ip, create_time, score, create_date) values ? ;';
exports.insertVotes = function (params, callback) {
    db.query(insertVotesSql, [params], callback);
};

