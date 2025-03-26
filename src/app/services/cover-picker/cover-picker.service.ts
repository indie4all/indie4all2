import { inject, injectable } from "inversify";
import CoverPickerElement from "./cover-picker.element";

@injectable()
export default class CoverPickerService {

    @inject("Factory<CoverPickerElement>")
    private _coverPickerElementFactory:
        (arg0: HTMLInputElement, arg1: HTMLInputElement, arg2: HTMLImageElement) => CoverPickerElement;


    constructor() { }

    public async init() { }

    public create(coverFileElem: HTMLInputElement, coverBlobElem: HTMLInputElement, previewElem: HTMLImageElement): CoverPickerElement {
        return this._coverPickerElementFactory(coverFileElem, coverBlobElem, previewElem);
    }
}