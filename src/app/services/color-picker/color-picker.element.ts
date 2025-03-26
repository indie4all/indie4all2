export default class ColorPickerElement {

    private _color: string;
    private _selectorElem: HTMLInputElement;

    constructor() { }

    init(selector: string) { this._selectorElem = document.querySelector(selector); }

    set color(value) {
        this._selectorElem.value = value;
        (this._selectorElem.closest(".clr-field") as HTMLElement).style.color = value;
    }

    get color() { return this._color; }

    disable() {
        this._selectorElem.disabled = true;
        this._selectorElem.style.pointerEvents = 'none';
        this._selectorElem.closest(".clr-field").querySelector('button').disabled = true;
    }

    enable() {
        this._selectorElem.disabled = false;
        this._selectorElem.style.pointerEvents = 'auto';
        this._selectorElem.closest(".clr-field").querySelector('button').disabled = false;
    }

    toggle(state: boolean) {
        if (state) { this.enable(); } else { this.disable(); }
    }
}