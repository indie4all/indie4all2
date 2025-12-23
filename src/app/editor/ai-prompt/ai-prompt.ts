import { inject, injectable } from "inversify";
import BootstrapService from "../../services/bootstrap/bootstrap.service";
import I18nService from "../../services/i18n/i18n.service";
import { AIAction, AIElementInfo } from "./types";
import { MultipleSelectInstance } from 'multiple-select-vanilla';
import SectionElement from "../../elements/section/section.element";
import "./styles.scss";

@injectable()
export default class AiPrompt {

    private _showCallback: () => void = () => { };
    private _hideCallback: () => void = () => { };

    private _type: string = "Model";
    private _action: AIAction = AIAction.Create;
    private _elements: Set<string> = new Set();
    private _submitListener: (e: Event) => void = null;

    private _htmlElem: HTMLElement;
    private _formElem: HTMLFormElement;
    private _select: MultipleSelectInstance;
    private _effort: MultipleSelectInstance;

    constructor(
        @inject(BootstrapService) private bootstrap: BootstrapService,
        @inject(I18nService) private i18n: I18nService) { }

    public async init(): Promise<void> {
        this._htmlElem = document.querySelector('#ai-prompt-offcanvas');
        if (this._htmlElem) return;
        const { default: template } = await import('./template.hbs');
        document.body.insertAdjacentHTML('beforeend', template());
        this._htmlElem = document.querySelector('#ai-prompt-offcanvas');
        this._htmlElem.addEventListener('hide.bs.offcanvas', (e: Event) => this._hideCallback && this._hideCallback());
        this._htmlElem.addEventListener('show.bs.offcanvas', (e: Event) => this._showCallback && this._showCallback());
        this._formElem = this._htmlElem.querySelector('#ai-prompt-form');
        const input = this._htmlElem.querySelector('#ai-prompt') as HTMLInputElement;
        input.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') this._formElem.dispatchEvent(new Event('submit'));
        });

        const {multipleSelect} = await import("multiple-select-vanilla");
        const selectElem = this._htmlElem.querySelector('#ai-prompt-chatbots-list');
        this._select = multipleSelect(selectElem, { data: [] }) as MultipleSelectInstance;
        this._effort = multipleSelect(this._htmlElem.querySelector('#ai-prompt-reasoning-effort')) as MultipleSelectInstance;
    }

    public async hide() {
        const offcanvasModule = await this.bootstrap.loadOffCanvasModule();
        this._htmlElem = document.querySelector('#ai-prompt-offcanvas');
        const bsOffcanvas = offcanvasModule.getInstance(this._htmlElem);
        bsOffcanvas.hide();
        if (this._submitListener) {
            this._formElem.removeEventListener('submit', this._submitListener);
            this._submitListener = null;
        }
    }

    public async show(action: AIAction,
        info: AIElementInfo,
        callback: (action: AIAction, info: AIElementInfo, prompt: string, chatbotIds: string[], effort: string) => void = () => { }) {
        if (this._submitListener) this._formElem.removeEventListener('submit', this._submitListener);
        const offcanvasModule = await this.bootstrap.loadOffCanvasModule();
        const bsOffcanvas = offcanvasModule.getOrCreateInstance(this._htmlElem, {
            backdrop: false,
            keyboard: true,
            scroll: true
        });
        this.action = action;
        this.type = info.type;
        this.explanation = '';
        this.references = [];
        this.query = '';
        this.input = '';
        this._select.refreshOptions({data: info.chatbots});
        this._submitListener = (e: Event) => {
            e.preventDefault();
            const prompt = this.input;
            const chatbotIds = this._select.getSelects() as string[];
            const effort = this._effort.getSelects()[0] as string;
            this.query = prompt;
            this.input = '';
            callback(action, info, prompt, chatbotIds, effort)
        };
        this._formElem.addEventListener('submit', this._submitListener);
        this.toggleSendButton(true);
        bsOffcanvas.show();
    }

    public toggleSendButton(enabled: boolean) {
        const btn = this._htmlElem.querySelector('input[type=submit]') as HTMLInputElement;
        btn.disabled = !enabled;
    }

    public get showCallback(): () => void { return this._showCallback ? this._showCallback : () => { }; }
    public set showCallback(callback: () => void) { this._showCallback = callback; }
    public get hideCallback(): () => void { return this._hideCallback ? this._hideCallback : () => { }; }
    public set hideCallback(callback: () => void) { this._hideCallback = callback; }

    public get type(): string { return this._type; }
    public set type(type: string) {
        this._type = type;
        const isWidget = !['Model', SectionElement.widget].includes(this._type);
        const widgetTypeElem = this._htmlElem.querySelector('#ai-prompt-widget-type');
        widgetTypeElem.innerHTML = isWidget ? this.i18n.value(`widgets.${type}.label`) : '';
        widgetTypeElem.classList.toggle('d-none', !isWidget);
        if (isWidget) this._type = 'Widget';
        this._htmlElem.querySelector('.offcanvas-title').innerHTML =
            this.i18n.value(`common.ai.prompt.${this._type.toLowerCase()}.${this._action}`);
    }
    public get action(): AIAction { return this._action; }
    public set action(action: AIAction) {
        this._action = action;
        if (!['Model', SectionElement.widget].includes(this._type)) this._type = 'Widget';
        this._htmlElem.querySelector('.offcanvas-title').innerHTML =
            this.i18n.value(`common.ai.prompt.${this._type.toLowerCase()}.${this._action}`);
    }
    public get elements(): Set<string> { return this._elements; }
    public set elements(elements: Set<string>) {
        this._elements = elements;
    }

    public get explanation() {
        return (this._htmlElem.querySelector('#ai-prompt-response') as HTMLElement).innerText;
    }

    public set explanation(explanation: string) {
        const elem = this._htmlElem.querySelector('#ai-prompt-response') as HTMLElement;
        elem.classList.toggle('d-none', !explanation);
        elem.innerText = explanation;
    }

    public get query() {
        return (this._htmlElem.querySelector('#ai-prompt-query') as HTMLElement).innerText;
    }

    public set query(query: string) {
        const elem = this._htmlElem.querySelector('#ai-prompt-query') as HTMLElement;
        elem.classList.toggle('d-none', !query);
        elem.innerText = query;
        this.explanation = '';
    }

    public get input() {
        return (this._htmlElem.querySelector('#ai-prompt') as HTMLInputElement).value;
    }

    public set input(input: string) {
        const elem = this._htmlElem.querySelector('#ai-prompt') as HTMLInputElement;
        elem.value = input;
    }

    public get references(): string[] {
        const refs = this._htmlElem.querySelectorAll('.ai-reference');
        return Array.from(refs).map(ref => ref.textContent || '');
    }

    public set references(references: string[]) {
        this._htmlElem.querySelector('#ai-prompt-references').classList.toggle('d-none', references.length === 0);
        const elem = this._htmlElem.querySelector('#ai-references-list') as HTMLElement;
        // Delete all ai-prompt-reference children
        elem.innerHTML = '';
        references.forEach(ref => {
            const html = `
            <li>
              <span class="ai-reference badge bg-dark">${ref}</span>
            </li>`;
            elem.insertAdjacentHTML('beforeend', html);
        });
    }
}