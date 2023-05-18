import "./styles.scss";
import icon from "./icon.png";
import { FormEditData, InputWidgetRelatedUnitsAssociationData, InputWidgetRelatedUnitsContainerData, InputWidgetRelatedUnitsItemData, WidgetRelatedUnitsContainerParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";
import WidgetRelatedUnitsItem from "../WidgetRelatedUnitsItem/WidgetRelatedUnitsItem";
import WidgetRelatedUnitsAssociation from "../WidgetRelatedUnitsAssociation/WidgetRelatedUnitsAssociation";

export default class WidgetRelatedUnitsContainer extends WidgetContainerSpecificElement {

    static widget = "RelatedUnitsContainer";
    static category = "containers";
    static icon = icon;

    params: WidgetRelatedUnitsContainerParams;
    data: (WidgetRelatedUnitsItem | WidgetRelatedUnitsAssociation)[];

    static async create(values?: InputWidgetRelatedUnitsContainerData): Promise<WidgetRelatedUnitsContainer> {
        const relatedUnits = new WidgetRelatedUnitsContainer(values);
        relatedUnits.data = values?.data ? await Promise.all(values.data.map(elem => {
            if (elem.widget === "RelatedUnitsAssociation")
                return WidgetRelatedUnitsAssociation.create(elem as InputWidgetRelatedUnitsAssociationData);
            return WidgetRelatedUnitsItem.create(elem as InputWidgetRelatedUnitsItemData);
        })) : [];
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
            help: this.params.help
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.RelatedUnitsContainer.label")
        };
    }

    preview(): string {
        return this.params?.help ? this.params.help : this.translate("widgets.RelatedUnitsContainer.label");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("RelatedUnitsContainer.data.empty");
        const entries = this.data.flatMap(elem => elem instanceof WidgetRelatedUnitsAssociation ? elem.data : [elem]);
        const currentUnits = entries.filter(elem => elem.data.current).length;
        if (currentUnits > 1) keys.push("RelatedUnitsContainer.data.multipleCurrent");
        const links = entries.filter(elem => elem.data.url).map(elem => elem.data.url);
        if (new Set(links).size !== links.length)
            keys.push("RelatedUnitsContainer.data.duplicated");
        return keys;
    }

    validateForm(form: any): string[] {
        return [];
    }
}