// Start the main app logic.
//requirejs(['jquery', 'tui-editor', 'editor-mathsupport', 'htmlToText', 'MarkdowConvertor'], function ($, Editor, mathsupport, htmlToText, MarkdowConvertor) {
//requirejs(['jquery', 'tui-editor', 'tui-chart', 'tui-code-syntax-highlight', 'tui-color-syntax', 'tui-table-merged-cell', 'tui-uml', 'htmlToText', 'MarkdowConvertor', 'editor-mathsupport', 'tui-mathsupport'], function ($, Editor, chart, codeSyntaxHighlight, colorSyntax, TableMergedCell, Uml, htmlToText, MarkdowConvertor, mathsupport, viewerMathsupport) {
requirejs(['jquery', 'tui-editor', 'tui-chart', 'tui-code-syntax-highlight', 'tui-color-syntax', 'tui-table-merged-cell', 'tui-uml', 'htmlToText', 'editor-mathsupport', 'tui-mathsupport'], function ($, Editor, chart, codeSyntaxHighlight, colorSyntax, TableMergedCell, Uml, htmlToText, mathsupport, viewerMathsupport) {
    var $_GET = (function () {
        var url = window.document.location.href.toString();
        var u = url.split("?");
        if (typeof (u[1]) === "string") {
            u = u[1].split("&");
            var get = {};
            for (var i in u) {
                var j = u[i].split("=");
                get[j[0]] = j[1];
            }
            return get;
        } else {
            return {};
        }
    })();


    $(document).ready(
        function () {
            var editor;
            var content;
            var post_id = '';
            if (typeof $_GET['post'] !== 'undefined') {
                post_id = $_GET['post'];
                content = '';
                $.get(ReliableMD.api_root + 'wp/v2/posts/' + post_id, function (apost) {
                    console.log(apost);
                    var raw_md = apost.markdown ? apost.content.markdown : htmlToText(apost.content.rendered);
                    content = ['title: ' + apost.title.rendered, raw_md].join('\n');
                    editor.setMarkdown(content);
                });
            }
            else {
                content = 'title: Your title here';
            }

            //Check whether there is error output and repair automatically!
            if ($(".rmd-editor").length >= 2) {

                $indexsave = $(".rmd-editor").length - 1;

                //It is found that the initialization of the plug-in admin controller has illegal execution. It will automatically repair and delete redundant error elements!
                $(".rmd-editor:lt(" + $indexsave + ")").each(function () {
                    console.warn("It is found that the initialization of the plug-in admin controller has illegal execution. It will automatically repair and delete redundant error elements!")
                    $(this).remove();
                });
            }

            const chartOptions = {
                minWidth: 100,
                maxWidth: 600,
                minHeight: 100,
                maxHeight: 300
            };


            editor = new Editor({
                el: document.querySelector('#editSection'),
                previewStyle: 'vertical',
                height: '600px',
                initialEditType: 'markdown',
                useCommandShortcut: true,
                initialValue: content,
                plugins: [
                    [
                        chart,
                        chartOptions
                    ],
                    codeSyntaxHighlight,
                    TableMergedCell,
                    Uml,
                    mathsupport
                ],
                //customConvertor: MarkdowConvertor
            });

            console.log(editor.preview.eventManager);

            //editor.preview.eventManager.listen('convertorAfterMarkdownToHtmlConverted', viewerMathsupport.viewerRender)

            editor.preview.eventManager.listen("previewRenderAfter", viewerMathsupport.previewRender);

            var post = function (args) {
                var raw = editor.getMarkdown();
                var title = 'no title';
                if (raw.indexOf('title:') === 0) {
                    raw.replace(/^title: *(.+)/, function (s, value) {
                        title = value;
                    });
                    raw = raw.split('\n').slice(1).join('\n');
                }

                $.ajax({
                    url: ReliableMD.api_root + 'wp/v2/posts/' + post_id,
                    //url: ReliableMD.root + 'WPReliableMD/posts/' + post_id,
                    method: 'POST',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-WP-Nonce', ReliableMD.nonce);
                    },
                    data: {
                        'title': title,
                        'content': raw,
                        'status': args["status"],
                        'markdown': true
                    }
                }).done(function (response) {
                    console.log(response);
                    post_id = response.id;
                    alert('Posted passage:' + args["status"]);
                });


            };
            jQuery('#publish').click(function () {
                post({
                    status: 'publish'
                });
            });

            jQuery(".edit-post-status").click(function () {
                jQuery("#post-status-select").attr("class", "hide-if-no-js");
            });

            jQuery(".save-post-status").click(function () {
                var text = jQuery("#post_status").find("option:selected").text();
                jQuery("#post-status-display").text(text);
                jQuery("#post-status-select").attr("class", "hide-if-js");
            });

            jQuery(".cancel-post-status").click(function () {
                jQuery("#post-status-select").attr("class", "hide-if-js");
            });

            jQuery(".edit-visibility").click(function () {
                jQuery("#post-visibility-select").attr("class", "hide-if-no-js");
            });

            jQuery(".save-post-visibility").click(function () {
                var value = jQuery("#post-visibility-select [type=radio]:checked").val();
                var text = value;
                if (value == "private") {
                    text = "私有，只有自己能看到";
                } else if (value == "password") {
                    text = "加密的文章";
                } else if (value == "public") {
                    if (jQuery("#sticky").is(':checked')) {
                        text = "公开，置顶";
                    } else {
                        text = "公开";
                    }
                }
                jQuery("#post-visibility-display").text(text);
                jQuery("#post-visibility-select").attr("class", "hide-if-js");

            });

            jQuery(".cancel-post-visibility").click(function () {
                jQuery("#post-visibility-select").attr("class", "hide-if-js");
            });

            jQuery(".edit-timestamp").click(function () {
                jQuery("#timestampdiv").attr("class", "hide-if-no-js");
            });

            jQuery(".save-timestamp").click(function () {
                var aa = jQuery(".timestamp-wrap #aa").val();
                var mm = jQuery(".timestamp-wrap #mm").find("option:selected").val();
                var jj = jQuery(".timestamp-wrap #jj").val();
                var hh = jQuery(".timestamp-wrap #hh").val();
                var mn = jQuery(".timestamp-wrap #mn").val();
                jQuery("#timestamp b").text(aa + "年" + mm + "月" + jj + "日" + hh + "时" + mm + "分");
                jQuery("#timestampdiv").attr("class", "hide-if-js");
            });

            jQuery(".cancel-timestamp").click(function () {
                jQuery("#timestampdiv").attr("class", "hide-if-js");
            });

            jQuery("#post-preview").click(function () {
                post({
                    status: 'draft'
                });
            });

        }
    );
});

