import "./styles.scss";
import icon from "./icon.png";
import { FormEditData, InputWidgetRelatedUnitsAssociationData, WidgetRelatedUnitsAssociationParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";
import WidgetRelatedUnitsItem from "../WidgetRelatedUnitsItem/WidgetRelatedUnitsItem";

export default class WidgetRelatedUnitsAssociation extends WidgetContainerSpecificElement {

    static widget = "RelatedUnitsAssociation";
    static icon = icon;

    params: WidgetRelatedUnitsAssociationParams;
    data: WidgetRelatedUnitsItem[];

    static async create(values?: InputWidgetRelatedUnitsAssociationData): Promise<WidgetRelatedUnitsAssociation> {
        const relatedAssociation = new WidgetRelatedUnitsAssociation(values);
        relatedAssociation.data = values?.data ? await Promise.all(values.data.map(elem => WidgetRelatedUnitsItem.create(elem))) : [];
        return relatedAssociation;
    }

    constructor(values?: InputWidgetRelatedUnitsAssociationData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Related Units Association-" + this.id,
            help: ""
        };
    }

    clone(): WidgetRelatedUnitsAssociation {
        const widget = new WidgetRelatedUnitsAssociation();
        widget.params = structuredClone(this.params);
        widget.params.name = "Related Units Association-" + widget.id;
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            help: this.params.help ? this.params.help : ''
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.RelatedUnitsAssociation.label")
        };
    }

    getTexts() {
        return {};
    }

    preview(): string {
        return this.params?.help ? `<p>${this.params?.help}</p>` : this.translate("widgets.RelatedUnitsAssociation.prev");
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

    updateTexts(texts: any): void { }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.params.help.length == 0) errors.push("RelatedUnitsAssociation.title.invalid");
        if (this.data.length == 0) errors.push("RelatedUnitsAssociation.data.empty");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.help.length == 0) errors.push("RelatedUnitsAssociation.title.invalid");
        return errors;
    }
}
