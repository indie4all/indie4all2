/* global $ */
import I18n from '../../../I18n';

export default {

    /**
     * Initialize the text editor (.texteditor)
     * 
     * @param {string} content Editor text content. Can be empty
     * @param {string} origin String that indicates the widget origin that requested the editor
     */
    initTextEditor: function(content, element) {
        $(element).trumbowyg({
            btns: [
                ['undo', 'redo'], // Only supported in Blink browsers
                ["Format"],
                ['strong', 'em', 'del'],
                ['link'],
                ['unorderedList', 'orderedList'],
                ['removeformat'],
                ['justifyLeft', 'justifyCenter', 'justifyRight'],
                ['whitespace'],
                ['template'],
                ['fullscreen']
            ],
            btnsDef: {
                Format: {
                    dropdown: ['p', 'h1', 'h2', 'h3', 'h4'],
                    ico: 'p'
                }
            },
            minimalLinks: true,
            removeformatPasted: true,
            tagsToRemove: ['script', 'link', 'style', 'img', 'applet', 'embed', 'noframes', 'iframe', 'noscript'],
            plugins: {
                table: {
                    styler: "table"
                },
                templates: [
                    {
                        name: I18n.getInstance().translate("plugins.trumbowyg.templates.code"),
                        html: "\\begin[language]{}Code\\end"
                    },
                    {
                        name: I18n.getInstance().translate("plugins.trumbowyg.templates.screenReader"),
                        html: "\\begin[hidden]{}Help text\\end"
                    }
                ]
            }
        });
        
        // Fix: allow the edition of the trumbowyg link modal
        $('.trumbowyg-createLink-dropdown-button').on('mousedown', function () {
            $('.trumbowyg-modal-box input, .trumbowyg-modal-box button').off('focusin').on('focusin', function(e) { e.stopPropagation(); });     
        });
        if (content) $(element).trumbowyg('html', content);
    },

    /**
     * Clears, optimizes and sanitize the HTML 
     * 
     * @param {*} html Html content 
     */
    clearAndSanitizeHtml: function (html) {
        var temporaryDivElement = document.createElement('div');
        temporaryDivElement.hidden = true;
        temporaryDivElement.innerHTML = html;

        for (let elem of temporaryDivElement.querySelectorAll("*")) {
            // Allow the style attribute for now
            //elem.removeAttribute('style');

            if (elem.innerHTML.trim().length == 0 && elem.tagName !== 'br') {
                elem.remove();
            }
        }

        var finalHtml = temporaryDivElement.innerHTML;

        temporaryDivElement.remove();
        return finalHtml;
    },
    isEmptyText: function (text) {
        var emptyTextRegex = /^(<br>$)/;
        return emptyTextRegex.test(text);
    }
}