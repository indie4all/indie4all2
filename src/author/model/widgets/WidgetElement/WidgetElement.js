import I18n from "../../../I18n";
import btnAddElementTemplate from "./btnAddElement";
import btnEditElementTemplate from "./btnEditElement";
import btnDeleteElementTemplate from "./btnDeleteElement";
import btnExportElementTemplate from "./btnExportElement";
import btnCopyElementTemplate from "./btnCopyElement";
import ModelElement from "../../ModelElement";

export default class WidgetElement extends ModelElement {

    config = {};

    paleteHidden = false

    generateToolbar(id) {
        const type = this.config.type;
        const widget = this.config.widget;
        var buttons = "";
        var data = { id, widget, type };

        // Add Content button
        if (type == 'specific-container' || type == 'specific-element-container')
            buttons += btnAddElementTemplate(data);
        // Settings or data button
        if (this.config.toolbar.edit)
            buttons += btnEditElementTemplate(data);
        // Do not allow specific items to be copied/duplicated
        if (type !== 'specific-element') {
            // Add copy element button
            buttons += btnCopyElementTemplate(data);
            // Add export element button
            buttons += btnExportElementTemplate(data);
        }
        // Delete/remove element button (common for all)
        buttons += btnDeleteElementTemplate(data);
        return buttons;
    }

    translate(query) {
        return I18n.getInstance().translate(query);
    }

    validateModel(model) {}

    validateForm(form) {}
}