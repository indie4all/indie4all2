import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import { FormEditData, InputWidgetRouletteData } from "../../../types";
import WidgetSpecificContainerElement from "../WidgetSpecificContainerElement/WidgetSpecificContainerElement";

export default class WidgetRoulette extends WidgetSpecificContainerElement {

    static widget = "Roulette";
    static category = "exerciseElement";
    static icon = icon;

    static MAX_CONTAINED_ITEMS_ALLOWED = 8;


    static async create(values?: InputWidgetRouletteData): Promise<WidgetRoulette> {
        const container = new WidgetRoulette(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => ModelManager.create(elem.widget, elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetRouletteData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetRoulette.widget + "-" + this.id,
            lifes: 1,
            time: 0,
        };
    }

    clone(): WidgetRoulette {
        const widget = new WidgetRoulette();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetRoulette.widget + "-" + widget.id;
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            instanceName: this.params.name,
            lifes: this.params.lifes,
            time: this.params.time
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.Roulette.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.Test.label");
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
        else if (this.data.length > WidgetRoulette.MAX_CONTAINED_ITEMS_ALLOWED) keys.push("Roulette.limitExcedeed")
        if (Utils.checkIfDuplicateValueInObject(this.data, "params", "nameCategory")) keys.push("Roulette.categoryRepeated");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}