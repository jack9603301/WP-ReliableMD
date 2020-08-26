(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['tui-viewer','tui-editor','markdown-it-mathsupport', 'katex', 'katex-autorender'], factory);
    } else if (typeof exports === 'object') {
        factory([require('tui-viewer'),require('tui-editor'),require('markdown-it-mathsupport'), require('katex'), require('katex-autorender')]);
    } else {
        factory(root['tui']['Viewer'],root['tui']['Editor'],root['markdown-it-mathsupport'], root['katex'], root['katex-autorender']);
    }
})(this, function (Viewer,Editor,mdi_mathsupport, katex, katex_autorender) {
    function extracted(EditorOrViewer, isEditor) {
        EditorOrViewer.setCodeBlockLanguages([
            'latex',
            'inlinelatex'
        ]);
        var math_render = katex.renderToString;
        var option = {
            renderer: function (text, type) {
                if (type === 'InlineMath') {
                    return '<span style="display: inline;">' + math_render(text, {
                        displayMode: false,
                        throwOnError: false
                    }) + '</span>'
                }
                else // type === 'DisplayMath'
                {
                    return '<span style="display: block;">' + math_render(text, {
                        displayMode: true,
                        throwOnError: false
                    }) + '</span>'
                }
            }
        };

        if(isEditor) {
            Editor.codeBlockManager.setReplacer('latex', function (ltx) {
                return option.renderer(ltx, 'DisplayMath');
            });
            Editor.codeBlockManager.setReplacer('inlinelatex', function (ltx) {
                return option.renderer(ltx, 'InlineMath');
            });
        } else {
            Viewer.codeBlockManager.setReplacer('latex', function (ltx) {
                return option.renderer(ltx, 'DisplayMath');
            }); 
            Viewer.codeBlockManager.setReplacer('inlinelatex', function (ltx) {
                return option.renderer(ltx, 'InlineMath');
            });
        }
    }

    extracted.previewRender = function (html) {
        var option = {
            delimiters: [
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true }
            ]
        };


        //var mathrender = mdi_mathsupport(option);
        console.log(html);
        //html.el.innerHTML = mathrender(html.el.innerHTML);
        //mathrender(html);
        katex_autorender(html.el, option);
        //html.el.innerHTML = math_render(html.el.innerHTML, option);
        return html;
    }

    extracted.viewerRender = function (el) {
        var option = {
            delimiters: [
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true }
            ]
        };


        //var mathrender = mdi_mathsupport(option);
        console.log(el);
        //html.el.innerHTML = mathrender(html.el.innerHTML);
        //mathrender(html);
        katex_autorender(el, option);
        //html.el.innerHTML = math_render(html.el.innerHTML, option);
        return el;
    }

    return extracted;
});



