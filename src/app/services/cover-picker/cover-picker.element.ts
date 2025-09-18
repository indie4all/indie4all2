import { Observable, Subject } from 'rxjs';

export default class CoverPickerElement {

    private _coverFileElem: HTMLInputElement;
    private _coverBlobElem: HTMLInputElement;
    private _previewElem: HTMLImageElement;

    private _cover: string;

    private _changedSubject: Subject<File> = new Subject<File>();

    constructor() { }

    public init(coverFileElem: HTMLInputElement, coverBlobElem: HTMLInputElement, previewElem: HTMLImageElement) {
        this._coverFileElem = coverFileElem;
        this._coverBlobElem = coverBlobElem;
        this._previewElem = previewElem;
        this._coverFileElem.addEventListener('change', () => {
            const file = this._coverFileElem.files?.item(0);
            this._changedSubject.next(file);
        });
    }

    public set cover(value: string) {
        this._cover = value;
        this._coverBlobElem.value = value;
        this._previewElem.src = value
    }

    public get cover() { return this._cover; }

    public disable() {
        this._coverFileElem.disabled = true;
        this._coverFileElem.style.pointerEvents = 'none';
    }

    public enable() {
        this._coverFileElem.disabled = false;
        this._coverFileElem.style.pointerEvents = 'auto';
    }

    public hide() {
        this._previewElem.classList.add('d-none');
    }

    public show() {
        this._previewElem.classList.remove('d-none');
    }

    public toggle(state: boolean) {
        if (state) { this.enable(); } else { this.disable(); }
    }

    public togglePreview(state: boolean) {
        if (state) { this.show(); } else { this.hide(); }
    }

    public get changed(): Observable<File> {
        return this._changedSubject.asObservable();
    }
}

