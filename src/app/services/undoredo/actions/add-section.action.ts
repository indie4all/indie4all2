import { injectable } from "inversify";
import SectionElement from "../../../elements/section/section.element";
import Action from "./action";
import RemoveSectionAction from "./remove-section.action";

@injectable()
export default class AddSectionAction extends Action {

    async do() {
        const element: SectionElement = this._data.element;
        const view: string = element.createElement();
        const position: number = this._data.position;
        if (position == this._model.numberOfSections) {
            $(this._data.container).append(view);
            this._model.addSection(element);
        } else {
            $(view).insertBefore(this._data.container.children[position]);
            this._model.insertSection(element, position);
        }
    }

    async undo() { (this._actionFactory(RemoveSectionAction, this._model, this._data)).do(); }
}
