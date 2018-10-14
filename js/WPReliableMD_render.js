define(['jquery', 'tui-viewer', 'viewer-mathsupport'], function ($, Viewer) {
	var hash = function(text){
		// if you wanna enable cache, the hash function must be the same as it in WP-ReliableMDFrontend.js
		var h = 0;
		for(var i = 0; i < text.length; ++i){
			h = h * 10007 + text[i].charCodeAt();
			h %= 1e9 + 7;
		}
		return "" + h;
	};
    var callback = function ($node) {
        return $node;
    };
    var renderer = {};
    renderer.setCallback = function (func) {
        callback = func;
    };
    renderer.entityToString = function (s) {
        s = s.replace(/&#8211;/g, '-');
        s = s.replace(/&lt;/g, '<');
        s = s.replace(/&gt;/g, '>');
	s = s.replace(/&br;/g, '\n');
        return s;
    };
	var save_cache = function(text, rendered){
		console.log("saved cache", hash(text));
		window.localStorage.setItem(hash(text), rendered);
	};
	
    renderer.render = function () {
        $('.markdown').each(function () {
            var text = $(this).val() || $(this).html();
            var ele = callback($(this));
            ele.html('');
            ptext = renderer.entityToString(text);

            //console.log(text);

            var viewer = new Viewer({
                el: ele[0],
                viewer: true,
                initialValue: ptext,
                exts: [
                    {
                        name: 'chart',
                        minWidth: 100,
                        maxWidth: 600,
                        minHeight: 100,
                        maxHeight: 300
                    },
                    'colorSyntax',
                    'uml',
                    'mark',
                    'table',
                    'mathsupport'
                ]
            });
            $('[data-te-task]').removeAttr('data-te-task');
			setTimeout(function(){save_cache(text, ele.html());}, 3000);
        });
    };
    // usage: make a div with class markdown, write it in markdown, and it will be converted into html
    // warnning: your markdwon text must be aligned from left
    $(document).ready(function () {
        renderer.render();
    });
    //module.exports = renderer;
    return renderer;
});

