import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";

export default class WidgetDragdropContainer extends WidgetContainerElement  {
    config = {
        widget: "DragdropContainer",
        type: "specific-element-container",
        label: "Drag And Drop ",
        allow: ["DragdropItem"],
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADhklEQVRoBe2Zb0gTcRjHv95m4Z90giZSnVKIf6CIIhaVqBFlFqQSs0ipCAZZLxSiNoPKXrRVLzIEy0WERJAS1huDQaBmLzIhIklNXzSvlwr+943o4rnt5s7dztPm3YR94WD3/H5397nnvvc8435R8BNrNO0FUAJt5QLwgetpnQhG4YNmjaYnAKq3p6WANq309Xs/vOClXE/rj6AYrNF0jzWa3M6ub26tNTk94y6qvOlmjaZx1mgyyEGPv3zbrjmwIAI/VHKNwKuleBnWaCoAYDh7Kl9jKy8pIT4Ox/MP0P4ZqXFG+EETw0mJMjxMWJEqVAQ61Nq8KdpgsTkKLDaHqIqENbQhIZ6aXQeAPxab45IQ3yj2oEy/oqxjA3r6IjYgdAY2avXQh+pE/cMuTE3PBcQP7ssN1SV8CoB2941gvvgBMCkG0D8zg7mQFxS4vOo+cjPTl8VH8OLhjZCDB2aaYCcDM+bmxoKehDJMwC2Nd0Xx8qq6peO/DGCxe1AWhpISxSavAXqdRMALtjZ56LxsIJygKYs8lIyidqevcBaPAqETYz3bMouQ1/kYjS1T1qdBXH8/jHLUiQbI0wlbPPP5x64gi2uCprvd9LdJDMyNYeGqA/OHb0P/3IyoIzmiePzEHDKaq1GTLL4hAs7NzAgJqCy0lChL+vZaLDQ6MX++HjqqImwK71FdVRH01lLsAPhNDa3K07qqE2D2sJ6SSPv2Cj6mtlYFTZnms2st473NVwNu1LevlhRBC951T8wh+mOt7y1nTu/3eX32cQUGU2NEx6nmaQHQX4s/R8Dk5SC6vVYUF7w+/qgNv2qa0HB0m2hcvY7IjWKxeyAgLFdDfx/LRoOrT74jUkflRmVh+GsosJl6HfFN94odkbeet5zKSb2OyHfDMvlJrLLPcdIdUUoyj41eOPKvvx3g9bQgyqBOQRbXBM13xKnXqzoJVYiWxjva/Z9eq9ajtAVT5GONWopAq6UItFpivIsywgJN2Mj5uRdxsTGSOAzX00rQnXX1zZiamQ0L5nftXegfcmEnmyY5LjSXmv4hV8fJyluGK+eKVW0U/qKkObt6eeisXSy2JidJzvNfR6TPqbSWWCB86NNCqclJPHCQtcxOu9Vc6Gvj3hXSy1IzLTaHW6ubkJLS6hF85VRd8RxKoWvCAJic8BRKoe1WcyetVQvlUQPR9QvtVrNW1/9PAfgHtKkr/F25PusAAAAASUVORK5CYII=",
        cssClass: "widget-dragdrop-container"
    }

    emptyData() {
        return {
            params: {
                name: this.config.label + "-" + Utils.generate_uuid(),
                help: ""
            },
            data: []
        }
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            instanceName: model.params.name,
            help: model.params.help
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.DragdropContainer.label")
        };
    }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.querySelector("span").innerHTML = model.params.name ? model.params.name : this.translate("widgets.DragdropContainer.label");
        return element;
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateModel(widget) {
        var keys = [];
        if (widget.data.length == 0) keys.push("DragdropContainer.data.empty");
        if (!Utils.hasNameInParams(widget)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}