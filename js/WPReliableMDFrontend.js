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
		return window.localStorage.getItem(hash(text));
	};
	var cnt = 0;
	
	$('.markdown').each(function () {
		var text = $(this).text();
		var ca = cached(text);
		if(ca === null)
			++cnt;
		else{
			console.log("used cache", hash(text));
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
