import { inject, injectable } from "inversify";
import PromptService from "../prompt/prompt.service";

@injectable()
export default class AddContentPromptService {

    constructor(@inject(PromptService) private promptService: PromptService) { }

    async prompt(title: string, options: { text: string, value: string }[], callback: (value: string) => void) {
        const { default: template } = await import('./template.hbs');
        await this.promptService.prompt(title, template({ options }), (result) => {
            if (result) {
                const select = document.getElementById('modal-prompt').querySelector('select') as HTMLSelectElement;
                callback(select.value)
            }
        });

    }
}