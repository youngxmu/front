var utils = require("../lib/utils.js");
//20秒更新超过10次，拉黑
var time = 10 * 1000;
var max = 5;
var blockMap = {};
var ipMap = {};

var inc = function(ip){
	if(!ip || ip == '' || ip == 'undefined'){
		return true;
	}
	var ipInfo = ipMap[ip];
	var currTime = new Date().getTime();
	if(blockMap[ip]){
		return false;
	}

	if(ipInfo){
		if(ipInfo.count >= max){//规定时间超过统计次数，加入黑名单
			blockMap[ip] = 1;
        	console.log('deny code ' + ip);
			return false;
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

setInterval(function(){
	blockMap = null;
	ipMap = null;
	blockMap = {};
	ipMap = {};
}, 30 * 1000);

exports.inc = inc;