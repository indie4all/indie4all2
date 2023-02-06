import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";

export default class WidgetTabContent extends WidgetContainerElement {
    
    static widget = "TabContent";
    static type = "element-container";
    static allow = ["element", "layout", "specific-element-container"];
    static category = "containers";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACrUlEQVRoBe2ZT2jTUBzHv0mnYjfaDjplIK9DEf/ARBAJiHXdRXQKbiJBrEWG0IuX9qLtTS82N+elQkFUcEOKBw8OzGmt9WAdiiB0sFPtVWGrzh3UNvKypU5J0rTpkg7ygUDLey/vk5eXX/Lej8EGCMcfBTAOeykDeFEpZpe1LBrShOPvAYjtGRwAPezi7YcS1sUnKsXsR00NwvG3CcdLYv6dZDfV7yvSmchNiXD8EuF4n5700sNns7YLK1DxE+M3qHhMzZclHB8C4Lt0bsTmqfwXT18vTo8cp/8vqJWzyg9asZvw6viwXWVqEEe60+zYvs2XSGVCiVTmnyjSY7afWuIppE8VzXKXEAYzHGjr3D5PH33ZzQFYTqQycSEZfQyzI11Li6hNF8CcPKR6wOvGr7G7Zrpo+AN4REcdpke6ugr2SACu5IRqsfRmAfWX70118R/XAOS22oM4BCd6WIjunK5PFyBVvmqW19KvwJ4/pn0Csva1+PvKlG4EYcNBMMRv+Kr1pWcKkD5/ARNQ/1R1hYNwJS9qtqciPTMx1B+I8kOp2kdhAWzwINApacijcEozOhiB3gm9u/HTE2n9nG3b2IgjbRWOtFU40lbhSFuFI20VjrRVNJeu/tg8lepqW810P02ZYbK24k6L7Wo1x+tuLBY6Iu0SruqvTDoBGWhp1dJUmiLvX3QZTvSwii0rTZMySoKmaxBfz6PXvVNdulLMUuncnakn+LayiTG5BZ7P5lFaLGMvGVRtpESPeGmxPHc2cst3/fIYDu8fskWWDpqYn5elD+wj2OXvV623MY9It1NpLjGkbPTZwW5/vyyskcvMCcnoaCNOr2dIJ9VqJlIZya6LUMNo9NDOnFqL7GFUOt4FwnQm3IdRaSEZzdFctRIebYD2Pyoko3b1bxIAfwCqj7mPjyjv0wAAAABJRU5ErkJggg==";
    static cssClass = "widget-tab-content";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        this.params = values?.params ?? { name: "" };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
        this.skipNameValidation = true;
    }

    clone() {
        return new WidgetTabContent(this);
    }


    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                name: this.params ? this.params.name : ''
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.TabContent.label")
            };
        });
    }

    preview() {
        return this.translate("widgets.TabContent.label") + " " + (this.params?.name ?? "");
    }

    updateModelFromForm(form) {
        this.params.name = form.name;
    }

    validateModel() {
        var errors = [];
        if (!Utils.hasNameInParams(this)) errors.push("TabContent.name.invalid");
        if (this.data.length == 0) errors.push("TabContent.data.empty");
        return errors;
    }

    validateForm(form) {
        if (form.name.length == 0)
            return ["TabContent.name.invalid"]
        return [];
    }
}