/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { BankFilters, FormEditData } from "../../../types";
import WidgetElement from "../WidgetElement/WidgetElement";
import Config from "../../../Config";
import Utils from "../../../Utils";
import I18n from "../../../I18n";

export default class WidgetBank extends WidgetElement {

    static widget = "Bank";
    static category = "bankWidgets";
    static icon = icon;

    private filters: BankFilters;

    static async create(): Promise<WidgetElement> {
        return new WidgetBank();
    }

    constructor() {
        super();
    }

    private async connectWithBank(): Promise<any> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        // If the url is relative, add the base url
        const url = /^https?:\/\//i.test(Config.getBankOfWidgetsURL()) ?
            new URL(Config.getBankOfWidgetsURL()) :
            new URL(Config.getBankOfWidgetsURL(), window.location.origin);
        //const url = new URL(Config.getBankOfWidgetsURL());
        if (this.filters) url.search = new URLSearchParams(Object.entries(this.filters)).toString();
        return await fetch(url, { method: 'GET', headers, redirect: 'follow' })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 401 && Config.getUnauthorizedMessage())
                        Utils.notifyUnauthorizedError(Config.getUnauthorizedMessage());
                    else
                        Utils.notifyError(I18n.getInstance().value("messages.bankOfWidgetsError"));
                    return null;
                }
                return res.json();
            });
    }

    async getInputs(): Promise<FormEditData> {
        const data = await this.connectWithBank();
        // The server returned an error or the user is not authorized
        if (!data) throw new Error("Unauthorized.");
        const { default: ModelManager } = await import('../../ModelManager');
        const { default: form } = await import('./form.hbs');
        // Get the img corresponding to the widget type
        data.map(elem => elem["img"] = ModelManager.getWidgetElement(elem.type).icon);
        this.data = data;
        const groups = [...new Set(data.map(objeto => objeto.group))].filter(elem => elem != null);
        const types = [...new Set(data.map(objeto => objeto.type))];
        return { inputs: form({ groups, types, data, instanceId: this.id }), title: this.translate("widgets.Bank.modal.modalTitle") };
    }

    async settingsOpened() {
        const i18n = I18n.getInstance();
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
            $searchTerm.toggleClass('d-none', filter === "tipo");
            $searchType.toggleClass('d-none', filter !== "tipo");
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

    getTexts() {
        throw new Error("Method not implemented.");
    }
    preview(): string {
        throw new Error("Method not implemented.");
    }
    updateModelFromForm(form: any): void {
        throw new Error("Method not implemented.");
    }
    updateTexts(texts: any): void {
        throw new Error("Method not implemented.");
    }
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


    clone(): WidgetBank {
        const widget = new WidgetBank();
        widget.data = structuredClone(this.data);
        return widget;
    }

    getFilters(): BankFilters {
        return this.filters;
    }

    setFilters(filters: BankFilters) {
        this.filters = filters;
    }
}