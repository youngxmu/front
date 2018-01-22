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
    res.render('index');
});


router.get('/error', function (req, res, next) {
    return res.render('auth-error');
});

module.exports = router;