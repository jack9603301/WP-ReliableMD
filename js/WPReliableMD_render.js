define(['jquery','tui-mathsupport'], function ($, tuimath) {
    var hash = function (text) {
        // if you wanna enable cache, the hash function must be the same as it in WP-ReliableMDFrontend.js
        var h = 0;
        for (var i = 0; i < text.length; ++i) {
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
    var save_cache = function (text, rendered) {
        var $date = new Date();
        var $expire = 3600; //secs
        var $expire_timestamp = $date.getTime() / 1000 + $expire;  //秒差形式
        var $hash = hash(text);
        window.localStorage.setItem("rmd_" + $hash + "_expire_timestamp", $expire_timestamp);
        window.localStorage.setItem("rmd_" + $hash, rendered);
        console.log("save cache", "rmd_" + $hash);
    };

    renderer.render = function () {
        $('.markdown').each(function () {
            var text = $(this).text();
            var ele = callback($(this));
            ele.html('');
            ptext = renderer.entityToString(text);

            //console.log(text);

            var viewerLoader = function () {
                setTimeout(function () {
                    var is_saved = true;
                    ele.find('.tui-chart-series-custom-event-area').each(function () {
                        is_saved = false;
                        console.warn("Front-end browser cache processing is disabled due to the dynamic process of using tui-chart chart rendering.");
                    })
                    if (is_saved) {
                        save_cache(ptext, ele.html()); //使用tui-chart图表的文章，不能使用前端缓存
                    }
                }, 3000);
                console.log('loaded');
            }

            const Viewer  = toastui.Editor;

            const chartOptions = {
                minWidth: 100,
                maxWidth: 600,
                minHeight: 100,
                maxHeight: 300
            };

            var viewer = new Viewer({
                el: ele[0],
                viewer: true,
                frontMatter: true,
                initialValue: ptext,
                events: {
                    load: viewerLoader
                },
                /*plugins: [
                    [
                        chart,
                        chartOptions
                    ],
                    codeSyntaxHighlight,
                    TableMergedCell,
                    Uml,
                    mathsupport
                ],*/
            });
            console.log(viewer);

            var markdownblock = document.querySelector('.markdown-block')
            markdownblock = tuimath.viewerRender(markdownblock);


            $('[data-te-task]').removeAttr('data-te-task');
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
