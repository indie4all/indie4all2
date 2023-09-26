import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import template from "./template.hbs";
import icon from "./icon.png";
import { FormEditData, InputWidgetRouletteItemData } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import Config from "../../../Config";

export default class WidgetRouletteItem extends WidgetContainerSpecificElement {

    static widget = "RouletteItem";
    static icon = icon;

    static async create(values?: InputWidgetRouletteItemData): Promise<WidgetRouletteItem> {
        const container = new WidgetRouletteItem(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => ModelManager.create(elem.widget, elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetRouletteItemData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {

        };
    }

    createElement(): string {
        const constructor = WidgetRouletteItem;
        const children = this.data ? this.data.map((child: WidgetSpecificItemElement) => child.createElement()).join('') : "";
        return template({
            id: this.id,
            widget: constructor.widget,
            icon: constructor.icon,
            label: this.preview(),
            canAdd: constructor.addable,
            canEdit: constructor.editable,
            canDelete: constructor.deletable,
            canCopy: constructor.copyable,
            canLoadFromBank: !!Config.getQuestionsBankURL(),
            children,
            cssClass: Utils.toKebabCase(constructor.name)
        });
    }

    clone(): WidgetRouletteItem {
        const widget = new WidgetRouletteItem();
        widget.params = structuredClone(this.params);
        // widget.params.name = WidgetRouletteItem.widget + "-" + widget.id;
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            nameCategory: this.params.nameCategory,
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.RouletteItem.label")
        };
    }

    preview(): string {
        return this.params?.nameCategory ?? this.translate("errors.Roulette.nameCategoryNotEstablished")
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.nameCategory = form.nameCategory;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("Test.data.empty")
        if (!this.params.nameCategory || this.params.nameCategory.length == 0) keys.push("Roulette.nameCategoryNotEstablished");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.nameCategory.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}