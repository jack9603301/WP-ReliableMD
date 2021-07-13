define(['jquery','tui-mathsupport'], function ($, mathsupport) {
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
    s = s.replace(/&quot;/g, '"');
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

      var viewerLoader = function () {
        setTimeout(function () {
          var is_saved = true;
          ele.find('.toastui-chart-wrapper').each(function () {
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
      const { chart, colorSyntax, codeSyntaxHighlight, tableMergedCell, uml  } = Viewer.plugin;

      const chartOptions = {
        minWidth: 100,
        maxWidth: 600,
        minHeight: 100,
        maxHeight: 300
      };
      
      const reWidgetRule = /\[(@\S+)\]\((\S+)\)/;
      const atWidgetRule = /\((@\S+)\)/;
      
      function test(model) {
        console.log(model)
        return model
      }
      
      const WidgetRules = [
        {
          rule: atWidgetRule,
          toDOM(text) {
            const rule = atWidgetRule;
            const matched = text.match(rule);
            const span = document.createElement('span');
  
            span.innerHTML = `<a class="widget-anchor">${matched[1]}</a>`;
            return span;
          },
        },
        {
          rule: reWidgetRule,
          toDOM(text) {
            const rule = reWidgetRule;
            const matched = text.match(rule);
            const span = document.createElement('span');
  
            span.innerHTML = `<a class="widget-anchor" href="${matched[2]}">${matched[1]}</a>`;
            return span;
          },
        },
      ];
      
      var StopSearch = false;
      
      //Support WidgetRule conversion compatible with editor
      while(!StopSearch) {
        WidgetRules.forEach(function(item) {
          const rule = item.rule;
          const matched = ptext.match(rule);
          if(matched) {
            var body = item.toDOM(matched[0]);
            ptext = ptext.replace(matched[0], body.innerHTML)
          } else {
            StopSearch = true
          }
        });
      };
      
      var options = {
        el: ele[0],
        viewer: true,
        useCommandShortcut: true,
        frontMatter: true,
        initialValue: ptext,
        customHTMLRenderer: {
          htmlBlock: {
            iframe(node) {
              return [
                { type: 'openTag', tagName: 'iframe', outerNewLine: true, attributes: node.attrs },
                { type: 'html', content: node.childrenHTML },
                { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
              ];
            },
          },
          htmlInline: {
            big(node, { entering }) {
                return entering
                  ? { type: 'openTag', tagName: 'big', attributes: node.attrs }
                  : { type: 'closeTag', tagName: 'big' };
            },
          },
          linebreak(node, context) {
            return {
              type: 'html',
              content: '\n<br />\n'
            }
          }
        },
        events: {
          load: viewerLoader
        },
        plugins: [
          [
            chart,
            chartOptions
          ],
          codeSyntaxHighlight,
          tableMergedCell,
          uml,
          mathsupport,
          test
        ]
      };

      var viewer = new Viewer.factory(options);
      console.log(viewer);


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
