/* global $ */
import I18n from "../../../I18n";

export default function RichTextEditorMixin<TBase extends abstract new (...args: any[]) => any>(Base: TBase) {

    const editors = {};

    abstract class RichTextEditor extends Base {

        // Translate navigator language into TinyMCE language file, otherwise it will be displayed in English
        getTinyMCELang(lang: string): string {
            switch (lang) {
                case 'bg': return 'bg_BG';
                case 'fr': return 'fr_FR';
                case 'hu': return 'hu_HU';
                case 'nb': return 'nb_NO';
                case 'pt': return 'pt_BR';
                case 'sl': return 'sl_SI';
                case 'sv': return 'sv_SE';
                default: return lang;
            }
        }

        /**
         * Initialize the text editor (.texteditor)
         * 
         * @param {string} content Editor text content. Can be empty
         * @param {string} element String that indicates the widget origin that requested the editor
         */
        initTextEditor(content: string, selector: string) {
            const i18n = I18n.getInstance();
            import("tinymce/tinymce")
                .then(async ({ default: tinymce }) => {
                    tinymce.init({
                        selector,
                        browser_spellcheck: true,
                        contextmenu: false,
                        language: this.getTinyMCELang(i18n.getLang()),
                        toolbar_mode: 'sliding',
                        promotion: false,
                        base_url: '/vendor/tinymce',
                        plugins: "link, lists, help",
                        invalid_elements: "script,link,style,img,applet,embed,noframes,iframe,noscript",
                        toolbar: "undo redo | bold italic | link | alignleft aligncenter alignright | outdent indent | bullist numlist | customAddWhitespace customAddTemplate",
                        setup: function (editor) {
                            editors[selector] = editor;
                            editor.on('init', function () {
                                editor.setContent(content);
                            });
                            editor.ui.registry.addButton('customAddWhitespace', {
                                icon: 'non-breaking',
                                tooltip: i18n.value("plugins.trumbowyg.whitespace"),
                                onAction: (_) => editor.insertContent('<p>&nbsp;&nbsp;</p>')
                            });
                            editor.ui.registry.addMenuButton('customAddTemplate', {
                                icon: 'template',
                                tooltip: i18n.value("plugins.trumbowyg.templates.text"),
                                fetch: (callback) => {
                                    const items = [{
                                        type: 'menuitem',
                                        text: i18n.value("plugins.trumbowyg.templates.code"),
                                        onAction: () => editor.insertContent('\\begin[language]{}Code\\end')
                                    },
                                    {
                                        type: 'menuitem',
                                        text: i18n.value("plugins.trumbowyg.templates.screenReader"),
                                        onAction: () => editor.insertContent('\\begin[hidden]{}Help text\\end')
                                    }];
                                    // @ts-ignore - TinyMCE types are not up to date
                                    callback(items);
                                },

                            });
                        }
                    });
                });
        }

        onSubmitEditForm(form: any) {
            // Save editor content into the textarea
            Object.keys(editors).forEach(selector => editors[selector].save())
        }

        onHideEditModal() {
            // Destroy the editor
            Object.keys(editors).forEach(selector => editors[selector].remove());
        }
    }

    return RichTextEditor;
}