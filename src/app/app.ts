import { inject, injectable } from "inversify";
import I18nService from "./services/i18n/i18n.service";
import FontAwesomeService from "./services/font-awesome/font-awesome.service";
import Editor from "./editor/editor";

@injectable()
export default class App {
    constructor(
        @inject(I18nService) private i18n: I18nService,
        @inject(FontAwesomeService) private fontAwesome: FontAwesomeService,
        @inject(Editor) private editor: Editor
    ) { }
    async init() {
        // Load all translations before running the app
        await this.i18n.init();
        // Initialize font awesome
        await this.fontAwesome.init();
        // Initialize the editor
        await this.editor.init();
    }

    async load(model: any) {
        await this.editor.load(model);
    }
}