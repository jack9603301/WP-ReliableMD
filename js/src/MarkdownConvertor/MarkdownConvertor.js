requirejs(['tui-editor','katex'],function(Editor,katex) {
    class MarkdownConvertor extends Editor.Convertor {
        constructor(em) {
            super(em);
        }
        toHTML(markdown) {
            var math_render = katex.renderToString;
            var option = {
                renderer: function (text, type) {
                    if (type === 'InlineMath') {
                        return '<span style="display: inline;">' + math_render(text, {displayMode: false}) + '</span>'
                    }
                    else // type === 'DisplayMath'
                    {
                        return '<span style="display: block;">' + math_render(text, {displayMode: true}) + '</span>'
                    }
                }
            };
            markdown = option.renderer(markdown);
            markdown = option.renderer(markdown, 'DisplayMath');
            return super.toHTML(markdown);
        }
    }
    module.exports.MarkdownConvertor = MarkdownConvertor;
});