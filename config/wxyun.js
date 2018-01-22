var path = require('path');

module.exports = {
	port: 8561,
	viewEngine: 'ejs',
	views: path.resolve(__dirname, '..', 'views'),
	staticPath: path.resolve(__dirname, '..', 'public'),
	uploadDir: path.resolve(__dirname, '..', 'public/uploads'),
	env: 'dev',
	logfile: path.resolve(__dirname, '..', 'logs/access.log'),
	redirectPath : '/',
	// redirectPath : 'http://ipai.cnhubei.com/v/reform/',
	sessionSecret: 'session_secret_random_seed',
	wxapptype : 'hbrb',
	//mysql config
	host: "58eaf1d7540b2.gz.cdb.myqcloud.com",
	sqlport : 9369,
	user: "root",
	password: "123a321a",
	database: "reform",
	enableDBLog: false,
	winston:{
		exceptionFile:path.resolve(__dirname, '..', 'logs/exceptions.log'),
		dailyRotateFile:path.resolve(__dirname, '..', 'logs/daily.log')
	},
	//redis config
	"redis": {"address": "127.0.0.1", "port": "6379", "passwd": "Hs1JlTXOGsDRtq8UH"},
	"wxRedis": {"address": "127.0.0.1", "port": "6379", "passwd": "Hs1JlTXOGsDRtq8UH"},
	"token_secret": "generated_token_secret",//用于生成“授权token”的secret
	"testValidCode" : true,
	"whitelist": [
		"/",
	],
	md5Salt: "moka_salt"
};