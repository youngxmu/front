var db = require('../lib/db.js');

exports.query = function(id, callback){
    var sql = 'select u.*,count(v.uid) as count from user u  left join vote v on u.id = v.uid where u.id=? GROUP BY v.uid;'
    db.query(sql, [id], callback);
};

exports.queryUserVoteCount = function(id, type, callback){
    var sql = 'select count(uid) as count from vote where uid = ? and type = ?;'
    db.query(sql, [id, type], callback);
};

exports.queryUserVoteCounts = function(id, callback){
    var sql = 'select type, count(uid) as count from vote where uid = ? GROUP BY uid;'
    db.query(sql, [id], callback);
};

exports.queryUserByOpenid = function(openid, callback){
    var sql = 'select u.*,count(v.uid) as count from user u  left join vote v on u.id = v.uid where u.openid=? GROUP BY v.uid;'
    db.query(sql, [openid], callback);
};
 
var insertSql = 'insert into user(openid, nickname, create_time) values(?,?,?);';
exports.insert = function (openid, nickname, callback) {
    db.query(insertSql, [openid, nickname, new Date()], callback);
};