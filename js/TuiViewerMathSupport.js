(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['tui-viewer', 'tui-mathsupport'], factory);
    } else if (typeof exports === 'object') {
        factory(require('tui-viewer'), require('tui-mathsupport'));
    } else {
        factory(root['tui']['Viewer'], root['tui-mathsupport']);
    }
})(this, function (Viewer, tuimath) {
    tuimath(Viewer, false);
});



