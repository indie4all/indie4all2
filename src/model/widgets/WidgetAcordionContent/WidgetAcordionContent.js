import form from './form.hbs'
import './styles.scss';
import WidgetContainerElement from '../WidgetContainerElement/WidgetContainerElement';

export default class WidgetAcordionContent extends WidgetContainerElement {
    
    config = { 
        widget: "AcordionContent",
        type: "element-container",
        label: "Acordion content",
        allow: ["element", "layout", "specific-element-container"],
        category: "containers",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACOklEQVRoBWNkQAJy5mEGDAwMAQwDCx4wMDBseHRy1QdcroA7Ws48rJ+BgaFARlKUAYQHCpw4d40B6vDARydXXcDpDDnzsAY587D/Ow+e+j/Q4OPnL/89Ysv+y5mHvZczDxPA5+j3c1dsHXAHwwDI4VYB2SCHF2BzL5OceZgDAwODQIi3/QAnZQTg4+FmcLM3BfH9sckzwRgghYMJ8ONxD9OgcimRYNTR1AbsbKwCFe2zHCraZ6GUIoPa0QJ8PKDKbj8DA8P9ivZZCTDxoZI8QCE9HxTqDEMwTcczDEFHK4AIFkKq/l9+yPBvyznaOIGfi4E5y51kbQQd/durjYGRn4uBUZ76jah/h6+DaVIdTtDRDB+/MbAsL2BgtNEk23G4wB/vNrD5pILhW7n8/0B6aNDSXMLJAxSNURPIMpwo4GNMspbRtge9wKij6QVGHU0vMOpoeoHh6WhGXXmaOoBRV45kPQSrcdajLeS6h2ZgNE3TC4w6ml5g1NH0AqOOphdggk7KwCZoBg3Yeeg0AzcXJ/aQfnRyFcjRBxonLGT49OXroHDzmq0HGa7desCgJCeJVR5WjRdeu/Vgv2dsuUByhBeDlqoCXR0JA6BA23nwNNjR6spyDGIigljVIc8jgoZTQXOJDrCBvoEA4iKCYAfjmMs80FGZ5ghvMEFnSBOxqaxon/V/oDyBDRBbeuCeOaUvALuDWEcXDgIHg1LCRAZiHd1RmXYANFcNKx4HAIDsd+yoTBso+ykEDAwMANU8kbtxWoUnAAAAAElFTkSuQmCC",
        cssClass: "widget-acordion-content"
    }

    emptyData() {
        return { params: { title: ""}, data: [] };
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            title: typeof model.params === 'object' ? model.params.title : ''
        }
        return {
            inputs: form(data),
            title: this.translate("widgets.AcordionContent.label")
        };
    }

    preview(model) {
        return this.translate("widgets.AcordionContent.label") + (model.params?.title ?? "");
    }

    updateModelFromForm(model, form) {
        model.params.title = form.title;
    }

    validateModel(widget) {
        var errors = [];
        if (widget.params.title.length == 0) errors.push("AcordionContent.title.invalid");
        if (widget.data.length == 0) errors.push("AcordionContent.data.empty");
        return errors;
    }

    validateForm(form) {
        if (form.title.length == 0)
            return ["AcordionContent.title.invalid"]
        return [];
    }
}