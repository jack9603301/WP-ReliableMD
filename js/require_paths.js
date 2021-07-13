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
      'jquery': lib_dep + 'jquery/dist/jquery',
      //'codemirror': lib_dep + 'codemirror/lib/codemirror',
      //'to-mark': lib_dep + 'to-mark/dist/to-mark',
      //'highlight.js': lib_dep + 'highlightjs/highlight.pack',
      //'squire-rte': lib_dep + 'squire-rte/build/squire-raw',
      'tui-mathsupport': lib_js + 'TuiMathSupport',
      'latexjs': lib_dep + 'latex.js/dist/latex.js',
      //'eve': lib_dep + 'eve/eve',
      'raphael-core': lib_js + 'raphael/raphael.core',
      'raphael-svg': lib_js + 'raphael/raphael.svg',
      'raphael-vml': lib_js + 'raphael/raphael.vml',
      'raphael': lib_js + 'raphael/raphael.amd',
      'ReliableMD_render': lib_js + 'WPReliableMD_render',
      'htmlToText': lib_js + 'jsHtmlToText',
      'js-yaml': lib_dep + 'js-yaml/dist/js-yaml.min'
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
