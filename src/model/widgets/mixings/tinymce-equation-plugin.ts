import { Editor } from 'tinymce';
import "./tinymce-equation-plugin.scss";
import I18n from "../../../I18n";

const plugin = function (editor: Editor, url: string) {

    type EquationData = {
        // Start position of the equation in the editor
        start: number,
        // End position of the equation in the editor
        end: number,
        // The equation text, including the $ delimiters
        match: string,
        // The equation text, excluding the $ delimiters
        term: string
    };

    type InitialDialogData = {
        tex: string
    }

    const i18n = I18n.getInstance();

    /**
     * Retrieves the selected equation, if any
     * @param editor The TinyMCE editor
     * @returns An object with the equation data, or null if there is no equation selected
    */
    const getSelectionIfEquation = (editor: Editor): EquationData => {
        const selection = editor.selection.getNode().textContent;
        const currentCaretPos = editor.selection.getSel().focusOffset;
        for (let match of selection.matchAll(/\$([^$]*)\$/g)) {
            const start = match.index;
            const end = start + match[0].length;
            // The caret is in the current match
            if (currentCaretPos >= start && currentCaretPos <= end) {
                return {
                    start: start,
                    end: end,
                    match: match[0],
                    term: match[1]
                };
            }
        }
        // No match found for the current caret position
        return null;
    };

    /**
     * Opens a modal window to add/edit the equation expression
     * @param equationData 
     * @returns 
     */
    const openDialog = async function (equationData: EquationData) {

        await import('katex/dist/katex.css');
        const { default: katex } = await import('katex');
        const initialData: InitialDialogData = { tex: '' }
        const instructions = i18n.value("plugins.tinymce-equation.help");
        let htmlEquation = "";
        if (equationData) {
            initialData.tex = equationData.term;
            // Render the initial data into the preview
            htmlEquation = katex.renderToString(equationData.term, { throwOnError: false, displayMode: true });
        }

        return editor.windowManager.open({
            title: i18n.value("plugins.tinymce-equation.title"),
            body: {
                type: 'panel',
                items: [
                    { type: 'textarea', name: 'tex', label: i18n.value("plugins.tinymce-equation.label") },
                    {
                        type: 'htmlpanel', html: `
                        <small class="form-text text-muted mt-1 mb-4">${instructions}</small>
                        <div id="equation-editor-preview">${htmlEquation}</div>`
                    }]
            },
            buttons: [{ type: 'cancel', text: i18n.value("general.cancel") }, { type: 'submit', text: i18n.value("general.confirm"), primary: true }],
            initialData,
            onChange: function (api, details) {
                if (details.name === 'tex') {
                    // Refresh the preview
                    const formula = api.getData().tex;
                    const preview = document.querySelector('#equation-editor-preview');
                    // Render the TeX code using KaTeX
                    katex.render(formula, preview, { throwOnError: false, displayMode: true });
                }
            },
            onSubmit: function (api) {
                // Update the content of the editor
                var data = api.getData();
                // If there is a selected equation, replace it with the new one
                if (equationData) {
                    const node = editor.selection.getNode();
                    const text = node.textContent;
                    // Exclude the $ delimiters
                    node.textContent = text.substring(0, equationData.start + 1)
                        + data.tex
                        + text.substring(equationData.end - 1);
                }
                // Otherwise, insert the new equation at the current cursor position 
                else {
                    editor.insertContent('$' + data.tex + '$');
                }
                api.close();
            }
        });
    };

    /* Add a button that opens a window */
    editor.ui.registry.addToggleButton('equation', {
        icon: 'insert-character',
        tooltip: i18n.value("plugins.tinymce-equation.label"),
        onAction: (_) => {
            const equationData = getSelectionIfEquation(editor);
            openDialog(equationData)
        },
        onSetup: (api) => {
            editor.on('NodeChange', () => {
                const result = getSelectionIfEquation(editor);
                api.setActive(!!result);
            });
            // Do nothing on teardown
            return (api) => { };
        }
    });

    /* Return the metadata for the help plugin */
    return {
        getMetadata: function () {
            return {
                name: 'Equation editor',
                url: ''
            };
        }
    };
}

export default plugin;