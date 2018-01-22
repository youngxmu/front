var utils = require("../lib/utils.js");
var ipModel = require('../models/ipModel.js');

//20秒更新超过10次，拉黑
var time = 10 * 1000;
var max = 10;
var blockMap = {};
var blockWXMap = {};
var ipMap = {};
var currIpInfo = null;
var queryDBIPs = function(callback){
	ipModel.queryIPs(function(err, result){
		if(err){
			blockMap = {};
		}else if(result.length > 0){
			for(var index in result){
				currIpInfo = result[index];
				blockMap[currIpInfo.ip] = 1;
			}
		}
		if(callback){
			return callback(blockMap);	
		}
	});
};

var inc = function(ip){
	if(ip == '127.0.0.1'){
		return true;
	}
	if(!isValid(ip)){
		return false;
	}
	var ipInfo = ipMap[ip];
	var currTime = new Date().getTime();
	if(ipInfo){
		if(ipInfo.count >= max){//规定时间超过统计次数，加入黑名单
			blockMap[ip] = 1;
			ipModel.saveIP(ip, function(err, result){
				if(err){
					logger.error(err, 'save error');
				}
				console.log(ip + ' is blocked!');
				return false;
			});
			// return false;//加入黑名单 返回false
		}else{
			// console.log(currTime - ipInfo.start_time);
			if(currTime - ipInfo.start_time >= time){//超过时间重置统计数为1
				ipInfo.count = 1;
				ipInfo.start_time = currTime;
			}else{
				ipInfo.count = ipInfo.count + 1;//未超过时间次数+1	
			}
		}
	}else{//第一次进入，初始化次数为1
		ipInfo = {
			count : 1,
			ip : ip,
			start_time : currTime
		};
	}
	ipMap[ip] = ipInfo;//保存到ipMap
	return true;//未加入黑名单，返回true
};

var isValid = function(ip){
	return true;
	if(ip == '127.0.0.1'){
		return true;
	}
	if(blockMap[ip] || (ipMap[ip] && ipMap[ip].count > 30)){
		return false;
	}
	return true;
};

var getIpMap = function(){
	return ipMap;
};

var block = function(ip){
	blockMap[ip] = 1;
	return true;
};

var blockWXMap = function(openid){
	blockWXMap[openid] = 1;
	return true;
};

var checkAuth = function(ip, openid){
	if(blockWXMap[openid] || blockMap[ip] || (ipMap[ip] && ipMap[ip].count > 30)){
		return false;
	}
	return true;
};

exports.queryDBIPs = queryDBIPs;
exports.inc = inc;
exports.isValid = isValid;
exports.getIpMap = getIpMap;
exports.block = block;
exports.blockWXMap = blockWXMap;
exports.checkAuth = checkAuth;