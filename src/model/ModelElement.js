import I18n from "../I18n";

export default class ModelElement {

    createElement(data) {}
    
    emptyData(index) {}

    getInputs(data) {}

    hasChildren() { return false; }

    preview(model) {}

    settingsClosed(model) {}

    settingsOpened(model) {}

    translate(query) {
        return I18n.getInstance().translate(query);
    }
    
    updateModelFromForm(model, form) {}

    validateModel(model) {}

    validateForm(form) {}
}