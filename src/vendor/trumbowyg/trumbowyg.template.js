! function (t) {
    "use strict";

    function e(e) {
        var a = e.o.plugins.templates,
            l = [];
        return t.each(a, (function (t, a) {
            e.addBtnDef("template_" + t, {
                fn: function () {
                    e.html(e.html() + a.html)
                },
                hasIcon: !1,
                title: a.name
            }), l.push("template_" + t)
        })), l
    }
    t.extend(!0, t.trumbowyg, {
        langs: {
            es: {
                template: "Plantilla"
            },
            en: {
                template: "Template"
            },
            da: {
                template: "Skabelon"
            },
            de: {
                template: "Vorlage"
            },
            et: {
                template: "Mall"
            },
            fr: {
                template: "Patron"
            },
            hu: {
                template: "Sablon"
            },
            ja: {
                template: "テンプレート"
            },
            ko: {
                template: "서식"
            },
            nl: {
                template: "Sjabloon"
            },
            pt_br: {
                template: "Modelo"
            },
            ru: {
                template: "Шаблон"
            },
            tr: {
                template: "Şablon"
            },
            zh_tw: {
                template: "模板"
            }
        }
    }), t.extend(!0, t.trumbowyg, {
        plugins: {
            template: {
                shouldInit: function (t) {
                    return t.o.plugins.hasOwnProperty("templates")
                },
                init: function (t) {
                    t.addBtnDef("template", {
                        dropdown: e(t),
                        hasIcon: !1,
                        text: t.lang.template
                    })
                }
            }
        }
    })
}(jQuery);
