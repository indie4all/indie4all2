import type Coloris from "@melloware/coloris";
import { ColorisOptions } from "@melloware/coloris";
import { inject, injectable } from "inversify";
import ColorPickerElement from "./color-picker.element";


@injectable()
export default class ColorPickerService {

    private Coloris: typeof Coloris;
    @inject("Factory<ColorPickerElement>")
    private _elementFactory: (selector: string) => ColorPickerElement;

    constructor() { }

    public async init() {
        await import("@melloware/coloris/dist/coloris.css");
        const { default: Coloris } = await import("@melloware/coloris");
        this.Coloris = Coloris;
        this.Coloris.init();
    }

    public create(opts: ColorisOptions): ColorPickerElement {
        this.Coloris.coloris(opts);
        return this._elementFactory(opts.el);
    }
}