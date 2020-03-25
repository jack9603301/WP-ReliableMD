(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['markdown-it-mathsupport', 'katex', 'katex-autorender'], factory);
    } else if (typeof exports === 'object') {
        factory([require('markdown-it-mathsupport'), require('katex'), require('katex-autorender')]);
    } else {
        factory(root['markdown-it-mathsupport'], root['katex'], root['katex-autorender']);
    }
})(this, function (mdi_mathsupport, katex, katex_autorender) {
    function extracted(EditorOrViewer, isEditor) {
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

        /*EditorOrViewer.preview.eventManager.listen("previewRenderAfter", function (html) {
            console.log((html));
            mdi_mathsupport(option);
            return html;
        });*/

        /*if (!isEditor) {
            EditorOrViewer.markdownitHighlight
                .use(mdi_mathsupport(option));
        }*/

        EditorOrViewer.codeBlockManager.setReplacer('latex', function (ltx) {
            return option.renderer(ltx, 'DisplayMath');
        });
        EditorOrViewer.codeBlockManager.setReplacer('inlinelatex', function (ltx) {
            return option.renderer(ltx, 'InlineMath');
        });
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



