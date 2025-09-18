import './styles.scss';
import icon from "./icon.png";
import { InputWidgetAcordionContainerData, WidgetAcordionContainerParams, WidgetInitOptions } from "../../../types";
import SpecificContainerElement from "../specific-container/specific-container.element";
import WidgetElement from "../widget/widget.element";

export default class AccordionContainerElement extends SpecificContainerElement {

    protected static _generable: boolean = true;
    static widget = "AcordionContainer";
    static category = "containers";
    static icon = icon;

    params: WidgetAcordionContainerParams;
    data: WidgetElement[];

    constructor() {
        super();
    }

    async init(values?: InputWidgetAcordionContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Acordion-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Acordion-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) : [];
    }

    get form() {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }));
    }

    get preview() { return this.params?.name ?? this.title; }


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
        if (this.data.length == 0)
            keys.push("AcordionContainer.data.empty");
        if (!this.utils.hasNameInParams(this))
            keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        return keys;
    }
}
