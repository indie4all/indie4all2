import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetRouletteData, WidgetInitOptions } from "../../../types";
import SpecificContainerElement from "../specific-container/specific-container.element";

export default class RouletteElement extends SpecificContainerElement {

    static widget = "Roulette";
    static category = "exerciseElement";
    static icon = icon;

    static MAX_CONTAINED_ITEMS_ALLOWED = 8;

    constructor() { super(); }

    async init(values?: InputWidgetRouletteData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: RouletteElement.widget + "-" + this.id,
            lifes: 1,
            time: 0,
        };
        if (options.regenerateId) this.params.name = RouletteElement.widget + "-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            instanceName: this.params.name,
            lifes: this.params.lifes,
            time: this.params.time
        }));
    }

    get preview(): string {
        return this.params?.name ?? this.translate("widgets.Roulette.label");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.lifes = form.lifes;
        this.params.time = form.time;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("Test.data.empty")
        else if (this.data.length > RouletteElement.MAX_CONTAINED_ITEMS_ALLOWED) keys.push("Roulette.limitExcedeed")
        if (this.utils.checkIfDuplicateValueInObject(this.data, "params", "nameCategory")) keys.push("Roulette.categoryRepeated");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}