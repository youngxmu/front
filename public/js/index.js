(function(P){
	var _this = null;
	_this = P.index = {
		$btn : null,
		init : function(){
			_this.userListTpl = juicer($('#user_list_tpl').html());
			_this.voteType = $('#type').val();
			_this.initData();
			_this.initEvent();
			_this.loadData();
			_this.initGeetest();
			//$('#info_dlg').show();
		},
		initData : function(){
		},
		initEvent : function(){
			$('#wrapper').on('click', '.back-top', function(){
				$('body')[0].scrollTop = 0;
			});

			// $('#wrapper').on('click', '.pman-detail .avatar', function(){
			// 	var url = $(this).attr('data-url');
			// 	window.location.href = url;
			// });
			
			$('#wrapper').on('click', '.btn-wrapper span', function(){
				var $this = $(this);
				var id = $this.attr('data-type');
				var val = $this.attr('data-val');
				$this.addClass('active').siblings('span').removeClass('active');
				// _this.loadData();
			});
			// $('#wrapper').on('click', '.btn-vote', function(){
			// 	var $this = $(this);
			// 	_this.key = $this.attr('data-key');
			// 	_this.$btn = $this;
			// 	// _this.captchaObj.refresh();
			// 	$('#captcha').show();
			// });

			$('#wrapper').on('click', '.vote-desc-more', _this.more2);
			$('#wrapper').on('click', '.more', _this.more);
			// $('#wrapper').on('click', '.btn-vote', _this.onCommit);
			$('#wrapper').on('click', '.btn-vote', _this.commitVote);
		},
		showMsg : function(msg){
			$('#info_msg').html(msg);
			$('#info_dlg').show();
		},
		loadData : function(){
			$.ajax({
				url : 'index/list',
				type : 'post',
				data : {
					type : _this.voteType
				},
				beforeSend : function(){
					_this.loadingDlg = weui.loading('正在加载');
				},
				success : function(result){
					if(!result.success){
						return weui.alert(result.msg);
					}
					var tpl = _this.userListTpl;
					$('#user_list').html(tpl.render(result));
				},
				complete : function(){
					_this.loadingDlg.hide();
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
					initGeetest({
					   	// 以下配置参数来自服务端 SDK
					   	gt: data.gt,
					   	challenge: data.challenge,
					   	offline: !data.success,
					   	new_captcha: data.new_captcha,
						product : 'bind'
					}, function (captchaObj) {
					   	// 这里可以调用验证实例 captchaObj 的实例方法
					   	_this.captchaObj = captchaObj;
					   	// captchaObj.appendTo("#captcha"); // 绑定到id为captcha的元素上
						captchaObj.onReady(function(){
						}).onSuccess(function(){
							// $('#captcha').hide();
							var loadingDlg = weui.loading('正在验证');
							var result = captchaObj.getValidate();
					        // ajax 伪代码
							$.ajax({
								url: "geetest/validate", // 进行二次验证
								type: "post",
								dataType: "json",
								data: {
									// 二次验证所需的三个值
									geetest_challenge: result.geetest_challenge,
						            geetest_validate: result.geetest_validate,
						            geetest_seccode: result.geetest_seccode
								},
								success: function (data) {
									if(data.success){
										_this.commitVote();
									} else {
										weui.alert('验证失败，请重试');
									}
								},
								complete : function(){
									loadingDlg.hide();
								}
							});
						});
					});
				}
			});
		},
		onCommit : function(){
			// _this.captchaObj.reset();
			var data = [];
			var $spans = $('.btn-wrapper span.active');
			var length = $spans.length;
			if(length < 12){
				_this.commiting = false;
				return weui.alert('请给所有候选单位（部门）打分！');
			}
			var count1 = 0;
			var count2 = 0;
			$spans.each(function(){
				var $span = $(this);
				var id = $span.attr('data-id');
				var score = $span.attr('data-val');
				data.push({
					id : id,
					score : score
				});
				if(score == 1){
					count1++;
				}
				if(score == 2){
					count2++;
				}
			});
			if(count1 > 3 || count2 > 2){
				_this.commiting = false;
				return weui.alert('每次投票，选择不满意的不得超过3个，不太满意的不得超过2个。');	
			}
			// $('#captcha').show();
			// _this.captchaObj.verify();
			_this.commitVote();
		},
		commitVote : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			if(_this.commiting){
				return weui.alert('正在提交，请稍后');
			}
			_this.commiting = true;

			
			$.ajax({
				url : 'index/vote',
				type : 'post',
				data : {
					id : id
				},
				beforeSend : function(){
					_this.loadingDlg = weui.loading('正在提交');
				},
				success : function(result){
					_this.commiting = false;
					if(result.success){
						// weui.alert('<div class="code"><img src="http://s.act.cnhubei.com/static/reform/img/code.jpg"></div><p style="font-size:0.2rem;">投票成功！长按二维码关注“湖北日报网”微信公众号，随时随地了解最新动态</p>');
						var $count = $this.siblings('.txt-count');
						var count = $count.attr('data-count');
						count = parseInt(count) + 1;
						$count.html(count + '&nbsp;票');
						weui.alert('投票成功');
					}else{
						weui.alert(result.msg);
					}
				},
				complete : function(){
					_this.commiting = false;
					_this.loadingDlg.hide();
				}
			});
		},
		more : function(){
			var $this = $(this);
			var $content = $this.siblings('.pman-desc-content');
			var txt = $this.attr('data-more');
			var $desc = $this.parent('.pman-desc');
			if($this.hasClass('on')){
				txt = $this.attr('data-fold');
				$this.removeClass('on').text('[更多]');
				$desc.removeClass('on');
			}else{
				$this.addClass('on').text('[收起]');
				$desc.addClass('on');
			}
			$content.text(txt);
			
		},
		more2 : function(){
			var $this = $(this);
			var $content = $this.parent('.vote-desc-content');
			var txt = $this.attr('data-more');
			$content.html(txt);
			
		},
		formatInfo : function(info){
			var length = info.length;
			if(length > 70){
				return info.substr(0,65) + '...';
			}
		}
	};
	juicer.register('formatInfo', _this.formatInfo);
}(moka));