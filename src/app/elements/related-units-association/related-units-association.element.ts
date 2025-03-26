import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetRelatedUnitsAssociationData, WidgetInitOptions, WidgetRelatedUnitsAssociationParams } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import RelatedUnitsItemElement from "../related-units-item/related-units-item.element";

export default class RelatedUnitsAssociationElement extends ContainerSpecificElement {

    static widget = "RelatedUnitsAssociation";
    static icon = icon;

    params: WidgetRelatedUnitsAssociationParams;
    data: RelatedUnitsItemElement[];

    constructor() { super(); }

    async init(values?: InputWidgetRelatedUnitsAssociationData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Table Group-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Table Group-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(async elem =>
            this.create(RelatedUnitsItemElement.widget, elem, options) as Promise<RelatedUnitsItemElement>
        )) : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            help: this.params.help ? this.params.help : ''
        }));
    }

    get texts() { return {}; }

    get preview(): string {
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

    set texts(texts: any) { }

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
