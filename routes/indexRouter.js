var express = require("express");
var config = require("../config");
var userModel = require("../models/userModel");
var utils = require("../lib/utils");
var wxUtils = require("../lib/wxUtils");
var sysUtils = require("../lib/sysUtils");
var redisUtils = require("../lib/redisUtils");
var ipUtils = require("../lib/ipUtils.js");
var rp = require('request-promise');
var logger = require("../lib/log").logger("indexRouter");
var router = express.Router();

var murl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcc3d79aa1e85e05f&redirect_uri=http%3a%2f%2fdj.hifidiy.net%2ffront%2findex&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';


router.get('', function (req, res, next) {
    res.redirect(murl);
});

var login = function (req, res, callback) {
    var code = req.query.code;
    var openid = 'oAz3H05Hvj-Cvc9440usD3k9iqywis';
    var user = {
        id : 0,
        openid : openid,
        subscribe : 0,
        complete : 1,
        nickname : 'young'
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
            var avatar = userInfo.headimgurl;
            console.log(nickname + ' '+ avatar);
            if(!nickname){
                nickname = '未获取';
            }
            userModel.queryUserByOpenid(openid, function(err, users){
                if(err){
                    logger.error('queryUserByOpenid', openid);
                    return callback(err);
                }
                if(users.length == 0){
                    userModel.insert(openid, nickname, avatar, function(err, result){
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
        return res.render('index', user);   
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
        var couid = req.query.couid;
         var title = req.query.title;
          var intro = req.query.intro;
        var data =user;
        data['couid'] = couid;
        data['title'] = title;
        data['intro'] = intro;
        return res.render('studytasklist', data);   
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
        return res.render('center', user);   
    });
});


router.get('/studyrecord', function (req, res, next) {
    login(req, res, function(err, user){
        if(err || !user ){
            return res.render('error', {msg: '访问的人数太多啦，请稍后重试'});
        }
        // if(!user.name){
        //     return res.redirect(config.redirectPath + 'auth');
        // }
        return res.render('studyrecord');   
    });
});
router.get('/test', function (req, res, next) {
    res.render('test');
});

router.get('/auth', function (req, res, next) {
    res.render('auth');
});
//
router.get('/timeapi/:type', function (req, res, next) {
    if(!req.session.user){
        console.log('登录过期');
        res.send(0);
    }
    var type = req.params.type;
    var second = req.query.second;
    var openid = req.session.user.openid;

    var url = 'http://47.98.35.3:8080/ms/timeapi/' + type + '?openid=' + openid;
    console.log(type);
    if(type == 'set'){
        url += '&second='+second;
    }
    console.log(url);
    var options = {
        uri: url,
        headers: {
            'User-Agent': 'Request-Promise'
        }
        // ,json: true // Automatically parses the JSON string in the response
    };
    rp(options).then(function (repos) {
        res.send(repos);
        
    }).catch(function (err) {
        console.log(err);
        res.send(0);
    });
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