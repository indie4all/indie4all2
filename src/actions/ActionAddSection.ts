/* global $ */
import Section from "../model/section/Section";
import ActionElement from "./ActionElement";
import ActionRemoveSection from "./ActionRemoveSection";

export default class ActionAddSection extends ActionElement {

    do() {
        const element: Section = this.data.element;
        const view: string = element.createElement();
        const position: number = this.data.position;
        if (position == this.model.sections.length) {
            $(this.data.container).append(view);
            this.model.sections.push(element);
        } else {
            $(view).insertBefore(this.data.container.children[position]);
            this.model.sections.splice(position, 0, element);
        }
    }

    undo() {
        (new ActionRemoveSection(this.model, this.data)).do();
    }
}
