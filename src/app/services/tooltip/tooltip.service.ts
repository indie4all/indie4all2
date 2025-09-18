import { inject, injectable } from "inversify";
import BootstrapService from "../bootstrap/bootstrap.service";

@injectable()
export default class TooltipService {

    constructor(@inject(BootstrapService) private bootstrap: BootstrapService) { }

    public async create(elem: HTMLElement, text: string) {
        if (elem.title) elem.dataset.oldTitle = elem.title;
        elem.title = text;
        const tooltipModule = await this.bootstrap.loadTooltipModule();
        tooltipModule.getOrCreateInstance(elem);

    }

    public async dispose(elem: HTMLElement) {
        const tooltipModule = await this.bootstrap.loadTooltipModule();
        tooltipModule.getInstance(elem)?.dispose();
        if (elem.dataset.oldTitle) elem.title = elem.dataset.oldTitle;
        else elem.removeAttribute("title");
    }
}