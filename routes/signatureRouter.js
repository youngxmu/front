var express = require('express');
var wx = require('../lib/wxUtils');
var logger = require("../lib/log").logger("signatureRouter");
var config = require('../config');
var router = express.Router();

router.get('/:type', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	var url = req.query.url;
	var type = req.params.type;
	
	wx.getSignature(url, type, function(err, signature){
		if(err){
			res.send(err);
		}else{
			res.send(signature);
		}
	});
});

router.get('/refresh/:type', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	var type = req.params.type;
	
	wx.clearRedisTicket(type, function(err){
		if(err){
			res.json({success: false});
		}else{
			res.json({success: true});
		}
	});
});

module.exports = router;