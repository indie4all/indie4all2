(function ($) {
    'use strict';

    // Plugin default options
    var defaultOptions = {
    };

    // If the plugin is a button
    function buildButtonDef(trumbowyg) {
        return {
            hasIcon: false,
            fn: function () {
                var existingCode = trumbowyg.html();
                existingCode += '<p>&nbsp;</p>';
                trumbowyg.html(existingCode);
            }
        }
    }

    $.extend(true, $.trumbowyg, {
        // Add some translations
        langs: {
            en: {
                whitespace: 'Whitespace'
            },
            es: {
                whitespace: 'Espacio en blanco'
            }
        },
        // Register plugin in Trumbowyg
        plugins: {
            whitespace: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.whitespace = $.extend(true, {},
                        defaultOptions,
                        trumbowyg.o.plugins.whitespace || {}
                    );

                    // If the plugin is a button
                    trumbowyg.addBtnDef('whitespace', buildButtonDef(trumbowyg));
                },
                tagHandler: function (element, trumbowyg) {
                    return [];
                },
                destroy: function (trumbowyg) {
                }
            }
        }
    })
})(jQuery);
