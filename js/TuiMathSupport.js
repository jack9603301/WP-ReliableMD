(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        factory();
    } else {
        factory();
    }
})(this, function () {
    
    function latex() {
        const toHTMLRenderers = {
            latex(node) {
                const generator = new latexjs.HtmlGenerator({ hyphenate: true });
                const { body } = latexjs.parse(node.literal, { generator }).htmlDocument();
                
                return [
                    { type: 'openTag', tagName: 'div', outerNewLine: true },
                    { type: 'html', content: body.innerHTML },
                    { type: 'closeTag', tagName: 'div', outerNewLine: true }
                ];
            }
        }
        return { toHTMLRenderers };
    }
    
    return latex;
    
});
