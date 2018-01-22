var express = require("express");
var config = require("../config");
var userModel = require("../models/userModel");
var pmanModel = require("../models/pmanModel");
var voteModel = require("../models/voteModel");
var utils = require("../lib/utils");
var wxUtils = require("../lib/wxUtils");
var sysUtils = require("../lib/sysUtils");
var redisUtils = require("../lib/redisUtils");
var ipUtils = require("../lib/ipUtils.js");
var logger = require("../lib/log").logger("indexRouter");
var router = express.Router();

var murl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf947d7d09ef1f584&redirect_uri=http%3a%2f%2fact.cnhubei.com%2fsdkj%2findex%2flist&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

router.get('', function (req, res, next) {
    res.redirect(murl);
});

var codeUtils = require("../lib/codeUtils.js");
var login = function (req, res, callback) {
    var ip = utils.getClientIp(req, res, function(){});
    // if(!ipUtils.inc(ip)){
    //     logger.error('blocked fetch ' + ip);
    //     return res.redirect(config.redirectPath + 'index/error');
    // }
    var code = req.query.code;
    if(code == '011ey63W1afEVT0Yod3W1mr43W1ey63m' ){
        return res.redirect(config.redirectPath + 'index/codeerror');
    }

    if(!codeUtils.inc(code)){
        return res.redirect(config.redirectPath + 'index/codeerror');
    }

    var openid = 'o-OiHjkAEb7IEPmIv-GcFS_i6lLE';
    var user = {
        id : 0,
        openid : openid,
        subscribe : 0,
        complete : 1
    };
    var view = 'index';
    // req.session.user = user;
    // return callback(null, user);
    if(req.session && req.session.user){
        openid = req.session.user.openid;
        userModel.queryUserByOpenid(openid, function(err, users){
            if(err || users.length == 0){
                return callback(err);
            }
            user = users[0];
            user.loginTime = new Date().getTime();
            return callback(null, user);
        });
    }else{
        if(!code || code == 'undefined'){
            return callback('code is undefined');
        }
        wxUtils.getUserInfoByCode(config.wxapptype, code, function(err, userInfo){
            if(err){
                logger.error('getUserInfoByCode', config.wxapptype, code, ip, err);
                return callback(err);
            }
            openid = userInfo.openid;
            var nickname = userInfo.nickname;
            if(!nickname){
                nickname = '未获取';
            }
            userModel.queryUserByOpenid(openid, function(err, users){
                if(err){
                    logger.error('queryUserByOpenid', openid, ip);
                    return callback(err);
                }
                if(users.length == 0){
                    userModel.insert(openid, nickname, function(err, result){
                        if(err){
                            logger.error('insertUser is error, openid is ' + openid + ', nickname is ' + nickname);
                            return callback(err);
                        }else{
                            logger.info('insertUser is successd, openid is ' + openid + ', nickname is ' + nickname);
                            userModel.queryUserByOpenid(openid, function(err, users){
                                if(err || users.length == 0){
                                    logger.error('queryUserByOpenid', openid, ip);
                                    return callback(err);
                                }
                                user = users[0];
                                user.loginTime = new Date().getTime();
                                //user.subscribe = userInfo.subscribe;
                                req.session.user = user;
                                return callback(null, user);
                            });
                        }
                    });
                }else{
                    user = users[0];
                    user.loginTime = new Date().getTime();
                    // user.subscribe = userInfo.subscribe;
                    req.session.user = user;
                    return callback(null, user);
                }
            });
        });
    }
};

router.get('/list', function (req, res, next) {
    var currTime = new Date();
    if(currTime > endTime ){
        // return res.redirect(config.redirectPath + 'index/end');
    }
    var ip = utils.getClientIp(req, res, next);
    // if(!ipUtils.inc(ip)){
    //     logger.error('blocked fetch ' + ip);
    //     return res.redirect(config.redirectPath + 'index/error');
    // }

    login(req, res, function(err, user){
        if(err || !user ){
            return res.render('error', {msg: '访问的人数太多啦，请稍后重试'});
        }
        return res.render('index');   
    });
});


router.get('/error', function (req, res, next) {
    return res.render('auth-error');
});

module.exports = router;