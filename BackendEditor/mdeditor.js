"use strict";
/*global marked:false, hljs:false, $:false, _:false*/


$(function () {
    // Set the navbar active element to the current page
    var pagefile = location.pathname.split('/').pop() || 'index.html';
    $('.nav').find('a[href="' + pagefile + '"]').parent().addClass('active');

    // Set up the live Markdown demo instances
    initMDEditors();

    // Set up the review quotes carousel
    initReviewQuotes();

    // Add on-hover anchor links
    initAnchorLinks();
});


// Adapted from markdown-render.js
function mathify(mathcode) {
  // todo add mathjax.js
}


// Adapted from markdown-render.js
function highlightSyntax(targetDocument, syntaxHighlighter, codeText, codeLanguage) {
    var codeElem, preElem, textNode;

    // highlight.js requires a `<code>` element to be passed in that has a
    // `<pre>` parent element.

    preElem = targetDocument.createElement('pre');
    codeElem = targetDocument.createElement('code');
    textNode = targetDocument.createTextNode(codeText);
    codeElem.appendChild(textNode);
    preElem.appendChild(codeElem);

    // If we're told the language, set it as a class so that the highlighter
    // doesn't have to guess it. This is part of the HTML5 standard. See:
    // http://www.whatwg.org/specs/web-apps/current-work/multipage/text-level-semantics.html#the-code-element
    if (codeLanguage && codeLanguage.length > 0) {
        codeElem.setAttribute('class', 'language-' + codeLanguage);
    }
    else {
        codeElem.setAttribute('class', 'no-highlight');
    }

    syntaxHighlighter.highlightBlock(codeElem);

    return codeElem.innerHTML;
}

/**
 * usage: div.mdeditor>div.mdeditor-raw+div.mdeditor-rendered
 */
function initMDEditors() {
    $('.mdeditor').each(function () {
        var $container = $(this);
        var $raw = $(this).find('.mdeditor-raw');
        var $raw_textarea = $raw.find('textarea');
        var $rendered = $(this).find('.mdeditor-rendered');

        var markedOptions = {
            gfm: true,
            pedantic: false,
            sanitize: false,
            tables: true,
            smartLists: true,
            breaks: true,
            langPrefix: 'language-',
            math: mathify,
            highlight: function (codeText, codeLanguage) {
                return highlightSyntax(
                    $rendered.get(0).ownerDocument,
                    hljs,
                    codeText,
                    codeLanguage);
            }
        };

        $raw_textarea.keyup(function () {
            var html = marked($raw_textarea.val(), markedOptions);
            $rendered.html(html);

            // Make links in the rendered view open in a new tab.
            $rendered.find('a').attr('target', '_blank');
        });

        // The height of the rendered view is determined by the hight of the raw
        $raw.resize(function () {
            $rendered.outerHeight($raw.outerHeight());
        });

        // Trigger the size match
        $raw.resize();

        // Trigger the first render
        $raw_textarea.keyup();
    });
}

function initReviewQuotes() {
    // Our CSP policy prevents eval and Function(), which prevents template function creation.
    // So we're going to pre-compile and include the resulting function here.
    // If the template changes, it can be re-pre-compiled with:
    //   _.template($('#quote-carousel-item-template').text(), null, { variable: 'data' }).source
    var quote_template = function (data) {
        var __t, __p = '', __j = Array.prototype.join, print = function () {
            __p += __j.call(arguments, '');
        };
        __p += '\n<div class="item">\n  <p>\n    ' +
            ((__t = ( data.quote )) == null ? '' : __t) +
            '\n  </p>\n  <p class="text-right">\n    <small>\n      ';
        if (data.stars) {
            _.each(_.range(data.stars), function () {
                __p += ' <i class="icon-star"></i> ';
            })
        }
        __p += '\n      <a href="' +
            ((__t = ( data.link )) == null ? '' : __t) +
            '">' +
            ((__t = ( data.context )) == null ? '' : __t) +
            '</a>\n    </small>\n  </p>\n</div>\n';
        return __p;
    };

    var $quote_carousel = $('.quote-carousel');

    $.getJSON('reviews.json', function (quotes) {
        // Show the quotes in different order each time
        quotes = _.shuffle(quotes);

        // Remove any existing items
        $('.quote-carousel').find('.carousel-inner').children().remove();

        // Add the quotes to the carousel
        $.each(quotes, function () {
            $('.quote-carousel').find('.carousel-inner').append(quote_template({
                quote: fancifyCharacters(this['quote']),
                link: this['link'],
                context: fancifyCharacters(this['context']),
                stars: this['stars']
            }));
        });

        // Set the first quote as active
        $('.quote-carousel').find('.carousel-inner').children().first().addClass('active');

        $('.carousel').carousel({interval: 3000});
    });
}

function fancifyCharacters(str) {
    return str.replace(/"\b/g, '&ldquo;').replace(/\b"/g, '&rdquo;').replace(/\.\.\./g, '&hellip;');
}

function initAnchorLinks() {
    $('*[data-hover-target-for]').each(function () {
        var $anchor = $('<a href="#" class="anchor pull-right"><i class="icon-link"></i></a>')
            .attr('href', '#' + $(this).data('hover-target-for'))
            .css('visibility', 'hidden');
        $(this).append($anchor)
            .hover(
                function () {
                    $anchor.css('visibility', '');
                },
                function () {
                    $anchor.css('visibility', 'hidden');
                });
    });
}
