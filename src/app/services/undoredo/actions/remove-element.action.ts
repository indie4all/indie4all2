import { injectable } from "inversify";
import Action from "./action";
import AddElementAction from "./add-element.action";

@injectable()
export default class RemoveElementAction extends Action {

    async do() {
        this._model.removeElement(this._data.element.id);
        $(<HTMLElement>document.querySelector("[data-id='" + this._data.element.id + "']")).parent().remove();
    }

    async undo() { (this._actionFactory(AddElementAction, this._model, this._data)).do(); }
}