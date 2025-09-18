import { injectable } from "inversify";
import ButtonAction from "./btn.action";

@injectable()
export default class ButtonClickAction extends ButtonAction {

    public async init(id: string, title: string, type: string, icon: string, container: HTMLElement): Promise<void> {
        await super.init(id, title, type, icon, container);
        const btnElem = document.getElementById(id);
        btnElem.addEventListener('click', (e) => this._callback && this._callback(e));
    }
}