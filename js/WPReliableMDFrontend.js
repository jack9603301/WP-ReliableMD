requirejs(['jquery'], function($){
	var hash = function(text){
		var h = 0;
		for(var i = 0; i < text.length; ++i){
			h = h * 10007 + text[i].charCodeAt();
			h %= 1e9 + 7;

		}
		return "" + h;
	};
	var callback = function ($node) {
        	//if($node.parent().attr('class') === 'markdown-block')
        if($node.parent().is(".markdown-block")) {
        	return $node.parent()
        }
		var $new_node = $("<div></div>");
		$node.after($new_node);
		$node.remove();
		return $new_node;
    };
	var cached = function(text)
	{
		var $date = new Date();
		var $time = $date.getTime() / 1000;  //秒差形式
		var $expire = 3600; //secs
		//全局清理缓存功能
		var $global_expire_timestamp = window.localStorage.getItem("rmd_global_expire_timestamp");
		if(!$global_expire_timestamp) {
			$global_expire_timestamp = $time + $expire;
			window.localStorage.setItem("rmd_global_expire_timestamp",$global_expire_timestamp);
		} else if($time - parseInt($global_expire_timestamp) > 0) {
			//开始清理
			for (var $key in window.localStorage) {
				if($key.indexOf('rmd_') === 0 && $key.indexOf('_expire_timestamp')>0 && $key != "rmd_global_expire_timestamp") {
					var $expire_timestamp = window.localStorage.getItem($key);
					if($time - parseInt($expire_timestamp) > 0) {
						//启动清理机制
						window.localStorage.removeItem($key);
						$key = $key.replace('_expire_timestamp', '');
						window.localStorage.removeItem($key);
					}
				}
			}
			$global_expire_timestamp = $time + $expire;
			window.localStorage.setItem("rmd_global_expire_timestamp",$global_expire_timestamp);

		}
		//开始获取缓存
		var $hash = hash(text);
		var $expire_timestamp =  window.localStorage.getItem("rmd_"+$hash+"_expire_timestamp");
		if($time - parseInt($expire_timestamp) > 0) {
			window.localStorage.removeItem("rmd_"+$hash);
			window.localStorage.removeItem("rmd_"+$hash+"_expire_timestamp");
			return null;
		}
		return window.localStorage.getItem("rmd_"+$hash);
	};

	var cnt = 0;
	
	$('.markdown').each(function () {
		var text = $(this).text();
		var ca = cached(text);
		if(ca === null)
			++cnt;
		else{
			console.log("used cache", "rmd_"+hash(text));
			callback($(this)).html(ca).attr('class','viewes-contents');
		}
	});
	if(cnt > 0) {
		requirejs(['ReliableMD_render'], function (render) {
    		render.setCallback(callback);
		});
	}

	$('.posts .viewes-contents .tui-editor-contents').each(function() {
		var text = $(this).html();
		console.log(ReliableMD);
        $.ajax({
            url: ReliableMD.api_root + 'WP-ReliableMD/markdown/render/' + ReliableMD.id,
            //url: ReliableMD.root + 'WPReliableMD/posts/' + post_id,
            method: 'PUT',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-WP-Nonce', ReliableMD.nonce);
            },
            data: text
        }).done(function (response) {
            console.log(response);
			post_id = response.id;
            console.log('Update Object Cached');
        });
	});
	$('.shortcode .viewes-contents .tui-editor-contents').each(function() {
		var text = $(this).html();
		var shortcode = $(this).parents('.shortcode');
		console.log(ReliableMD);
        $.ajax({
            url: ReliableMD.api_root + 'WP-ReliableMD/markdown/render/shortcode',
            //url: ReliableMD.root + 'WPReliableMD/posts/' + post_id,
            method: 'PUT',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-WP-Nonce', ReliableMD.nonce);
            },
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
            	'hash':shortcode.attr('hash'),
            	'cached':text
            })
        }).done(function (response) {
            console.log(response);
            console.log('Update Object Cached');
        });
	});
});
