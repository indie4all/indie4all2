import I18n from "../../I18n";
import Utils from "../../Utils";
import ModelElement from "../ModelElement";
import ModelManager from "../ModelManager";
import formTemplate from "./form.hbs";
import prevTemplate from "./prev.hbs";
import sectionTemplate from "./template.hbs"

export default class Section extends ModelElement {

    #icon = "data:image/png;base64,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";

    emptyData(index) {
        return {
            id: Utils.generate_uuid(),
            name: I18n.getInstance().translate("sections.label") + " " + index,
            type: "section-container",
            widget: "Section",
            bookmark: "",
            data: []
        };
    }

    getInputs(model) {
        return {
            title: "Section " + model.name,
            inputs: formTemplate({
                id: model.id,
                name: model.name,
                bookmark: model.bookmark
            })
        };
    }

    hasChildren() { return true; }

    preview(model) {
        return prevTemplate(model);
    }

    createElement(section) {
        return sectionTemplate({
            type: "section-container",
            id: section.id,
            name: section.name,
            icon: this.#icon,
            children: section.data ? section.data.map(child => ModelManager.getWidget(child.widget).createElement(child)).join('') : ""
        });
    }

    updateModelFromForm(model, form) {
        model.name = form.name;
        model.bookmark = form.bookmark;
    }

    validateModel(model) {
        var keys = [];
        if (model.data.length == 0)
            keys.push("section.emptyData");
        if (!model.name || (model.name.length <= 0))
            keys.push("section.invalidName");
        if (model.bookmark.length == 0 || model.bookmark.length > 40)
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
}