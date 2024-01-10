const plugin = async function(editor, url) {
    console.log("HELLO WORLDDD!", editor);
    await import('katex/dist/katex.css');
    const {default: katex} = await import('katex');

    var openDialog = function () {
        return editor.windowManager.open({
        title: 'Equation editor',
        body: {
            type: 'panel',
            items: [
            {
                type: 'textarea',
                name: 'tex',
                label: 'Edit equation using TeX'
            },
            {
                type: 'htmlpanel',
                html: '<div class="equation-preview"></div>'
            }
            ]
        },
        buttons: [
            {
            type: 'cancel',
            text: 'Cerrar'
            },
            {
            type: 'submit',
            text: 'Guardar',
            primary: true
            }
        ],
        onChange: function (api, details) {
            if (details.name === 'tex') {
                const formula = api.getData().tex;
                const preview = document.querySelector('.tox-dialog .equation-preview');
                // Render the TeX code using KaTeX
                katex.render(formula, preview, {throwOnError: false});
            }
        },
        onSubmit: function (api) {
            var data = api.getData();
            window.editor = editor;
            /* Insert content when the window form is submitted */
            editor.insertContent('$' + data.tex + '$');
            api.close();
        }
        });
    };

    console.log("ADDING EQUATION BUTTON");
    /* Add a button that opens a window */
    editor.ui.registry.addButton('equation', {
        icon: 'insert-character',
        onAction: (_) => openDialog()
    });
    
    /* Return the metadata for the help plugin */
    return {
        getMetadata: function () {
        return  {
            name: 'Equation editor',
            url: 'http://exampleplugindocsurl.com'
        };
        }
    };
}

export default plugin;