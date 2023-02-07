import I18n from "../../I18n";
import ModelElement from "../ModelElement";
import ModelManager from "../ModelManager";
import prevTemplate from "./prev.hbs";
import sectionTemplate from "./template.hbs";
import icon from "./icon.png";

export default class Section extends ModelElement {

    static widget = "Section";
    static icon = icon;
    static type = "section-container";

    constructor(values) {
        super(values);
        this.name = values?.name ?? I18n.getInstance().translate("sections.label") + " " + values?.index ?? 0;
        this.bookmark = values?.bookmark ?? "";
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new Section(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            return {
                title: "Section " + this.name,
                inputs: form({
                    id: this.id,
                    name: this.name,
                    bookmark: this.bookmark
                })
            };
        });
    }

    hasChildren() { return true; }

    preview() {
        return prevTemplate(this);
    }

    createElement() {
        return sectionTemplate({
            type: "section-container",
            id: this.id,
            name: this.name,
            icon: Section.icon,
            children: this.data ? this.data.map(child => child.createElement()).join('') : ""
        });
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.data && this.data.forEach(child => child.regenerateIDs());
    }

    updateModelFromForm(form) {
        this.name = form.name;
        this.bookmark = form.bookmark;
    }

    validateModel() {
        var keys = [];
        if (this.data.length == 0)
            keys.push("section.emptyData");
        if (!this.name || (this.name.length <= 0))
            keys.push("section.invalidName");
        if (this.bookmark.length == 0 || this.bookmark.length > 40)
            keys.push("section.invalidBookmark");
        return keys;
    }

    validateForm(form) {
        let errors = [];
        if (form.bookmark.length > 40) {
            errors.push("section.invalidBookmark")
        }
        return errors;
    }

    toJSON(key) {
        const result = super.toJSON(key);
        return {...result, name: this.name, bookmark: this.bookmark, data: this.data }
    }
}