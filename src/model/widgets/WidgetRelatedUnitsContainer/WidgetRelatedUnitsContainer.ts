import Utils from "../../../Utils";
import "./styles.scss";
import icon from "./icon.png";
import { FormEditData, InputWidgetRelatedUnitsContainerData, WidgetRelatedUnitsContainerParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";
import WidgetRelatedUnitsItem from "../WidgetRelatedUnitsItem/WidgetRelatedUnitsItem";

export default class WidgetRelatedUnitsContainer extends WidgetContainerSpecificElement {

    static widget = "RelatedUnitsContainer";
    static category = "containers";
    static icon = icon;

    params: WidgetRelatedUnitsContainerParams;
    data: WidgetRelatedUnitsItem[];

    static async create(values?: InputWidgetRelatedUnitsContainerData): Promise<WidgetRelatedUnitsContainer> {
        const relatedUnits = new WidgetRelatedUnitsContainer(values);
        relatedUnits.data = values?.data ? await Promise.all(values.data.map(elem => WidgetRelatedUnitsItem.create(elem))) : [];
        return relatedUnits;
    }

    constructor(values?: InputWidgetRelatedUnitsContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Related Units-" + this.id,
            help: ""
        };
    }

    clone(): WidgetRelatedUnitsContainer {
        const widget = new WidgetRelatedUnitsContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Related Units-" + widget.id;
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.RelatedUnitsContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.RelatedUnitsContainer.label");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("RelatedUnitsContainer.data.empty");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}