(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['tui-mathsupport'], factory);
    } else if (typeof exports === 'object') {
        factory(require('tui-mathsupport'));
    } else {
        factory(root['tui-mathsupport']);
    }
})(this, function (tuimath) {
    function extracted(editor) {
        tuimath(editor, true);
        editor.preview.eventManager.listen(
            'previewRenderAfter',
            tuimath.previewRender
        );
    }
    return extracted;
});
