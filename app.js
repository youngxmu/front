var express = require('express');
var path = require('path');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var multiparty = require('multiparty');
var log4js = require('log4js');
var logger =  require('./lib/log.js').logger('app');
logger.setLevel('ERROR');
var route = require('./route.js');
var config = require('./config');

var cookie = cookieParser(config.sessionSecret);
var app = express();
app.set('env', config.env);
app.set('port', config.port);
app.set('views', config.views);
app.set('view engine', config.viewEngine);
app.use(log4js.connectLogger(logger, {
    level: "auto"
}));

app.use(bodyParser());
app.use(methodOverride());
app.use(cookie); //须在expressSession前使用cookieParser
// var sessionStore = new expressSession.MemoryStore();
var sessionStore = require('connect-redis')(expressSession);
app.use(expressSession({
    resave:false,//添加这行  
    saveUninitialized: true,//添加这行   
    secret: config.sessionSecret,
    key: 'reform122231id', //种到cookies里的标识
    store: new sessionStore({host: config.redis.address, port : config.redis.port, ttl: 900,pass : config.redis.passwd})
    // store: sessionStore
}));
//app.use(csrf());
app.use(express.static(config.staticPath));
if(config.env != 'devvv'){//开发环境不需要过滤
    var whitelist = config.whitelist;
    app.use(function(req, res, next) {//判断是否登录的中间件
        // var requestPath = req.path;//请求的uri
        // var startTime = new Date(2016, 11, 1, 17, 59, 59);
        // var currTime = new Date();
        // if(currTime > startTime && requestPath.indexOf('index/start') == -1){
        //     return res.redirect(config.redirectPath + 'index/start');
        // }
        // if(currTime > startTime && requestPath.indexOf('index/start') != -1){
        //     return res.redirect(config.redirectPath + 'index');
        // }

        // var endTime = new Date(2016, 4, 31, 16, 55, 0);
        // var currTime = new Date();
        // var isValid = true;

        // if(currTime > endTime && requestPath.indexOf('index/end') == -1){
        //     return res.redirect('http://ipai.cnhubei.com/ol/cczt/index/end');
        // }

        // if(requestPath.indexOf('debug') != -1){
        // }else if(currTime < startTime && requestPath.indexOf('index/start') == -1){
        //     return res.redirect('http://ipai.cnhubei.com/ol/cczt/index/start');
        // }
        next();
    });
}

route(app); //加载routes

//404错，即无匹配请求地址
app.use(function(req, res, next) {
    if (!req.xhr) {
        // logger.error('common 404');
        res.status(404);
        res.render('error', {
            msg: "404 未找到"
        });
    } else { //这里遇到xhr的404错误,在返回数据中指明
        // logger.error('xhr 404');
        res.status(404);
        res.json({
            success: false,
            status: 404,
            msg: '404错误'
        });
    }
});

//记录错误日志
app.use(function(err, req, res, next) {
    var status = err.status || 500;
    logger.error('【error】', 'status:', status, 'message:', err.message || '');
    logger.error('【stack】\n ', err.stack || '');
    next(err);
});

//处理错误，返回响应
app.use(function(err, req, res, next) {
    var status = err.status || 500;
    if (!req.xhr) {
        logger.error('common other error', err);
        res.status(status);
        res.render('error', {
            success: false,
            status: status,
            msg: '500错误'
        });
    } else { //xhr的内部调用的错误会到达这个分支
        logger.error('xhr other error');
        res.status(status);
        res.json({
            success: false,
            status: status,
            msg: 'xhr发生错误'
        });
    }
    return;
});


var server = require('http').Server(app);
server.listen(app.get('port'), function() {
    console.log('Server listening on port ' + server.address().port, ', env is ' + app.get('env'));
});

process.on('uncaughtException', function(err) {
    logger.error('Holy shit!!!!! Fatal Errors!!!!!!! ' , err);
});

// var ipUtils =  require('./lib/ipUtils.js');
// ipUtils.queryDBIPs(function(){});

// var sysUtils =  require('./lib/sysUtils.js');
// sysUtils.getDBCounts(function(){});
// setInterval(function(){
//     sysUtils.getDBCounts(function(){});
// }, 5 * 1000);

