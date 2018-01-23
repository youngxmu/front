var express = require("express");
var config = require("../config");
var userModel = require("../models/userModel");
var utils = require("../lib/utils");
var wxUtils = require("../lib/wxUtils");
var sysUtils = require("../lib/sysUtils");
var redisUtils = require("../lib/redisUtils");
var ipUtils = require("../lib/ipUtils.js");
var logger = require("../lib/log").logger("indexRouter");
var router = express.Router();

var murl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcc3d79aa1e85e05f&redirect_uri=http%3a%2f%2fdj.hifidiy.net%2ffront%2findex&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';


router.get('', function (req, res, next) {
    res.redirect(murl);
});

var login = function (req, res, callback) {
    var code = req.query.code;
    var openid = 'o-OiHjkAEb7IEPmIv-GcFS_i6lLE';
    var user = {
        id : 0,
        openid : openid,
        subscribe : 0,
        complete : 1
    };
    var view = 'index';
    req.session.user = user;
    return callback(null, user);
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
                logger.error('getUserInfoByCode', config.wxapptype, code, err);
                return callback(err);
            }
            openid = userInfo.openid;
            var nickname = userInfo.nickname;
            if(!nickname){
                nickname = '未获取';
            }
            userModel.queryUserByOpenid(openid, function(err, users){
                if(err){
                    logger.error('queryUserByOpenid', openid);
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
                                    logger.error('queryUserByOpenid', openid);
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


router.get('/index', function (req, res, next) {
    login(req, res, function(err, user){
        if(err || !user ){
            return res.render('error', {msg: '访问的人数太多啦，请稍后重试'});
        }
        // if(!user.name){
        //     return res.redirect(config.redirectPath + 'auth');
        // }
        return res.render('index');   
    });
});


router.get('/studytasklist', function (req, res, next) {
    login(req, res, function(err, user){
        if(err || !user ){
            return res.render('error', {msg: '访问的人数太多啦，请稍后重试'});
        }
        // if(!user.name){
        //     return res.redirect(config.redirectPath + 'auth');
        // }
        return res.render('studytasklist');   
    });
});

router.get('/studylist', function (req, res, next) {
    login(req, res, function(err, user){
        if(err || !user ){
            return res.render('error', {msg: '访问的人数太多啦，请稍后重试'});
        }
        // if(!user.name){
        //     return res.redirect(config.redirectPath + 'auth');
        // }
        return res.render('studylist');   
    });
});


router.get('/experiencelist', function (req, res, next) {
    login(req, res, function(err, user){
        if(err || !user ){
            return res.render('error', {msg: '访问的人数太多啦，请稍后重试'});
        }
        // if(!user.name){
        //     return res.redirect(config.redirectPath + 'auth');
        // }
        return res.render('experiencelist');   
    });
});

router.get('/center', function (req, res, next) {
    login(req, res, function(err, user){
        if(err || !user ){
            return res.render('error', {msg: '访问的人数太多啦，请稍后重试'});
        }
        // if(!user.name){
        //     return res.redirect(config.redirectPath + 'auth');
        // }
        return res.render('center');   
    });
});

router.get('/auth', function (req, res, next) {
    res.render('auth');
});

router.post('/auth', function (req, res, next) {
    var user = req.session.user;
    var id = user.id;
    var name = req.body.name;
    var identity = req.body.identity;
    var tel = req.body.tel;

    userModel.update(id, name, identity, tel, function(err){
        if(err){
            return res.json({
                success : false,
                msg : '补充信息失败，请重试'
            });
        }
        return res.json({
            success : true
        });
    });
});

router.get('/error', function (req, res, next) {
    return res.render('auth-error');
});

module.exports = router;