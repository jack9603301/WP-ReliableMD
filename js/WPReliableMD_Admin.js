// Start the main app logic.
//requirejs(['jquery', 'tui-editor', 'editor-mathsupport', 'htmlToText', 'MarkdowConvertor'], function ($, Editor, mathsupport, htmlToText, MarkdowConvertor) {
//requirejs(['jquery', 'tui-editor', 'tui-chart', 'tui-code-syntax-highlight', 'tui-color-syntax', 'tui-table-merged-cell', 'tui-uml', 'htmlToText', 'MarkdowConvertor', 'editor-mathsupport', 'tui-mathsupport'], function ($, Editor, chart, codeSyntaxHighlight, colorSyntax, TableMergedCell, Uml, htmlToText, MarkdowConvertor, mathsupport, viewerMathsupport) {
requirejs(['jquery', 'htmlToText', 'tui-mathsupport', 'js-yaml'],
  function ($, htmlToText, mathsupport, jsyaml) {
    const Editor  = toastui.Editor;
    const { chart, colorSyntax, codeSyntaxHighlight, tableMergedCell, uml  } = Editor.plugin;
    
    var AricaleMetaCallBackManager = CallBackManager(
      'AricaleMetaCallBackManager'
    );
    var AricaleInitCallBackManager = CallBackManager(
      'AricaleInitCallBackManager'
    );
    var $_GET = (function () {
      var url = window.document.location.href.toString();
      var u = url.split('?');
      if (typeof u[1] === 'string') {
        u = u[1].split('&');
        var get = {};
        for (var i in u) {
          var j = u[i].split('=');
          get[j[0]] = j[1];
        }
        return get;
      } else {
        return {};
      }
    })();

    var initsatus = {
      result: true,
    };

    $(document).ready(function () {
      var editor;
      var content = '';
      var post_id = ReliableMD.post_id;
      if (typeof $_GET['post'] !== 'undefined') {
        content = '';
        $.get(ReliableMD.api_root + 'wp/v2/posts/' + post_id, function (apost) {
          console.log(apost);

          var fontmatter = apost.markdown_fontmatter;

          var raw_md = apost.markdown
            ? apost.content.markdown
            : htmlToText(apost.content.rendered);

          if(fontmatter) {
              content = '---\n';
              content += jsyaml.safeDump(fontmatter);
              content += '---\n';
          } else {
              content = '---\n';
              content += 'title: ' + apost.title.rendered;
              content += '---\n';
          }
          content += raw_md;

          editor.setMarkdown(content);
        });
      } else {
        content = '---\ntitle: Your title here\n---\n';
      }

      if (typeof AricaleInitCallBackManager == 'object') {
        //register

        AricaleInitCallBackManager.registerCallback(function (data, extargs) {
          var value = jQuery('#hidden_post_status').val();
          var text = jQuery('#post_status option[value=' + value + ']').text();
          jQuery('#post-status-display').text(text);
          if (data.result) {
            data.result = true;
          }
          data.post_status_errno = 0;
          return data;
        });

        AricaleInitCallBackManager.registerCallback(function (data, extargs) {
          var value = jQuery('#hidden-post-visibility').val();
          var passwd = jQuery('#hidden-post-password').val();
          if (value == 'private') {
            if (jQuery('#sticky').is(':checked')) {
              text = '私有，只有自己能看到，置顶';
            } else {
              text = '私有，只有自己能看到';
            }
          } else if (value == 'password') {
            if (jQuery('#sticky').is(':checked')) {
              text = '加密的文章，置顶';
            } else {
              text = '加密的文章';
            }
          } else if (value == 'public') {
            if (jQuery('#sticky').is(':checked')) {
              text = '公开，置顶';
            } else {
              text = '公开';
            }
          }
          jQuery('#post-visibility-display').text(text);
          if (data.result) {
            data.result = true;
          }
          data.post_visibility_errno = 0;
          return data;
        });

        AricaleInitCallBackManager.registerCallback(function (data, extargs) {
          var mm = jQuery('#hidden_mm').val();
          var aa = jQuery('#hidden_aa').val();
          var jj = jQuery('#hidden_jj').val();
          var hh = jQuery('#hidden_hh').val();
          var mn = jQuery('#hidden_mn').val();
          var cut_mm = jQuery('#cur_mm').val();
          var cut_aa = jQuery('#cur_aa').val();
          var cut_jj = jQuery('#cur_jj').val();
          var cut_hh = jQuery('#cur_hh').val();
          var cut_mn = jQuery('#cur_mn').val();
          if (
            aa == cut_aa &&
            mm == cut_mm &&
            jj == cut_jj &&
            hh == cut_hh &&
            mn == cut_mn
          ) {
            jQuery('#timestamp b').text('立即');
          } else {
            jQuery('#timestamp b').text(
              aa + '年' + mm + '月' + jj + '日' + hh + '时' + mm + '分'
            );
          }
          if (data.result) {
            data.result = true;
          }
          data.timestamp_errno = 0;
          return data;
        });

        initsatus = AricaleInitCallBackManager.call(initsatus, {
          InitMode: 'Admin',
        });

        console.log(initsatus);

        if (!initsatus.result) {
          console.error(
            'Editor state initialization process execution failed,InitMode: \n' +
              initsatus
          );
          var exception = {
            type: 'AdminEditorSatusInit',
            initsatus: initsatus,
            errorstr:
              'Editor state initialization process execution failed,InitMode: ',
          };

          var ExceptionCallBackManager = CallBackManager(
            'ExceptionCallBackManager'
          );
          ExceptionCallBackManager.call(exception);
        }
      }

      if (typeof AricaleMetaCallBackManager == 'object') {
        AricaleMetaCallBackManager.registerCallback(function (data, extargs) {
          var value = jQuery('#hidden_post_status').val();
          if ('draft_button' in extargs) {
            if (extargs['draft_button']) {
              data.status = value;
            } else {
              data.status = 'publish';
            }
          } else {
            data.status = 'publish';
          }

          return data;
        });
        AricaleMetaCallBackManager.registerCallback(function (data, extargs) {
          var value = jQuery('#hidden-post-visibility').val();
          var passwd = jQuery('#hidden-post-password').val();
          var sticky = jQuery('#sticky').is(':checked');
          data.sticky = sticky;
          if (value == 'password') {
            data.password = passwd;
          } else if (value == 'private') {
            if (!('draft_button' in extargs)) {
              data.status = value;
            }
          }
          return data;
        });
      }
      AricaleMetaCallBackManager.registerCallback(function (data, extargs) {
        var mm = jQuery('#hidden_mm').val();
        var aa = jQuery('#hidden_aa').val();
        var jj = jQuery('#hidden_jj').val();
        var hh = jQuery('#hidden_hh').val();
        var mn = jQuery('#hidden_mn').val();
        var cut_mm = jQuery('#cur_mm').val();
        var cut_aa = jQuery('#cur_aa').val();
        var cut_jj = jQuery('#cur_jj').val();
        var cut_hh = jQuery('#cur_hh').val();
        var cut_mn = jQuery('#cur_mn').val();
        var cut_ss = jQuery('#ss').val();
        var datestr;
        var date = new Date();
        if (
          aa == cut_aa &&
          mm == cut_mm &&
          jj == cut_jj &&
          hh == cut_hh &&
          mn == cut_mn
        ) {
          datestr = new String(date.getFullYear());
        } else {
          date.setFullYear(aa, mm, jj);
          date.setHours(hh);
          date.setMinutes(mn);
          date.setSeconds(cut_ss);
        }
        datestr = date.format('YYYY-MM-DDTHH:mm:SS');
        data.date = datestr;
        return data;
      });

      AricaleMetaCallBackManager.registerCallback(function (data, extargs) {
        var value = jQuery(
          '#post-formats-select input[type=radio]:checked'
        ).val();
        if (value == '0') {
          data.format = 'standard';
        } else {
          data.format = value;
        }
        return data;
      });

      var post = function (draft_button = true) {
        var raw = editor.getMarkdown();
        var title = 'no title';
        /*if (raw.indexOf('#') === 0) {
          raw.replace(/^# *(.+)/, function (s, value) {
            title = value;
          });
          raw = raw.split('\n').slice(1).join('\n');
        }*/
        let fontmatter_reg = /---(.*?)---\n/sg
        var fontmatter = fontmatter_reg.exec(raw);
        var fontmatter_yaml = jsyaml.safeLoad(fontmatter[1]);
        if(fontmatter_yaml.title) {
            title=fontmatter_yaml.title;
            raw = raw.replace(fontmatter[0],"");
        }

        var post_status;

        var data = {
          title: title,
          content: raw,
          markdown: true,
          markdown_fontmatter: fontmatter_yaml
        };

        if (typeof AricaleMetaCallBackManager == 'object') {
          data = AricaleMetaCallBackManager.call(data, {
            draft_button: draft_button,
          });
        }

        if (data !== false) {
          $.ajax({
            url: ReliableMD.api_root + 'wp/v2/posts/' + post_id,
            //url: ReliableMD.root + 'WPReliableMD/posts/' + post_id,
            method: 'POST',
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-WP-Nonce', ReliableMD.nonce);
            },
            data: data,
          }).done(function (response) {
            console.log(response);
            post_id = response.id;
            alert('Posted passage:' + data.status);
          });
          return true;
        } else {
          console.warn(
            'Illegal call, callback function chain call failed, may be parameter error!'
          );
          return false;
        }
      };

      jQuery('#publish').click(function () {
        post(false);
      });

      jQuery('.edit-post-status').click(function () {
        jQuery('#post-status-select').attr('class', 'hide-if-no-js');
      });

      jQuery('.save-post-status').click(function () {
        var text = jQuery('#post_status').find('option:selected').text();
        var value = jQuery('#post_status').find('option:selected').val();
        jQuery('#post-status-display').text(text);
        jQuery('#post-status-select').attr('class', 'hide-if-js');
        jQuery('#hidden_post_status').val(value);
      });

      jQuery('.cancel-post-status').click(function () {
        jQuery('#post-status-select').attr('class', 'hide-if-js');
      });

      jQuery('.edit-visibility').click(function () {
        jQuery('#post-visibility-select').attr('class', 'hide-if-no-js');
      });

      jQuery('.save-post-visibility').click(function () {
        var value = jQuery(
          '#post-visibility-select [type=radio]:checked'
        ).val();
        var passwd = jQuery('#post_password').val();
        var text = value;
        if (value == 'private') {
          if (jQuery('#sticky').is(':checked')) {
            text = '私有，只有自己能看到，置顶';
          } else {
            text = '私有，只有自己能看到';
          }
        } else if (value == 'password') {
          if (jQuery('#sticky').is(':checked')) {
            text = '加密的文章，置顶';
          } else {
            text = '加密的文章';
          }
        } else if (value == 'public') {
          if (jQuery('#sticky').is(':checked')) {
            text = '公开，置顶';
          } else {
            text = '公开';
          }
        }
        jQuery('#post-visibility-display').text(text);
        jQuery('#hidden-post-visibility').val(value);
        jQuery('#hidden-post-password').val(passwd);
        if (jQuery('#sticky').is(':checked')) {
          jQuery('#hidden-post-sticky').attr('checked', 'checked');
        } else {
          jQuery('#hidden-post-sticky').removeAttr('checked');
        }

        jQuery('#post-visibility-select').attr('class', 'hide-if-js');
      });

      jQuery('.cancel-post-visibility').click(function () {
        jQuery('#post-visibility-select').attr('class', 'hide-if-js');
      });

      jQuery('.edit-timestamp').click(function () {
        jQuery('#timestampdiv').attr('class', 'hide-if-no-js');
      });

      jQuery('.save-timestamp').click(function () {
        var aa = jQuery('.timestamp-wrap #aa').val();
        var mm = jQuery('.timestamp-wrap #mm').find('option:selected').val();
        var jj = jQuery('.timestamp-wrap #jj').val();
        var hh = jQuery('.timestamp-wrap #hh').val();
        var mn = jQuery('.timestamp-wrap #mn').val();
        var cut_mm = jQuery('#cur_mm').val();
        var cut_aa = jQuery('#cur_aa').val();
        var cut_jj = jQuery('#cur_jj').val();
        var cut_hh = jQuery('#cur_hh').val();
        var cut_mn = jQuery('#cur_mn').val();
        jQuery('#hidden_mm').val(mm);
        jQuery('#hidden_aa').val(aa);
        jQuery('#hidden_jj').val(jj);
        jQuery('#hidden_hh').val(hh);
        jQuery('#hidden_mn').val(mn);
        if (
          aa == cut_aa &&
          mm == cut_mm &&
          jj == cut_jj &&
          hh == cut_hh &&
          mn == cut_mn
        ) {
          jQuery('#timestamp b').text('立即');
        } else {
          jQuery('#timestamp b').text(
            aa + '年' + mm + '月' + jj + '日' + hh + '时' + mm + '分'
          );
        }
        jQuery('#timestampdiv').attr('class', 'hide-if-js');
      });

      jQuery('.cancel-timestamp').click(function () {
        jQuery('#timestampdiv').attr('class', 'hide-if-js');
      });

      jQuery('#save-post').click(function () {
        post(true);
      });

      jQuery('#post-preview').click(function () {
        post(true);
      });

      window.tagBox.init();

      const chartOptions = {
        minWidth: 100,
        maxWidth: 600,
        minHeight: 100,
        maxHeight: 300,
      };

      //console.log(chart);
      //console.log(codeSyntaxHighlight);
      //console.log(TableMergedCell);
      //console.log(Uml);
      //console.log(mathsupport);
      
      // Set Language
      Editor.setLanguage('zh-CN', {
        Markdown: 'Markdown',
        WYSIWYG: '所见即所得',
        Write: '编辑',
        Preview: '预览',
        Headings: '标题',
        Paragraph: '文本',
        Bold: '加粗',
        Italic: '斜体字',
        Strike: '删除线',
        Code: '内嵌代码',
        Line: '水平线',
        Blockquote: '引用块',
        'Unordered list': '无序列表',
        'Ordered list': '有序列表',
        Task: '任务',
        Indent: '缩进',
        Outdent: '减少缩进',
        'Insert link': '插入链接',
        'Insert CodeBlock': '插入代码块',
        'Insert table': '插入表格',
        'Insert image': '插入图片',
        Heading: '标题',
        'Image URL': '图片网址',
        'Select image file': '选择图片文件',
        'Choose a file': '选择一个文件',
        'No file': '没有文件',
        Description: '说明',
        OK: '确认',
        More: '更多',
        Cancel: '取消',
        File: '文件',
        URL: 'URL',
        'Link text': '链接文本',
        'Add row to up': '向上添加行',
        'Add row to down': '在下方添加行',
        'Add column to left': '在左侧添加列',
        'Add column to right': '在右侧添加列',
        'Remove row': '删除行',
        'Remove column': '删除列',
        'Align column to left': '左对齐',
        'Align column to center': '居中对齐',
        'Align column to right': '右对齐',
        'Remove table': '删除表格',
        'Would you like to paste as table?': '需要粘贴为表格吗?',
        'Text color': '文字颜色',
        'Auto scroll enabled': '自动滚动已启用',
        'Auto scroll disabled': '自动滚动已禁用',
        'Choose language': '选择语言',
      });
      
      function createLatexButton() {
          const button = document.createElement('button');

          button.className = 'toastui-editor-toolbar-icons last';
          button.style.backgroundImage = 'none';
          button.style.margin = '0';
          button.innerHTML = `<i>Latex</i>`;
          button.addEventListener('click', () => {
              editor.exec('latex');
          });

          return button;
      }
      
      function createCustomBlockButton() {
          const button = document.createElement('button');

          button.className = 'toastui-editor-toolbar-icons last';
          button.style.backgroundImage = 'none';
          button.style.margin = '0';
          button.innerHTML = `<i>Custom Block</i>`;
          button.addEventListener('click', () => {
              editor.exec('customblock');
          });

          return button;
      }


      editor = new Editor({
        el: document.querySelector('#editSection'),
        previewStyle: 'vertical',
        height: '600px',
        initialEditType: 'markdown',
        useCommandShortcut: true,
        frontMatter: true,
        language: 'zh-CN',
        initialValue: content,
        customHTMLRenderer: {
          htmlBlock: {
            iframe(node) {
              return [
                { type: 'openTag', tagName: 'iframe', outerNewLine: true, attributes: node.attrs },
                { type: 'html', content: node.childrenHTML },
                { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
              ];
            },
          },
          htmlInline: {
            big(node, { entering }) {
                return entering
                  ? { type: 'openTag', tagName: 'big', attributes: node.attrs }
                  : { type: 'closeTag', tagName: 'big' };
            },
          },
        },
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock'],
          // Using Option: Customize the last button
          [{
              el: createLatexButton(),
              command: 'latex',
              tooltip: 'Latex'
          }],
          [{
              el: createCustomBlockButton(),
              command: 'customblock',
              tooltip: 'Custom block'
          }]
        ],
        plugins: [
          [chart, chartOptions],
          colorSyntax,
          codeSyntaxHighlight,
          tableMergedCell,
          uml,
          mathsupport,
        ],
      });
      
      console.log(editor.insertText)
      
      editor.addCommand('markdown', 'latex', function() {
        editor.insertText('$$latex\n$$\n');
      });
      
      editor.addCommand('wysiwyg', 'latex', function() {
        editor.insertText('$$latex\n$$\n');
      });
      
      editor.addCommand('wysiwyg', 'customblock', function() {
        editor.insertText('$$\n$$\n');
      });
      
      editor.addCommand('markdown', 'customblock', function() {
        editor.insertText('$$\n$$\n');
      });

    });
  }
);
