function configure_requirejs() {
    requirejs.config({
        //By default load any module IDs from js/lib
        baseUrl: '../bower_components/',
        //except, if the module ID starts with "app",
        //load it from the js/app directory. paths
        //config is relative to the baseUrl, and
        //never includes a ".js" extension since
        //the paths config could be for a directory.
        paths: {
            'tui-editor': 'tui-editor/dist/tui-editor-Editor-all',
            'jquery': 'jquery/dist/jquery',
            'codemirror': 'codemirror/lib/codemirror',
            'markdown-it': 'markdown-it/dist/markdown-it',
            'to-mark': 'to-mark/dist/to-mark',
            'tui-code-snippet': 'tui-code-snippet/dist/tui-code-snippet',
            'tui-color-picker': 'tui-color-picker/dist/tui-color-picker',
            'highlightjs': 'highlightjs/highlight.pack',
            'squire-rte': 'squire-rte/build/squire-raw',
            'plantuml-encoder': 'plantuml-encoder/dist/plantuml-encoder',
            'tui-chart': 'tui-chart/dist/tui-chart',
            'raphael': 'raphael/raphael',
            'mathsupport': '../js/TuiEditorMathSupport',
            'katex': 'katex/dist/katex',
            'markdown-it-mathjax': '../js/markdown-it-mathjax/markdown-it-mathjax',
        }

    });
}
configure_requirejs();

