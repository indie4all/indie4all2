import I18n from "../I18n";
import Utils from "../Utils";

export default class ModelElement {

    constructor(values) {
        this.id = values?.id ?? Utils.generate_uuid();
        this.widget = this.constructor.widget;
        this.type = this.constructor.type;
    }

    createElement() {}
    
    getInputs() {}

    hasChildren() { return false; }

    preview() {}

    settingsClosed() {}

    settingsOpened() {}

    translate(query) {
        return I18n.getInstance().translate(query);
    }
    
    updateModelFromForm(form) {}

    validateModel() {}

    validateForm(form) {}

    clone() {}

    regenerateIDs() {
        this.id = Utils.generate_uuid();
    }

    toJSON(key) { return { id: this.id, widget: this.widget } }
}