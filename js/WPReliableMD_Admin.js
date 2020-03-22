// Start the main app logic.
requirejs(['jquery', 'tui-editor', 'editor-mathsupport', 'htmlToText','MarkdowConvertor'], function ($, Editor, mathsupport, htmlToText,MarkdowConvertor) {
    var $_GET = (function () {
        var url = window.document.location.href.toString();
        var u = url.split("?");
        if (typeof(u[1]) === "string") {
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
                    editor.setValue(content);
                });
            }
            else {
                content = 'title: Your title here';
            }

            //Check whether there is error output and repair automatically!
            if($(".rmd-editor").length >= 2) {

                $indexsave = $(".rmd-editor").length - 1;

                //It is found that the initialization of the plug-in admin controller has illegal execution. It will automatically repair and delete redundant error elements!
                $(".rmd-editor:lt(" + $indexsave + ")").each(function() {
                    console.warn("It is found that the initialization of the plug-in admin controller has illegal execution. It will automatically repair and delete redundant error elements!")
                    $(this).remove();
                });
            }


            editor = new Editor({
                el: document.querySelector('#editSection'),
                previewStyle: 'vertical',
                height: '400px',
                initialEditType: 'markdown',
                useCommandShortcut: true,
                initialValue: content,
                exts: [
                    {
                        name: 'chart',
                        minWidth: 100,
                        maxWidth: 600,
                        minHeight: 100,
                        maxHeight: 300
                    },
                    'scrollSync',
                    'colorSyntax',
                    'uml',
                    'mark',
                    'table',
                    'mathsupport'
                ],
                customConvertor: MarkdowConvertor
            });

            var post = function () {
                var raw = editor.getValue();
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
                        'status': 'publish',
                        'markdown': true
                    }
                }).done(function (response) {
                    console.log(response);
					post_id = response.id;
                    alert('Posted passage');
                });


            };
            jQuery('#submit').click(post);

        }
    );
});

