import { injectable } from "inversify";
import ButtonAction from "./btn.action";

@injectable()
export default class ButtonFileAction extends ButtonAction {

    public async init(id: string, title: string, type: string, icon: string, container: HTMLElement): Promise<void> {
        await super.init(id, title, type, icon, container);
        const btnElem = document.getElementById(id) as HTMLButtonElement;
        const fileId = `${id}-file`;
        const file = `<input type="file" accept="application/json" id="${fileId}" hidden />`;
        btnElem.insertAdjacentHTML('afterend', file);
        const fileElem = document.getElementById(`${id}-file`) as HTMLInputElement;
        // A click on the button will trigger the file input
        btnElem.addEventListener('click', (e) => fileElem.click());
        // When the file input changes, read the file and call the callback with its contents
        fileElem.addEventListener('change', async (event) => {
            const fileInput = event.target as HTMLInputElement;
            if (fileInput.files.length === 0) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                fileElem.value = ''; // Reset the value so that the same file can be selected again
                this._callback && this._callback(event); // Invoke the given callback with the model
            };
            reader.readAsText(fileInput.files[0]);
        });
    }
}