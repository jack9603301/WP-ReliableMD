(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['tui-mathsupport'], factory);
    } else if (typeof exports === 'object') {
        factory(require('tui-mathsupport'));
    } else {
        factory(root['tui-mathsupport']);
    }
})(this, function (tuimath) {
    function extracted(viewer) {
        tuimath(viewer, false);
        var markdownblock = document.querySelector('.markdown-block')
        markdownblock = tuimath.viewerRender(markdownblock);
    }
    return extracted;
});



