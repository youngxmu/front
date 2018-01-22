var utils = require("../lib/utils.js");
var redisUtils = require("../lib/redisUtils.js");
var pmanModel = require('../models/pmanModel.js');
var voteModel = require('../models/voteModel.js');

var reformList = [];
var reformMap = [];

var getUserList = function(callback){
    redisUtils.get('sdkj_pman', function(err, reply){
        if(err){
            reformList = [];
            return callback(err);
        }else{
            try{
                reformList = JSON.parse(reply);
                // reformList = reformList[type];
            }catch(e){
                console.log(e);
            }
        }
        return callback(null, reformList);
    });
};


exports.getUserList = getUserList;
