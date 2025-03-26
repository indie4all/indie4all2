import { inject, injectable } from 'inversify';
import BootstrapService from '../../services/bootstrap/bootstrap.service';

@injectable()
export default abstract class ButtonAction {

    protected _callback: (e: Event) => void = () => { };
    protected _id: string;
    @inject(BootstrapService)
    protected _bootstrap: BootstrapService;

    constructor() { }

    public async init(id: string, title: string, type: string, icon: string, container: HTMLElement): Promise<void> {
        this._id = id;
        const { default: template } = await import('./template.hbs');
        const data = { id, title, type, icon };
        // Add HTML content to container
        container.insertAdjacentHTML('beforeend', template(data));
        const tooltipModule = await this._bootstrap.loadTooltipModule();
        const btnElem = document.getElementById(id);
        tooltipModule.getOrCreateInstance(btnElem, { trigger: 'hover', placement: 'bottom' });
    }
    public get callback(): (e: Event, ...args: any[]) => void { return this._callback ? this._callback : () => { }; }
    public set callback(callback: (e: Event, ...args: any[]) => void) { this._callback = callback; }
    public get id(): string { return this._id; }
}