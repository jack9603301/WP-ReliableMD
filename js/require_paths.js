function configure_requirejs() {
    var lib_dep = typeof ReliableMD !== 'undefined' ? ReliableMD.js_dep_lib_root : '../node_modules/';
    var lib_js = typeof ReliableMD !== 'undefined' ? ReliableMD.js_root : '../js/';
    requirejs.config({
        //By default load any module IDs from js/lib
        baseUrl: lib_dep,
        //except, if the module ID starts with "app",
        //load it from the js/app directory. paths
        //config is relative to the baseUrl, and

        //never require the same module with different names

        //never includes a ".js" extension since
        //the paths config could be for a directory.

        //***********fixed**********
        // Do not define a module name like "highlight.js"
        // for it will be explained as a path, rather than a module name
        // fixed by QiuJiangkun before 2018/10/8
        //**************************


        paths: {
            'tui-editor': lib_dep + '@toast-ui/editor/dist/toastui-editor',
            'tui-viewer': lib_dep + '@toast-ui/editor/dist/toastui-editor-viewer',
            'jquery': lib_dep + 'jquery/dist/jquery',
            'codemirror': lib_dep + 'codemirror/lib/codemirror',
            'markdown-it': lib_dep + 'markdown-it/dist/markdown-it',
            'to-mark': lib_dep + 'to-mark/dist/to-mark',
            'tui-code-snippet': lib_js + 'tui-code-snippet/tui-code-snippet',
            'tui-color-picker': lib_js + 'tui-color-picker/tui-color-picker',
            'highlight.js': lib_dep + 'highlightjs/highlight.pack',
            'squire-rte': lib_dep + 'squire-rte/build/squire-raw',
            'plantuml-encoder': lib_js + 'plantuml-encoder/plantuml-encoder',
            'tui-chart': '//uicdn.toast.com/editor-plugin-chart/latest/toastui-editor-plugin-chart.min',
            'tui-code-syntax-highlight': '//uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight-all.min',
            'tui-color-syntax': '//uicdn.toast.com/editor-plugin-color-syntax/latest/toastui-editor-plugin-color-syntax.min',
            'tui-table-merged-cell': '//uicdn.toast.com/editor-plugin-table-merged-cell/latest/toastui-editor-plugin-table-merged-cell.min',
            'tui-uml': '//uicdn.toast.com/editor-plugin-uml/latest/toastui-editor-plugin-uml.min',
            'viewer-mathsupport': lib_js + 'TuiViewerMathSupport',
            'editor-mathsupport': lib_js + 'TuiEditorMathSupport',
            'tui-mathsupport': lib_js + 'TuiMathSupport',
            'katex': lib_dep + 'katex/dist/katex',
            'katex-autorender': lib_dep + 'katex/dist/contrib/auto-render.min',
            'eve': lib_dep + 'eve/eve',
            'raphael-core': lib_js + 'raphael/raphael.core',
            'raphael-svg': lib_js + 'raphael/raphael.svg',
            'raphael-vml': lib_js + 'raphael/raphael.vml',
            'raphael': lib_js + 'raphael/raphael.amd',
            'markdown-it-mathsupport': lib_js + 'markdown-it-mathsupport/markdown-it-mathsupport',
            'ReliableMD_render': lib_js + 'WPReliableMD_render',
            'htmlToText': lib_js + 'jsHtmlToText',
            'MarkdowConvertor': lib_js + 'MarkdownConvertor'
        },
        shim: {
            'raphael': {
                exports: 'Raphael'
            }
        },
        waitSeconds: 60
    });
}

configure_requirejs();

