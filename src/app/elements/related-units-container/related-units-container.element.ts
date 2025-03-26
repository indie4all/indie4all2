import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetRelatedUnitsContainerData, WidgetInitOptions, WidgetRelatedUnitsContainerParams } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import RelatedUnitsItemElement from "../related-units-item/related-units-item.element";
import RelatedUnitsAssociationElement from "../related-units-association/related-units-association.element";

export default class RelatedUnitsContainerElement extends ContainerSpecificElement {

    protected static _generable: boolean = false;
    static widget = "RelatedUnitsContainer";
    static category = "containers";
    static icon = icon;

    params: WidgetRelatedUnitsContainerParams;
    data: (RelatedUnitsItemElement | RelatedUnitsAssociationElement)[];

    constructor() { super(); }

    async init(values?: InputWidgetRelatedUnitsContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Table Content-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Table Content-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(async elem =>
            this.create(elem.widget === "RelatedUnitsAssociation" ?
                RelatedUnitsAssociationElement.widget : RelatedUnitsItemElement.widget, elem, options) as Promise<RelatedUnitsItemElement | RelatedUnitsAssociationElement>
        )) : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            help: this.params.help ? this.params.help : ''
        }));
    }

    get preview(): string {
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
        const entries = this.data.flatMap(elem => elem instanceof RelatedUnitsAssociationElement ? elem.data : [elem]);
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