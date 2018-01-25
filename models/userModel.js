var db = require('../lib/db.js');

exports.query = function(id, callback){
    var sql = 'select u.* from user u where u.id=?;'
    db.query(sql, [id], callback);
};

exports.update = function(id, name, identity, tel, callback){
    var sql = 'update user set name=?, identity = ?, tel = ? where id = ?;'
    db.query(sql, [name, identity, tel, id], callback);
};



exports.queryUserByOpenid = function(openid, callback){
    var sql = 'select u.* from user u where u.openid=?;'
    db.query(sql, [openid], callback);
};
 
var insertSql = 'insert into user(openid, nickname, avatar, create_time) values(?,?,?,?);';
exports.insert = function (openid, nickname, avatar, callback) {
    db.query(insertSql, [openid, nickname, avatar, new Date()], callback);
};