(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['markdown-it-mathsupport', 'katex'], factory);
    } else if (typeof exports === 'object') {
        factory([require('markdown-it-mathsupport'), require('katex')]);
    } else {
        factory(root['markdown-it-mathsupport'], root['katex']);
    }
})(this, function (mdi_mathsupport, katex) {
    function extracted(EditorOrViewer, isEditor) {
        var math_render = katex.renderToString;
        var option = {
            renderer: function (text, type) {
                if (type === 'InlineMath') {
                    return '<span style="display: inline;">' + math_render(text, { displayMode: false }) + '</span>'
                }
                else // type === 'DisplayMath'
                {
                    return '<span style="display: block;">' + math_render(text, { displayMode: true }) + '</span>'
                }
            }
        };

        console.log(EditorOrViewer);

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

    return extracted;
});



