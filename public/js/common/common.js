var moka = {
};

var util = {
	formatIndex : function(index){
		return parseInt(index, 10) + 1;
	},
	loadingPanel : '<div id="loading_panel" style="position:fixed:top:0;left:0;">'
			+ '<span style="position:absolute;left:50%;top:35%;margin-left:-70px;"><img src="/svg/loading.svg" style="float:left;margin-right:15px;"></span>'
			+ '</div>',
	showLoading : function(){
		var $loadingPanel = $('#loading_panel');
		if($loadingPanel.length == 0){
			$('body').append(util.loadingPanel);
			$loadingPanel = $('#loading_panel');
		}
		$loadingPanel.show();
	},
	closeLoading : function(){
		var $loadingPanel = $('#loading_panel');
		if($loadingPanel.length == 0){
			$('body').append(util.loadingPanel);
			$loadingPanel = $('#loading_panel');
		}
		$loadingPanel.hide();
	},
	date : {
		format : function(longTime){
			var date = new Date(longTime);

			var Year= date.getFullYear();//ie火狐下都可以 
			var Month= date.getMonth()+1; 
			var Day = date.getDate(); 
			var Hour = date.getHours(); 
			var Minute = date.getMinutes(); 
			var Second = date.getSeconds(); 

			if (Month < 10 ) { 
				Month = "0" + Month; 
			} 
			if (Day < 10 ) { 
				Day = "0" + Day; 
			}
			if (Hour < 10 ) { 
				Hour = "0" + Hour; 
			} 
			if (Minute < 10 ) { 
				Minute = "0" + Minute; 
			} 
			if (Second < 10 ) { 
				Second = "0" + Second; 
			}  

			var CurrentDate = Year + '-' + Month + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Second;

			return CurrentDate;
		}
	},
	dialog : {
		infoDialog : function(msg, callback){
			var dd = dialog({
			    title: '信息',
			    content: msg,
			    width : 240,
			    okValue : '确定',
			    ok : function(){
			    	if(callback){
			    		callback();
			    	}
			    }
			});
			dd.showModal();
		},
		errorDialog : function(msg){
			var d = dialog({
			    title: '错误信息',
			    content: msg,
			    width : 240,
			    okValue : '确定',
			    ok : function(){}
			});
			d.showModal();	
		},
		confirmDialog : function(content,successCallback,cancelCallback,title){
			if(!title)
				title = "信息";
			if(!successCallback){
				successCallback = function(){};
			}
			if(!cancelCallback){
				cancelCallback = function(){};
			}

			var d = dialog({
			    title: title,
			    content: content,
			    width : 240,
			    okValue : '确认',
     	        ok : successCallback,
     	        cancelValue : '取消',
     	        cancel : cancelCallback
			});
			d.showModal();	
		}
	},
	_word : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
	getOption : function(index){
		if(index > 0){
			index = index - 1;
		}
		return util._word[index];
	}
};
juicer.register('formatIndex', util.formatIndex);
juicer.register('formatDate', util.date.format);
