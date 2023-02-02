import './styles.scss';
import WidgetContainerElement from '../WidgetContainerElement/WidgetContainerElement';
import ModelManager from '../../ModelManager';

export default class WidgetAcordionContent extends WidgetContainerElement {
    
    static widget = "AcordionContent";
    static type = "element-container";
    static label = "Acordion content";
    static allow = ["element", "layout", "specific-element-container"];
    static category = "containers";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACOklEQVRoBWNkQAJy5mEGDAwMAQwDCx4wMDBseHRy1QdcroA7Ws48rJ+BgaFARlKUAYQHCpw4d40B6vDARydXXcDpDDnzsAY587D/Ow+e+j/Q4OPnL/89Ysv+y5mHvZczDxPA5+j3c1dsHXAHwwDI4VYB2SCHF2BzL5OceZgDAwODQIi3/QAnZQTg4+FmcLM3BfH9sckzwRgghYMJ8ONxD9OgcimRYNTR1AbsbKwCFe2zHCraZ6GUIoPa0QJ8PKDKbj8DA8P9ivZZCTDxoZI8QCE9HxTqDEMwTcczDEFHK4AIFkKq/l9+yPBvyznaOIGfi4E5y51kbQQd/durjYGRn4uBUZ76jah/h6+DaVIdTtDRDB+/MbAsL2BgtNEk23G4wB/vNrD5pILhW7n8/0B6aNDSXMLJAxSNURPIMpwo4GNMspbRtge9wKij6QVGHU0vMOpoeoHh6WhGXXmaOoBRV45kPQSrcdajLeS6h2ZgNE3TC4w6ml5g1NH0AqOOphdggk7KwCZoBg3Yeeg0AzcXJ/aQfnRyFcjRBxonLGT49OXroHDzmq0HGa7desCgJCeJVR5WjRdeu/Vgv2dsuUByhBeDlqoCXR0JA6BA23nwNNjR6spyDGIigljVIc8jgoZTQXOJDrCBvoEA4iKCYAfjmMs80FGZ5ghvMEFnSBOxqaxon/V/oDyBDRBbeuCeOaUvALuDWEcXDgIHg1LCRAZiHd1RmXYANFcNKx4HAIDsd+yoTBso+ykEDAwMANU8kbtxWoUnAAAAAElFTkSuQmCC";
    static cssClass = "widget-acordion-content";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        this.params = values?.params ?? { title: ""};
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetAcordionContent(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = { instanceId: this.id, title: this.params.title ?? '' };
            return {
                inputs: form(data),
                title: this.translate("widgets.AcordionContent.label")
            };
        });
    }

    preview() {
        return this.translate("widgets.AcordionContent.label") + " " + (this.params?.title ?? "");
    }

    updateModelFromForm(form) {
        this.params.title = form.title;
    }

    validateModel() {
        var errors = [];
        if (this.params.title.length == 0) errors.push("AcordionContent.title.invalid");
        if (this.data.length == 0) errors.push("AcordionContent.data.empty");
        return errors;
    }

    validateForm(form) {
        if (form.title.length == 0)
            return ["AcordionContent.title.invalid"]
        return [];
    }
}