(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['tui-editor', 'tui-mathsupport'], factory);
    } else if (typeof exports === 'object') {
        factory(require('tui-editor'), require('tui-mathsupport'));
    } else {
        factory(root['tui']['Editor'], root['tui-mathsupport']);
    }
})(this, function (Editor, tuimath) {
    function extracted() {
        tuimath(Editor, true);
    }
    return extracted;
});
