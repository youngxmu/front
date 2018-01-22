//***************************************************************************************************************************
function SoundPlayer(params) {
    this.isPlay = false;
    this.soundIndex = 0;
    this.dataList = params.dataList;
    this.timeInterval;
    this.params = {
        loop: params.loop || false,
        preload: "auto",
        autoplay: params.autoplay || false,
        src: this.dataList[this.soundIndex].src || null,
        playHandler: params.playHandler || function () {

        },
        playingHandler: params.playingHandler || function (c) { }
    };
    this.init();
}
SoundPlayer.prototype = {
    init: function () {
        var _this = this,
            attr = {
                loop: this.params.loop,
                preload: this.params.preload,
                autoplay: this.params.autoplay,
                src: this.params.src
            };
        this._audio = new Audio;
        for (var i in attr) {
            attr.hasOwnProperty(i) && i in this._audio && (this._audio[i] = attr[i]);
        }
        $(this._audio).on('durationchange', function () {
            // 播放加载
            if (_this._audio.duration > 1) {
                _this.inited = true;
            }
        });

        //$(this._audio).on('ended', function () {
        //    // 播放结束
        //    console.log("下一首");
        //    _this.next();
        //});
        this._audio.addEventListener('ended', function () {
            console.log("下一首");
            // _this.pause();
            _this.next();
        }, false);
    },
    isPlay: function () {
        return this.isPlay;
    },
    volume: function (num) {
        this._audio.volume = num;
    },
    //开始播放
    play: function (callPlaying) {
        this.isPlay = true;
        if (this.params.playHandler)
            this.params.playHandler(this.dataList[this.soundIndex]);
        //this.clearInterval();
        //if (this.timeInterval != undefined){
        //    clearInterval(this.timeInterval);
        //    this.timeInterval = undefined;
        //   // alert(this.timeInterval)
        //}
        this.timeInterval = setInterval(function () {
            //$("#time .currentTime").html(timeChange(currentTime, "currentTime"));
            if (callPlaying)
                callPlaying();
        }, 1000);
        return this._audio.play();
    },
    pause: function () {
        this.isPlay = false;
        clearInterval(this.timeInterval);
        return this._audio.pause();
    },
    //下一首
    next: function () {
        if (this.soundIndex == this.dataList.length - 1) {
            this.soundIndex = 0;
        } else {
            this.soundIndex++;
        }
        this._audio.src = this.dataList[this.soundIndex].src;
        this.play();
    },
    //上一首
    prev: function () {
        if (this.soundIndex == 0) {
            this.soundIndex = this.dataList.length - 1;
        } else {
            this.soundIndex--;
        }
        this._audio.src = this.dataList[this.soundIndex].src;
        this.play();
    },
    currentTime: function () {
        //去整数，去掉小数点
        return parseInt(this._audio.currentTime);
    },
    /*--------------音频文件的播放时长(s)-----------------*/
    duration: function () {
        return parseInt(this._audio.duration);
    },
    /*--------------计算当前播放的进度百分比-----------------*/
    calProcess: function () {
        //return  (process/allprocess).toFixed(2)*100
        return (this.currentTime() / this.duration()).toFixed(2) * 100
    },
    /*--------------返回当前时间进度-----------------*/
    backTime: function () {
        var yu = this.currentTime() % 60;
        var shang = parseInt(this.currentTime() / 60);
        return this.addZero(shang) + ":" + this.addZero(yu);
    },
    /*--------------返回音频文件总体时间格式-----------------*/
    backTotTime: function () {
        var yu = this.duration() % 60;
        var shang = parseInt(this.duration() / 60);
        return this.addZero(shang) + ":" + this.addZero(yu);
    },
    /*--------------补全0-----------------*/
    addZero: function (num) {
        var result;
        num = num.toString();
        if (num.length == 1) { result = "0" + num }
        else { result = num; }
        return result;
    }
}