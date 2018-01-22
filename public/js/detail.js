(function(P){
	var _this = null;
	_this = P.detail = {
		init : function(){
			_this.initEvent();
		},
		initEvent : function(){
			$('#wrapper').on('click', '.btn-share', function(){
				$('#share_dlg').addClass('on').removeClass('off');
			});

			$('#share_dlg').on('click', function(){
				$('#share_dlg').addClass('off').removeClass('on');
			});
			$('#wrapper').on('click', '.back-index', function(){
				window.location.href = 'index/list/' + $('#type').val();
			});
		}
	};
}(moka));