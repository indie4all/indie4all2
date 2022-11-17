indieauthor.widgets.Table = {
    widgetConfig: {
        widget: "Table",
        type: "element",
        label: "Table",
        category: "simpleElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function () {
        var itemTemplate = '<div class="palette-item" data-category="{{category}}" data-type="{{type}}" data-widget="{{widget}}"> <img src="' + this.icon + '" class="img-fluid"/> <br/> <span> {{translate "widgets.Table.label"}}</span></div>';
        var item = {};
        item.content = indieauthor.renderTemplate(itemTemplate, this.widgetConfig);
        item.numItems = 1;
        return item;
    },
    createElement: function (widgetInfo) {
        return indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
    },
    template: function () {
        return '<div class="widget widget-table" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"> <div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"></div><div class="b2" data-prev><span>{{translate "widgets.Table.prev"}}</span></div><div class="b3" data-toolbar> </div></div';
    },
    getInputs: function (modelValues) {
        var inputTemplate = `
            <form id="f-{{instanceId}}" class="form-widget-table">
                <div class="form-group">
                    <label for="instanceName">{{translate "common.name.label"}}</label>
                    <input type="text" name="instanceName" class="form-control" value="{{instanceName}}" placeholder="{{translate "common.name.placeholder"}}" autocomplete="off" required/>
                    <small class="form-text text-muted">{{translate "common.name.help"}}</small>
                </div>
                <div class="form-group">
                    <label for="help">{{translate "common.help.label"}}</label>
                    <div class="input-group mb-3"> 
                        <input name="help" type="text" class="form-control" placeholder="{{translate "common.help.placeholder"}}" value="{{help}}">
                        <div class="input-group-append">
                            <button class="btn btn-indie" type="button" onclick="$(\'input[name=help]\').val(\'\')">{{translate "common.help.button"}}</button> 
                        </div>
                    </div>
                    <small class="form-text text-muted">{{translate "common.help.help"}}</small>
                </div>
                <fieldset class="form-group">
                  <div class="row">
                    <legend class="col-form-label col-12 pt-0">{{translate "widgets.Table.form.addColumn.label"}}</legend>
                    <div class="col-8">
                        <label for="instanceName">{{translate "widgets.Table.form.addColumn.columnName.label"}}</label>
                        <input type="text" name="column-name" class="form-control" value="" placeholder="{{translate "widgets.Table.form.addColumn.columnName.placeholder"}}" autocomplete="off"/>
                        <small class="form-text invalid-feedback">{{translate "widgets.Table.form.addColumn.columnName.error"}}</small>
                    </div>
                    <div class="col-4">
                        <label for="text">{{translate "widgets.Table.form.addColumn.columnPosition.label"}}</label>
                        <input type="number" class="form-control" name="column-position" min="0" max="{{numColumns}}" value="0" autocomplete="off"></input>
                        <small class="form-text invalid-feedback">{{translate "widgets.Table.form.addColumn.columnPosition.error"}}</small>
                    </div>
                    <div class="form-group col-12">
                      <button class="btn btn-block btn-indie btn-add-column mt-3">{{translate "widgets.Table.form.addColumn.submit"}}</button>
                    </div>
                  </div>
                </fieldset>
                <div class="table-wrapper">
					<small class="form-text text-muted text-center mb-2">{{translate "widgets.Table.help.edit"}}</small>
                    <table id="table" class="display" style="width:100%"></table>
                    <span class="table-empty">{{translate "widgets.Table.empty"}}</span>
                </div>
            </form>
        `;
        var rendered = indieauthor.renderTemplate(inputTemplate, {
            instanceId: modelValues.id,
            instanceName: modelValues.params.name,
            help: modelValues.params.help,
            numColumns: modelValues.data.columns.length
        });
        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.Table.label
        };
    },
    settingsClosed: function (modelObject) {
        $(`#f-${modelObject.id} input[name="videourl"]`).off('change');
    },
    settingsOpened: function (modelObject) {
        let $form = $('#f-' + modelObject.id);
        const $table = $('#table');
        const deleteColumnStr = jsonpath.query(indieauthor.strings, "$.widgets.Table.form.deleteColumn");
        const deleteColumnIcon = "<button title='" + deleteColumnStr + "' class='btn btn-danger fa fa-times btn-delete-column'></button>";
        let toColumn = (column) => { return { title: column + deleteColumnIcon, data: column } };
        let toRow = (row, idx) => { return { ...row, "DT_RowId": idx } }
        let obj = this;
        let addRow = function (e, dt, node, config) {
            let columns = $table.DataTable().columns().dataSrc().toArray();
            $table.DataTable().row.add(columns.reduce((obj, cur) => (obj[cur] = "", obj), {})).draw();
        };
        let deleteRow = function (e, dt, node, config) {
            $table.DataTable().row($table.find('tr.selected')[0]).remove().draw();
        };
        let addColumn = function (e) {
            e.preventDefault();
            const $inputName = $form.find('input[name="column-name"]');
            const $inputPosition = $form.find('input[name="column-position"]');
            const columns = obj.functions.retrieveUpdatedColumns();
            const name = $inputName.val();
            const pos = parseInt($inputPosition.val());
            const invalidName = !name || columns.includes(name);
            const invalidPosition = pos < 0 || pos > columns.length;
            $inputName.toggleClass('is-invalid', invalidName);
            $inputPosition.toggleClass('is-invalid', invalidPosition);
            if (invalidName || invalidPosition) return; 
            $inputName.val('');
            $inputPosition.val('0');
            let data = [];
            if (DataTable.isDataTable($table)) {
                data = obj.functions.retrieveUpdatedRows();            // Retrieve the table's contents
                data.forEach((row) => row[name] = "");                  // Add the new column
                $table.DataTable().destroy();                           // Destroy previous table instance
                $table.empty();
            }
            columns.splice(pos, 0, name);
            initTable(columns, data);
            $inputPosition.attr('max', columns.length);
        }
        let deleteColumn = function (e) {
            e.preventDefault();
            const pos = $table.find('th').index($(this).closest('th'));
            let data = obj.functions.retrieveUpdatedRows();  // Retrieve the table's contents
            let newColumns = obj.functions.retrieveUpdatedColumns();
            let column = newColumns[pos];
            newColumns.splice(pos, 1);                  // Remove the column from headings
            data.forEach((row) => delete row[column]);  // Remove the column from data
            DataTable.isDataTable($table) && $table.DataTable().destroy();     // Destroy the previous table instance
            $table.empty();                             // Clean the table's HTML
			$form.find('input[name="column-position"]').attr('max', newColumns.length);
            if (newColumns.length) // Rebuild the table
                initTable(newColumns, data);
        }
        let editCell = function (e) {
			// Ignore events emitted by the delete-column children
            if ($(e.target).hasClass('btn-delete-column'))
                return;
            const $self = $(this);
			// Patch to ensure compatibility with keyTables
            let $keyTablesDiv = $self.find('div');
            /**
             * Replaces a cell with an input with its value and updates DataTables contents
             * @param {*} e 
             */
            let restoreValue = function (e) {
                let $cell = $(this).parent();
                // Replace newlines with <br> tags
                let text = $(this).val().replaceAll('\n', '<br>');
                // Replace input with its content
                $(this).parent().empty().html(text);
                // If the cell is a column header, add the delete column action
                if ($cell.is('th')) $cell.html($cell.html() + deleteColumnIcon);
                else $table.DataTable().cell($cell[0]).data(text);
				$table.DataTable().keys.enable();
                if ($keyTablesDiv.length) {
                    $self.prepend($keyTablesDiv);
                    $table.DataTable().cell($self).focus();
                    // Code to avoid creating a focus trap
                    setTimeout(function () {
                        $keyTablesDiv.find('input').trigger('focus');
                    }, 1);
                } else if ($self.is('th'))
                    $self.trigger('focus');
                else if ($self.is('td'))
                    $table.DataTable().cell($self).focus();

            }
            // Disable editing for other cells and update their value
            $table.find('textarea').each(function () {
                $(this).parent()[0] !== $self[0] && restoreValue.apply(this);
            });
            // Prevent editing a cell already being edited
            if ($self.find('textarea').length) return;
            // Disable keytables functionality
            $table.DataTable().keys.disable();
            // Remove keytables div without removing data and events
            $keyTablesDiv.detach();
            // Remove the delete buttons if it's a header
            $self.find('.btn-delete-column').remove();
            // Create the input in the cell with its content
			// Replacing <br> tags with newlines
            let original = $self
                    .html().replaceAll(/<br\s*\/?>/g, '\n');
            let $textarea = $(`<textarea class="table-edit">${original}</textarea>`);
            $self.empty().append($textarea);
            setTimeout(function () {
                $textarea.trigger('focus');
				// Finish editing on blur
				$textarea.on('blur', restoreValue);
				// Finish editing on Enter
				$textarea.on('keypress', function (e) {
                    if (!e.shiftKey && e.key === "Enter") {
						e.preventDefault();
						restoreValue.apply(this, [e]);
					}
				});
			}, 1);
        };
        let initTable = function (columns, data) {
            
            $table.DataTable({
                dom: "Bfrtip",
                columns: columns.map(toColumn),
                data: data.map(toRow),
                select: true,
                ordering: false,
				keys: true,
                buttons: [
                { text: jsonpath.query(indieauthor.strings, "$.widgets.Table.form.addRow"), action: addRow },
                { text: jsonpath.query(indieauthor.strings, "$.widgets.Table.form.deleteRow"), action: deleteRow }]
            });
			
			$table.find('th').attr('tabindex', 0);
            $table.DataTable().on('key', function (e, datatable, key, cell, originalEvent) {
                if (key === 13) {
                    e.preventDefault();
                    editCell.apply(cell.node(), [e]);
                    return false;
                }
            });
        };
        if (modelObject.data.columns.length > 0)
            initTable(modelObject.data.columns, modelObject.data.rows);
        
        $('.btn-add-column').on('click', addColumn);
        $table.on('click', 'th, td:not(.dataTables_empty)', editCell);
		$table.on('keypress', 'th', function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                editCell.apply(this, [e]);
                return false;
            }
        });
        $table.on('click', '.btn-delete-column', deleteColumn);
		// Prevent the enter key from submitting the form when trying to edit a table cell
        $table.on('keypress', function (e) {
            if (e.key === "Enter" && $(e.target).is('input')) e.preventDefault();
        });
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = (modelObject.data.columns.length) ? modelObject.data.columns.map(col => col.replaceAll(/<br\s*\/?>/g, ' ')).join(' | ') : indieauthor.strings.widgets.Table.prev;
    },
    emptyData: function () {
        return {
            params: {
                name: this.widgetConfig.label + "-" + indieauthor.utils.generate_uuid(),
                help: ''
            },
            data: {
                columns: [],
                rows: []
            }
        };
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.params.name = formJson.instanceName;
        modelObject.params.help = formJson.help;
        modelObject.data.rows = this.functions.retrieveUpdatedRows();
        modelObject.data.columns = this.functions.retrieveUpdatedColumns();;
    },
    validateModel: function (widgetInstance) {
        var keys = [];
        if (!indieauthor.utils.hasNameInParams(widgetInstance))
            keys.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(widgetInstance.params.name, widgetInstance.id))
            keys.push("common.name.notUniqueName");
        
        if (!widgetInstance.data.columns.length)
            keys.push("Table.empty");
        if (keys.length > 0) {
            return {
                element: widgetInstance.id,
                keys: keys
            }
        }
        return undefined;
    },
    validateForm: function (formData, instanceId) {
        var keys = [];
        formData.instanceName.length == 0 && keys.push("common.name.invalid");
        !indieauthor.model.isUniqueName(formData.instanceName, instanceId) && keys.push("common.name.notUniqueName");
        if (!this.functions.retrieveUpdatedColumns().length)
            keys.push("Table.empty");
        return keys;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAArlBMVEUAAAB4h5oeN1YwR2MeN1Z4h5oqQl91hJgpQV94h5ooQF0wR2MuRWIeN1YeN1Z4h5oeN1Z4h5p4h5pUZ394h5p4h5p4h5r///94h5oeN1b8hq1hc4n9wtaOm6r8lbdIXHX6SYT5DVzCGFr6MnX6Pn36Onr6J278daL7Z5n7WI/6I2vj5urV2d+qtL/6UYtneI1cboX6LnL5GmQvRmP9pMLgfKJ6iJv7ZpjRRnvCI2JyIpDoAAAAF3RSTlMAQEDQEBD++Ozg2b+sYFAwMNDAoJBwYF3JWpEAAAETSURBVEjH1ZXJbsIwEEADJQVKW7rHSwhpE5wFSAt0/f8fa/AMRkKObS4ovMuTo3eYyJLHq+l1zdx5it41tTG49ZCry2VgZsEp1jd0EVjhA4hHPLAzpzD3xSRwgHbbFy+nDXxjzIfPKp7QBqa7mJCnY2LiHxN3MP56Q/5Ail9NzBh8DGfgKMZzfNI4qyLJjwBX6CzVxEWZSlYCLNbgJGnvDxYikYgSXKJXupnzPJREM3CGjtLTXkpTrBsjfkXWIIVo76WwmEnyBFwJPOvikAF5Ac7Q7PMwNnL28ajv9PK/y9htp2yIjB221ZzTD4hd9uCmbiHGDfvIG9nOizHyQqyMVez3be2Dt2c8NLf3PnRIx0gd/ANxY7W2IhchaQAAAABJRU5ErkJggg==",
    functions: {
        retrieveUpdatedColumns: function () {
            let $ths = $('#table').find('th').clone();
            $ths.find('.btn-delete-column').remove();
            return $ths.map(function () { return $(this).html() }).toArray();
        },
        retrieveUpdatedRows: function () {
            let $table = $('#table');
            let oldColumns = $table.DataTable().columns().dataSrc().toArray();
            let $ths = $('#table').find('th').clone();
            $ths.find('.btn-delete-column').remove();
            let newColumns = $ths.map(function () { return $(this).html() }).toArray();
            // Rename fields and add new field
            let result = [];
            for (let idx = 0; idx < $table.DataTable().rows().count(); idx++) {
                let res = { ...$table.DataTable().row(idx).data() };
                delete res["DT_RowId"];
                for (let i = 0; i < newColumns.length; i++) {
                    if (newColumns[i] !== oldColumns[i]) {
                        res[newColumns[i]] = res[oldColumns[i]];
                        delete res[oldColumns[i]];
                    }
                }
                result.push(res);
            }
            return result;
        }
    }
}