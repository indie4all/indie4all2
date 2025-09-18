import "./styles.scss";
import template from "./template.hbs";
import icon from "./icon.png";
import { InputWidgetRouletteItemData, WidgetInitOptions } from "../../../types";
import Config from "../../../config";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import SpecificItemElement from "../specific-item/specific-item.element";

export default class RouletteItemElement extends ContainerSpecificElement {

    protected static _generable: boolean = false;

    static widget = "RouletteItem";
    static icon = icon;

    constructor() { super(); }

    async init(values?: InputWidgetRouletteItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {};
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) : [];
    }

    createElement(): string {
        const constructor = RouletteItemElement;
        const children = this.data ? this.data.map((child: SpecificItemElement) => child.createElement()).join('') : "";
        return template({
            id: this.id,
            widget: constructor.widget,
            icon: constructor.icon,
            label: this.preview,
            canAdd: constructor.addable,
            canEdit: constructor.editable,
            canDelete: constructor.deletable,
            canCopy: constructor.copyable,
            canLoadFromBank: !!Config.getBankOfWidgetsURL(),
            children,
            cssClass: this.utils.toKebabCase(constructor.name)
        });
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            nameCategory: this.params.nameCategory
        }));
    }

    get preview(): string {
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