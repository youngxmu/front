(function(P){
	var _this = null;
	_this = P.index = {
		$btn : null,
		init : function(){
			_this.userListTpl = juicer($('#user_list_tpl').html());
			// _this.orderListTpl = juicer($('#order_list_tpl').html());
			_this.initData();
			_this.initEvent();
			_this.loadData();
			_this.initGeetest();
		},
		initData : function(){
			_this.type = $('#type').val();
			_this.complete = $('#complete').val();
			if(_this.type == 'no'){
				$('.type-panel span').first().addClass('active');
				$('#type_msg').text('候选人按姓氏笔画顺序排列');
			}else{
				$('.type-panel span').last().addClass('active');
				$('#type_msg').text('候选人按获得票数顺序排列');
			}
		},
		initEvent : function(){
			$('#wrapper').on('click', '.avatar, .pman-content', function(){
				var key = $(this).attr('data-key');
				window.location.href = 'index/info/' + key;
			});
			$('#wrapper').on('click', '.back-top', function(){
				$('body')[0].scrollTop = 0;
			});
			$('#wrapper').on('click', '.type-panel span', function(){
				var type = $(this).attr('data-type');
				_this.type = type;
				$('.type-panel span').removeClass('active');
				if(_this.type == 'no'){
					$('.type-panel span').first().addClass('active');
				}else{
					$('.type-panel span').last().addClass('active');
				}
				_this.loadData();
			});
			$('#wrapper').on('click', '.btn-vote', function(){
				var $this = $(this);
				_this.key = $this.attr('data-key');
				_this.$btn = $this;
				// _this.captchaObj.refresh();
				$('#captcha').show();
			});
		},
		loadData : function(){
			$.ajax({
				url : 'index/list',
				type : 'post',
				beforeSend : function(){
					$('#loadingToast').show();
				},
				success : function(result){
					var tpl = _this.userListTpl;
					var list = result.list;
					// if(_this.type == 'count'){
					// 	list.sort(function(a,b){
					// 		return b.count - a.count;
					// 	});	
					// 	tpl = _this.orderListTpl;
					// }
					if(result.success){
						$('#user_list').html(tpl.render({list:list}));
					}else{
						alert('err');
					}
				},
				complete : function(){
					$('#loadingToast').hide();
				}
			});
		},
		initGeetest : function(){
			$.ajax({
				// 获取id，challenge，success（是否启用failback）
			 	url: "geetest/register?t=" + (new Date()).getTime(), // 加随机数防止缓存
				type: "get",
				dataType: "json", // 使用jsonp格式
				success: function (data) {
					// 使用initGeetest接口
					// 参数1：配置参数，与创建Geetest实例时接受的参数一致
					// 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
					// _this.captchaObj = new Geetest({
					// 	gt: data.gt,
					// 	challenge: data.challenge,
					// 	product: "embed", // 产品形式
					// 	mobile : 1
					//    // ,width: '80%'
					// }); // 实例化，config为配置参数

					initGeetest({
					   	// 以下配置参数来自服务端 SDK
					   	gt: data.gt,
					   	challenge: data.challenge,
					   	offline: !data.success,
					   	new_captcha: data.new_captcha
					}, function (captchaObj) {
					   	// 这里可以调用验证实例 captchaObj 的实例方法
					   	console.log(captchaObj);
					   	_this.captchaObj = captchaObj;
					   	_this.captchaObj.appendTo("#captcha"); // 绑定到id为captcha的元素上
						_this.captchaObj.onSuccess(_this.commitVote);
					});
				}
			});
		},
		commitVote : function(){
			$('#captcha').hide();
			$('#loadingToast').show();
			$.ajax({
				url: "geetest/validate", // 进行二次验证
				type: "post",
				dataType: "json",
				data: {
					// 二次验证所需的三个值
					geetest_challenge : $('.geetest_challenge').val(),
					geetest_validate : $('.geetest_validate').val(),
					geetest_seccode : $('.geetest_seccode').val()
				},
				success: function (data) {
					if(data.success){
						if(_this.commiting){
							return alert('正在提交，请稍后');
						}
						_this.commiting = true;
						$.ajax({
							url : 'index/vote',
							type : 'post',
							data : {
								key : _this.key
							},
							success : function(result){
								if(result.success){
									var $span = _this.$btn.parent('div').siblings('.pman-count').find('span');
									$('#t_count').text(parseInt($('#t_count').text()) + 1);
									$('#t_watch').text(parseInt($('#t_count').text()) + 1);
									$span.first().text(parseInt($span.first().text()) + 1);
									$span.last().text(parseInt($span.last().text()) + 1);
									alert(result.msg);
								}else{
									alert(result.msg);
								}
							},
							complete : function(){
								_this.commiting = false;
								$('#loadingToast').hide();
							}
						});
					} else {
						alert('验证失败，请重试');
					}
				},
				complete : function(){
					// $('#captcha').hide();
				}
			});
		}
	};
}(moka));