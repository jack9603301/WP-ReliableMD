function configure_requirejs() {
    var lib_dep = typeof ReliableMD !== 'undefined' ? ReliableMD.js_dep_lib_root : '../bower_components/';
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
            'tui-editor': lib_js + 'tui-editor/tui-editor-Editor-all',
            'tui-viewer': lib_js + 'tui-editor/tui-editor-Viewer-all',
            'jquery': lib_dep + 'jquery/dist/jquery',
            'codemirror': lib_dep + 'codemirror/lib/codemirror',
            'markdown-it': lib_dep + 'markdown-it/dist/markdown-it',
            'to-mark': lib_dep + 'to-mark/dist/to-mark',
            'tui-code-snippet': lib_js + 'tui-code-snippet/tui-code-snippet',
            'tui-color-picker': lib_js + 'tui-color-picker/tui-color-picker',
            'highlight.js': lib_dep + 'highlightjs/highlight.pack',
            'squire-rte': lib_dep + 'squire-rte/build/squire-raw',
            'plantuml-encoder': lib_js + 'plantuml-encoder/plantuml-encoder',
            'tui-chart': lib_js + 'tui-chart/tui-chart',
            'viewer-mathsupport': lib_js + 'TuiViewerMathSupport',
            'editor-mathsupport': lib_js + 'TuiEditorMathSupport',
            'tui-mathsupport': lib_js + 'TuiMathSupport',
            'katex': lib_dep + 'katex/dist/katex',
            'eve': lib_dep + 'eve/eve',
            'raphael-core': lib_js + 'raphael/raphael.core',
            'raphael-svg': lib_js + 'raphael/raphael.svg',
            'raphael-vml': lib_js + 'raphael/raphael.vml',
            'raphael': lib_js + 'raphael/raphael.amd',
            'markdown-it-mathsupport': lib_js + 'markdown-it-mathsupport/markdown-it-mathsupport',
            'ReliableMD_render': lib_js + 'WPReliableMD_render',
            'htmlToText': lib_js + 'jsHtmlToText'
        },
        shim: {
            'raphael': {
                exports: 'Raphael'
            }
        },
        waitSeconds: 30
    });
}

configure_requirejs();

