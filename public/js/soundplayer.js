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
            // ���ż���
            if (_this._audio.duration > 1) {
                _this.inited = true;
            }
        });

        //$(this._audio).on('ended', function () {
        //    // ���Ž���
        //    console.log("��һ��");
        //    _this.next();
        //});
        this._audio.addEventListener('ended', function () {
            console.log("��һ��");
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
    //��ʼ����
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
    //��һ��
    next: function () {
        if (this.soundIndex == this.dataList.length - 1) {
            this.soundIndex = 0;
        } else {
            this.soundIndex++;
        }
        this._audio.src = this.dataList[this.soundIndex].src;
        this.play();
    },
    //��һ��
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
        //ȥ������ȥ��С����
        return parseInt(this._audio.currentTime);
    },
    /*--------------��Ƶ�ļ��Ĳ���ʱ��(s)-----------------*/
    duration: function () {
        return parseInt(this._audio.duration);
    },
    /*--------------���㵱ǰ���ŵĽ��Ȱٷֱ�-----------------*/
    calProcess: function () {
        //return  (process/allprocess).toFixed(2)*100
        return (this.currentTime() / this.duration()).toFixed(2) * 100
    },
    /*--------------���ص�ǰʱ�����-----------------*/
    backTime: function () {
        var yu = this.currentTime() % 60;
        var shang = parseInt(this.currentTime() / 60);
        return this.addZero(shang) + ":" + this.addZero(yu);
    },
    /*--------------������Ƶ�ļ�����ʱ���ʽ-----------------*/
    backTotTime: function () {
        var yu = this.duration() % 60;
        var shang = parseInt(this.duration() / 60);
        return this.addZero(shang) + ":" + this.addZero(yu);
    },
    /*--------------��ȫ0-----------------*/
    addZero: function (num) {
        var result;
        num = num.toString();
        if (num.length == 1) { result = "0" + num }
        else { result = num; }
        return result;
    }
}