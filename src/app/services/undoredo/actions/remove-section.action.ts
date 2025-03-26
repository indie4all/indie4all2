import { injectable } from "inversify";
import Action from "./action";
import AddSectionAction from "./add-section.action";

@injectable()
export default class RemoveSectionAction extends Action {

    async do() {
        this._model.removeElement(this._data.element.id);
        const node = <HTMLElement>document.getElementById("sec-" + this._data.element.id);
        $(<HTMLElement>node.parentNode).remove();
    }

    async undo() { (this._actionFactory(AddSectionAction, this._model, this._data)).do(); }
}