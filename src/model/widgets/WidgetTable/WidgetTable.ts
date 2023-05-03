/* global $ */
import Utils from "../../../Utils";
import I18n from "../../../I18n";
import "./styles.scss";
import WidgetItemElement from '../WidgetItemElement/WidgetItemElement';
import icon from "./icon.png";
import { ApiColumnsMethods } from "datatables.net-dt";
import { FormEditData, InputWidgetTableData, WidgetTableData, WidgetTableParams } from "../../../types";

export default class WidgetTable extends WidgetItemElement {

    static widget = "Table";
    static category = "simpleElements";
    static icon = icon;

    data: WidgetTableData;
    params: WidgetTableParams;

    static async create(values?: InputWidgetTableData): Promise<WidgetTable> {
        return new WidgetTable(values);
    }

    private retrieveUpdatedColumns() {
        let $ths = $('#table').find('th').clone();
        $ths.find('.btn-delete-column').remove();
        return $ths.map(function () { return $(this).html() }).toArray();
    }

    private retrieveUpdatedRows() {
        let $table = $('#table');
        let oldColumns = (<ApiColumnsMethods>$table.DataTable().columns()).dataSrc().toArray();
        let $ths = $('#table').find('th').clone();
        $ths.find('.btn-delete-column').remove();
        let newColumns = $ths.map(function () { return $(this).html() }).toArray();
        // Rename fields and add new field
        let result: any[] = [];
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

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetTable.widget + "-" + this.id,
            help: ''
        };
        this.data = values?.data ? structuredClone(values.data) : { columns: [], rows: [] };
    }

    clone(): WidgetTable {
        const widget = new WidgetTable();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetTable.widget + "-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help,
            numColumns: this.data.columns.length
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.Table.label")
        };
    }

    getTexts() {
        return {
            "help": this.params.help,
            "columns": this.data.columns,
            "rows": this.data.rows
        }
    }


    settingsClosed(): void {
        $(`#f-${this.id} input[name="videourl"]`).off('change');
    }

    settingsOpened(): void {

        import("datatables.net-dt")
            .then(() => import('datatables.net-dt/css/jquery.dataTables.css'))
            .then(() => import('datatables.net-buttons-dt'))
            .then(() => import('datatables.net-buttons-dt/css/buttons.dataTables.css'))
            .then(() => import('datatables.net-keytable-dt'))
            .then(() => import('datatables.net-keytable-dt/css/keyTable.dataTables.css'))
            .then(() => import('datatables.net-select-dt'))
            .then(() => import('datatables.net-select-dt/css/select.dataTables.css'))
            .then(() => import('datatables.net'))
            .then(({ default: DataTable }) => {
                let $form = $('#f-' + this.id);
                const $table = $('#table');
                const deleteColumnStr = I18n.getInstance().translate("widgets.Table.form.deleteColumn");
                const deleteColumnIcon = "<button type='button' title='" + deleteColumnStr + "' class='btn btn-danger btn-delete-column'><i class='fa fa-times'></i></button>";
                let toColumn = (column: string) => { return { title: column + deleteColumnIcon, data: column } };
                let toRow = (row: any, idx: number) => { return { ...row, "DT_RowId": idx } }
                let obj = this;
                let addRow = function (e: any, dt: any, node: any, config: any) {
                    let columns = (<ApiColumnsMethods>$table.DataTable().columns()).dataSrc().toArray();
                    $table.DataTable().row.add(columns.reduce((obj, cur) => (obj[cur] = "", obj), {})).draw();
                };
                let deleteRow = function (e: any, dt: any, node: any, config: any) {
                    $table.DataTable().row($table.find('tr.selected')[0]).remove().draw();
                };
                let addColumn = function (e: any) {
                    const $inputName = $form.find('input[name="column-name"]');
                    const $inputPosition = $form.find('input[name="column-position"]');
                    const columns = obj.retrieveUpdatedColumns();
                    const name = <string>$inputName.val();
                    const pos = parseInt(<string>$inputPosition.val());
                    const invalidName = !name || columns.includes(name);
                    const invalidPosition = pos < 0 || pos > columns.length;
                    $inputName.toggleClass('is-invalid', invalidName);
                    $inputPosition.toggleClass('is-invalid', invalidPosition);
                    if (invalidName || invalidPosition) return;
                    $inputName.val('');
                    $inputPosition.val('0');
                    let data: any[] = [];
                    if (DataTable.isDataTable($table)) {
                        data = obj.retrieveUpdatedRows();                        // Retrieve the table's contents
                        data.forEach((row) => row[name] = "");                  // Add the new column
                        $table.DataTable().destroy();                           // Destroy previous table instance
                        $table.empty();
                    }
                    columns.splice(pos, 0, name);
                    initTable(columns, data);
                    $inputPosition.attr('max', columns.length);
                }
                let deleteColumn = function (e: any) {
                    e.preventDefault();
                    e.stopPropagation();
                    const pos = $table.find('th').index($(this).closest('th'));
                    let data = obj.retrieveUpdatedRows();  // Retrieve the table's contents
                    let newColumns = obj.retrieveUpdatedColumns();
                    let column = newColumns[pos];
                    newColumns.splice(pos, 1);                  // Remove the column from headings
                    data.forEach((row) => delete row[column]);  // Remove the column from data
                    DataTable.isDataTable($table) && $table.DataTable().destroy();     // Destroy the previous table instance
                    $table.empty();                             // Clean the table's HTML
                    $form.find('input[name="column-position"]').attr('max', newColumns.length);
                    if (newColumns.length) // Rebuild the table
                        initTable(newColumns, data);
                }
                let editCell = function (e: any) {
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
                    let restoreValue = function (e: any) {
                        let $cell = $(this).parent();
                        // Replace newlines with <br> tags
                        let text = (<string>$(this).val()).replaceAll('\n', '<br>');
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
                let initTable = function (columns: string[], data: any[]) {

                    $table.DataTable({
                        dom: "Bfrtip",
                        columns: columns.map(toColumn),
                        data: data.map(toRow),
                        // select option not currently recognised in datatables, but it is allowed
                        // @ts-expect-error 
                        select: true,
                        ordering: false,
                        keys: true,
                        buttons: [
                            { text: I18n.getInstance().translate("widgets.Table.form.addRow"), action: addRow },
                            { text: I18n.getInstance().translate("widgets.Table.form.deleteRow"), action: deleteRow }]
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
                if (this.data.columns.length > 0)
                    initTable(this.data.columns, this.data.rows);

                $('.btn-add-column').on('click', addColumn);
                $table.on('click', 'th, td:not(.dataTables_empty)', editCell);
                $table.on('keypress', 'th', function (e) {
                    if (e.key === "Enter" && !$(e.target).is('button')) {
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
            });
    }

    preview(): string {
        return (this?.data?.columns?.length) ?
            this.data.columns.map((col: any) => col.replaceAll(/<br\s*\/?>/g, ' ')).join(' | ') :
            this.translate("widgets.Table.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.rows = this.retrieveUpdatedRows();
        this.data.columns = this.retrieveUpdatedColumns();
    }

    updateTexts(texts: any): void {
        this.params.help = texts.help;
        const columnTranslations = (texts.columns as any[]).map((col, idx) => [this.data.columns, col]);
        this.data.columns = texts.columns;
        this.data.rows = texts.rows;
        // Replace row headings with their translated column version
        this.data.rows.forEach(row => columnTranslations.forEach(translation => {
            row[translation[1]] = row[translation[0]]
            delete row[translation[0]];
        }));
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        if (!this.data.columns.length) keys.push("Table.empty");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        form.instanceName.length == 0 && keys.push("common.name.invalid");
        if (!this.retrieveUpdatedColumns().length)
            keys.push("Table.empty");
        return keys;
    }
}
