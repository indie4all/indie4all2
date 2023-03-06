import I18n from "../../I18n";
import ModelElement from "../ModelElement";
import ModelManager from "../ModelManager";
import prevTemplate from "./prev.hbs";
import sectionTemplate from "./template.hbs";
import icon from "./icon.png";
import WidgetElement from "../widgets/WidgetElement/WidgetElement";
import { FormEditData } from "../../types";
import WidgetSpecificItemElement from "../widgets/WidgetSpecificItemElement/WidgetSpecificItemElement";
import WidgetAcordionContent from "../widgets/WidgetAcordionContent/WidgetAcordionContent";
import WidgetTabContent from "../widgets/WidgetTabContent/WidgetTabContent";

export default class Section extends ModelElement {

    static widget = "Section";
    static icon = icon;
    static allows() { return [WidgetElement] }
    static refuses() { return [WidgetSpecificItemElement, WidgetAcordionContent, WidgetTabContent] }

    name: string;
    bookmark: string;
    data: WidgetElement[]

    constructor(values?: any) {
        super(values);
        this.name = values?.name ?? I18n.getInstance().translate("sections.label") + " " + values?.index ?? 0;
        this.bookmark = values?.bookmark ?? "";
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): Section {
        const section = new Section();
        section.name = this.name;
        section.bookmark = this.bookmark;
        section.data = this.data.map(elem => elem.clone());
        return section;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        return {
            title: "Section " + this.name,
            inputs: form({
                id: this.id,
                name: this.name,
                bookmark: this.bookmark
            })
        };
    }

    static hasChildren(): boolean { return true; }

    preview(): string {
        return prevTemplate(this);
    }

    createElement(): string {
        return sectionTemplate({
            type: "section-container",
            id: this.id,
            name: this.name,
            icon: Section.icon,
            children: this.data ? this.data.map(child => child.createElement()).join('') : ""
        });
    }

    updateModelFromForm(form: any): void {
        this.name = form.name;
        this.bookmark = form.bookmark;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0)
            keys.push("section.emptyData");
        if (!this.name || (this.name.length <= 0))
            keys.push("section.invalidName");
        if (this.bookmark.length == 0 || this.bookmark.length > 40)
            keys.push("section.invalidBookmark");
        return keys;
    }

    validateForm(form: any): string[] {
        let errors: string[] = [];
        if (form.bookmark.length > 40) {
            errors.push("section.invalidBookmark")
        }
        return errors;
    }

    toJSON() {
        const result = super.toJSON();
        return { ...result, name: this.name, bookmark: this.bookmark, data: this.data }
    }
}