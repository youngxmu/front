fis.config.set('modules.postpackager', 'simple');
fis.config.set('settings.spriter.csssprites.margin', 20);
fis.config.set('roadmap.path', [{
    reg: '**.css',
    useSprite: true,
    useStandard : false
}]);


fis.config.merge({
    roadmap : {
        path : [
            {
                reg : /\/public\/css\/(.*\.css)/i,
                release : '/public/css/$1'
            },
            {
                reg : /\/public\/js\/(.*\.js)/i,
                release : '/public/js/$1'
            },
            {  
                reg : /\/public\/img\/(.*\.((jpg)|(png)|(gif)|(ico)))/i,
                release : '/public/img/$1'
            },
            {
                reg : /\/views\//i,
                useStandard : true
            },
            {
                reg : /\/(logs|test|node_modules)\//i,
                release : false
            },
            {
                reg : '**',
                useStandard : false,
                useOptimizer : false
            }
        ]
    },
    deploy : {
        nodeS1 : [
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                from : '/public',
                to : '/static/front',
                exclude : ['/public/audio/', '/public/PreloadJS-master/', '/public/SoundJS-master/'],
                subOnly : true
            },
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                from : '/public',
                to : '/node/front/public',
                exclude : ['/public/audio/', '/public/PreloadJS-master/', '/public/SoundJS-master/'],
                subOnly : true
            },
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                include : ['/views/**'],
                from : '/views',
                to : '/node/front/views',
                subOnly : true,
                replace : {
                    from : 'http://10.99.13.128:8200',
                    to : 'http://dj.hifidiy.net/front'
                }
            }
        ],
        node1 : [
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                from : '/public',
                to : '/static/front',
                subOnly : true
            },
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                from : '/public',
                to : '/node/front/public',
                subOnly : true
            },
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                include : ['/views/**'],
                from : '/views',
                to : '/node/front/views',
                subOnly : true,
                replace : {
                    from : 'http://10.99.13.128:8200',
                    to : 'http://dj.hifidiy.net/front'
                }
            },
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                include : ['/config/*.js'],
                from : '/config',
                to : '/node/front/config',
                subOnly : true
            },
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                include : ['/lib/**'],
                from : '/lib',
                to : '/node/front/lib',
                subOnly : true
            },
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                include : ['/routes/*.js'],
                from : '/routes',
                to : '/node/front/routes',
                subOnly : true
            },
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                include : ['/models/**'],
                from : '/models',
                to : '/node/front/models',
                subOnly : true
            },
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                include : ['app.js'],
                from : '/',
                to : '/node/front',
                subOnly : true
            }
            ,
            {
                receiver : 'http://dj.hifidiy.net/nrec/receiver',
                include : ['route.js'],
                from : '/',
                to : '/node/front',
                subOnly : true
            }
        ]
    }
});