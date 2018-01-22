var db = require('../lib/db.js');

exports.query = function(id, callback){
    var sql = 'select * from pman where id = ?;';   
    db.query(sql, [id], callback);
};

exports.queryAll = function(callback){
    var sql = 'select * from pman;';
    db.query(sql, [], callback);
};

exports.queryAllCount = function(callback){
    var sql = 'select p.*,count(v.pid) as count from pman p ';
    sql += ' left join vote v on p.id = v.pid  GROUP BY v.pid;'
    db.query(sql, [], callback);
};


