import I18n from "../../../I18n";
import btnAddElementTemplate from "./btnAddElement.hbs";
import btnEditElementTemplate from "./btnEditElement.hbs";
import btnDeleteElementTemplate from "./btnDeleteElement.hbs";
import btnExportElementTemplate from "./btnExportElement.hbs";
import btnCopyElementTemplate from "./btnCopyElement.hbs";
import ModelElement from "../../ModelElement";
import palette from "./palette.hbs";
import './styles.scss';

export default class WidgetElement extends ModelElement {

    config = {};

    paleteHidden = false

    createPaletteItem() {
        const label = I18n.getInstance().translate(`widgets.${this.config.widget ?? "GenericWidget" }.label`);
        return palette({...this.config, label});
    }

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