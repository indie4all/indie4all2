/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { BankFilters } from "../../../types";
import Config from "../../../config";
import WidgetElement from "../widget/widget.element";

export default class BankElement extends WidgetElement {

    static widget = "Bank";
    static category = "bankWidgets";
    static icon = icon;
    private _filters: BankFilters;

    constructor() { super(); }

    private async connectWithBank(): Promise<any> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        // If the url is relative, add the base url
        const url = /^https?:\/\//i.test(Config.getBankOfWidgetsURL()) ?
            new URL(Config.getBankOfWidgetsURL()) :
            new URL(Config.getBankOfWidgetsURL(), window.location.origin);
        url.search = new URLSearchParams(Object.entries(this.filters)).toString();
        return await fetch(url, { method: 'GET', headers, redirect: 'follow' })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 401 && Config.getUnauthorizedMessage())
                        this.utils.notifyUnauthorizedError(Config.getUnauthorizedMessage());
                    else
                        this.utils.notifyError(this.i18n.value("messages.bankOfWidgetsError"));
                    return null;
                }
                return res.json();
            });
    }

    get form() {
        return this.connectWithBank().then(data => {
            if (!data) throw new Error("Unauthorized.");
            // Get the img corresponding to the widget type
            data.map(elem => elem["img"] = (this.container.getElement(elem.type) as typeof WidgetElement).icon);
            this.data = data;
            const groups = [...new Set(data.map(objeto => objeto.group))].filter(elem => elem != null);
            const types = [...new Set(data.map(objeto => objeto.type))];
            return import('./form.hbs')
                .then((module) => module.default({ groups, types, data, instanceId: this.id }));

        });
    }

    protected get title() { return this.translate("widgets.Bank.modal.modalTitle"); }

    get preview(): string { throw new Error("Method not implemented."); }

    async settingsOpened() {
        const i18n = this.i18n;
        const $form = $('#f-' + this.id);
        const types = [...new Set(this.data.map(objeto => objeto.type))];
        // Add a new filter condition
        $form.on('click', '.btn-add-filter', async function () {
            const { default: modalFilter } = await import('./filters.hbs');
            $("#search-filters").append(modalFilter({ types }));
        });
        // Delete a filter condition
        $form.on('click', '.btn-delete-filter', function () {
            $(this).closest('.search-condition').remove();
        });
        // Switch between search type
        $form.on('change', '.search-field', function () {
            const $parent = $(this).closest('.search-condition');
            const filter = $(this).val();
            const $searchTerm = $parent.find('.search-term');
            const $searchType = $parent.find('.search-type');
            $searchTerm.parent().toggleClass('d-none', filter === "tipo");
            $searchType.parent().toggleClass('d-none', filter !== "tipo");
            $searchTerm.attr('placeholder',
                i18n.value(filter === "tag" ? "widgets.Bank.modal.placeholderTag" : "widgets.Bank.modal.placeholderTitle"));
        });

        $form.on('change', '.select-all-input', function () {
            $(".d-block .input-checkbox").prop('checked', $(this).prop('checked'));
        });

        $form.on('click', ".d-block .input-checkbox", function (e) {
            $form.find('.select-all-input').prop('checked', $form.find(".d-block .input-checkbox:checked").length === $form.find(".d-block .input-checkbox").length);
            e.stopPropagation();
        });

        $form.on("click", ".widget-button", function (e) {
            const checkbox = $(this).find("input[type='checkbox']");
            checkbox.prop("checked", !checkbox.prop("checked"));
            e.preventDefault();
        });

        $form.on('click', ".btn-search", function () {
            const $conditions = $form.find(".search-condition");
            $form.find('.widget-button').each(function () {
                let result: boolean = true;
                const title = $(this).find('h3').text().toLowerCase();
                const type = $(this).find(".input-type").val() as string;
                const tags = $(this).find('.badge').toArray().map((elem: any) => $(elem).text())

                $conditions.each((i, elem) => {
                    const field = ($(elem).find('.search-field').val() as string).toLowerCase().trim();
                    const operation = $(elem).find('.search-operation').val() as string;
                    const searchType = $(elem).find('.search-type').val()
                    const searchTerm = ($(elem).find('.search-term').val() as string).toLowerCase();
                    let resultFilter = true;
                    if (field === "nombre") resultFilter = title.includes(searchTerm);
                    if (field === "tag") resultFilter = tags.some(tag => tag.toLowerCase().includes(searchTerm));
                    if (field === "tipo") resultFilter = (type === searchType);
                    switch (operation) {
                        case 'or': result = result || resultFilter; break;
                        case 'andnot': result = result && !resultFilter; break;
                        default: result = result && resultFilter
                    }
                })
                $(this).toggleClass("d-none", !result).toggleClass("d-block", result);
            })
        });
    }

    updateModelFromForm(form: any): void { }

    get texts() { return null; }
    set texts(texts: any) { }

    validateForm(form: any): string[] {
        const keys: string[] = [];
        const random = form.random;
        const selectedWidgets = form.widget.filter((elem: any) => elem.checked);
        const numRandom = form['random-number'];
        if (random && numRandom > selectedWidgets.length)
            keys.push("Bank.maximumRandomWidgetsExceeded");
        return keys;
    }
    validateModel(): string[] {
        throw new Error("Method not implemented.");
    }

    createElement(): string {
        throw new Error("Method not implemented.");
    }

    public get filters(): BankFilters {
        if (!this._filters) this._filters = { types: this.container.allWidgets.map(ele => ele.widget) };
        return this._filters;
    }

    public set filters(filters: BankFilters) {
        // Set the intersection between ALL the widgets allowed and the widgets specified
        this._filters = { types: this.container.allWidgets.map(ele => ele.widget) };
        this._filters.types = this._filters.types.filter(ele => filters.types && filters.types.includes(ele));
    }
}