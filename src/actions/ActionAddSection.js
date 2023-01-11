/* global $ */
import ModelManager from "../model/ModelManager";
import ActionElement from "./ActionElement";
import ActionRemoveSection from "./ActionRemoveSection";

export default class ActionAddSection extends ActionElement {

    do() {
        const element = this.data.element;
        const view = ModelManager.getSection().createElement(element);
        const position = this.data.position;
        if (position == this.model.sections.length) {
            $(this.container).append(view);
            this.model.sections.push(element);
        } else {
            $(view).insertBefore(this.container.children[position]);
            this.model.sections.splice(position, 0, element);
        }
    }

    undo() {
        (new ActionRemoveSection(this.modelId, this.container, this.model, this.data)).do();
    }
}
