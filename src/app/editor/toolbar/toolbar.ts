import { inject, injectable } from "inversify";
import I18nService from "../../services/i18n/i18n.service";
import ContainerManager from "../../../container.manager";
import Config from "../../../config";
import ButtonFileAction from "../btn/btn.file.action";
import ButtonClickAction from "../btn/btn.click.action";
import ButtonAction from "../btn/btn.action";

@injectable()
export default class Toolbar {

    private _actions: { [x: string]: ButtonAction } = {};
    private _container: HTMLElement;

    constructor(@inject(I18nService) private i18n: I18nService) { }

    private async enable(name: string, title: string, icon: string, fileAction = false): Promise<ButtonAction> {
        const { default: template } = await import('./btn-wrapper.hbs');
        const prefix = 'author-';
        this._container.insertAdjacentHTML('beforeend', template());
        const listItem = this._container.querySelector('li:last-child') as HTMLElement;
        const action = ContainerManager.instance.get(fileAction ? ButtonFileAction : ButtonClickAction);
        await action.init(prefix + name, title, 'btn-info', icon, listItem);
        const actionElem = document.getElementById(action.id);
        actionElem.querySelector('.btn-text').classList.add('d-md-none');
        this._actions[name] = action;
        return action;
    }

    private async enableTranslation(): Promise<void> {
        await this.enable('translate', this.i18n.value('header.translate'), 'fa-language');
    }

    private async enableUploadModel(): Promise<void> {
        await this.enable('upload-model', this.i18n.value('header.upload'), 'fa-cloud-upload-alt', true);
    }

    private async enableAI(): Promise<void> {
        await this.enable('ai', this.i18n.value('header.ai'), 'fa-brain');
    }

    private async enableAIUpdate(): Promise<void> {
        await this.enable('ai-update', this.i18n.value('header.ai-update'), 'fa-brain');
    }

    private async enablePublish(): Promise<void> {
        await this.enable('publish', this.i18n.value('header.publish'), 'fa-globe');
    }

    private async enableNetlify(): Promise<void> {
        await this.enable('netlify', this.i18n.value('header.publishToNetlify'), 'fa-n');
    }

    private async enableSCORM(): Promise<void> {
        await this.enable('scorm', this.i18n.value('header.scorm'), 'fa-box-open');
    }

    private async enablePreview(): Promise<void> {
        await this.enable('preview', this.i18n.value('header.preview'), 'fa-eye');
    }

    private async enableValidate(): Promise<void> {
        await this.enable('validate', this.i18n.value('header.validate'), 'fa-check');
    }

    private async enableSave(): Promise<void> {
        await this.enable('save', this.i18n.value('header.save'), 'fa-floppy-disk');
    }

    private async enableDownload(): Promise<void> {
        await this.enable('download', this.i18n.value('header.download'), 'fa-cloud-download-alt');
    }

    private async enableUndo(): Promise<void> {
        await this.enable('undo', this.i18n.value('header.undo'), 'fa-undo');
    }

    private async enableRedo(): Promise<void> {
        await this.enable('redo', this.i18n.value('header.redo'), 'fa-redo');
    }

    private async enableInstall(): Promise<void> {
        // Enable PWA application support if available in the browser
        window.addEventListener('beforeinstallprompt', async (event) => {
            // Prevent the mini-infobar from appearing on mobile.
            event.preventDefault();
            const action = await this.enable('install', this.i18n.value('header.install'), 'fa-download');
            action.callback = async (e: Event) => {
                // BeforeInstallPrompt is (for now) a non-standard event
                const beforeInstallPromptEvent = event as any;
                beforeInstallPromptEvent.prompt();
                await beforeInstallPromptEvent.userChoice;
                const actionElem = document.getElementById(action.id);
                actionElem.parentElement.classList.toggle("d-none", true);
            };
        });
    }

    private async toggleDisabled(name: string, active: boolean): Promise<void> {
        const action = this._actions[name];
        if (action) {
            const actionElem = document.getElementById(action.id) as HTMLButtonElement;
            actionElem.disabled = !active;
        }
    }

    public async toggleTranslation(active: boolean): Promise<void> {
        await this.toggleDisabled('translate', active);
    }

    public async toggleUploadModel(active: boolean): Promise<void> {
        await this.toggleDisabled('upload-model', active);
    }

    public async toggleAI(active: boolean): Promise<void> {
        await this.toggleDisabled('ai', active);
    }

    public async toggleAIUpdate(active: boolean): Promise<void> {
        await this.toggleDisabled('ai-update', active);
    }

    public async togglePublish(active: boolean): Promise<void> {
        await this.toggleDisabled('publish', active);
    }

    public async toggleNetlify(active: boolean): Promise<void> {
        await this.toggleDisabled('netlify', active);
    }

    public async toggleSCORM(active: boolean): Promise<void> {
        await this.toggleDisabled('scorm', active);
    }

    public async togglePreview(active: boolean): Promise<void> {
        await this.toggleDisabled('preview', active);
    }

    public async toggleValidate(active: boolean): Promise<void> {
        await this.toggleDisabled('validate', active);
    }

    public async toggleSave(active: boolean): Promise<void> {
        await this.toggleDisabled('save', active);
    }

    public async toggleDownload(active: boolean): Promise<void> {
        await this.toggleDisabled('download', active);
    }

    public async toggleUndo(active: boolean): Promise<void> {
        await this.toggleDisabled('undo', active);
    }

    public async toggleRedo(active: boolean): Promise<void> {
        await this.toggleDisabled('redo', active);
    }

    public async toggleInstall(active: boolean): Promise<void> {
        await this.toggleDisabled('install', active);
    }

    public async init(): Promise<void> {
        this._container = document.querySelector('.navbar-nav') as HTMLElement;
        if (!Config.isWidgetEditorEnabled() && Config.getAIURL()) await this.enableAI();
        if (!Config.isWidgetEditorEnabled() && Config.getAIURL()) {
            await this.enableAIUpdate();
            await this.toggleAIUpdate(false);
        }
        if (await this.i18n.canTranslateUnits()) await this.enableTranslation();
        if (Config.isPWAEnabled()) await this.enableInstall();
        if (Config.getPublishBackendURL()) await this.enablePublish();
        if (Config.getPublishToNetlifyBackendURL()) await this.enableNetlify();
        if (Config.getScormBackendURL()) await this.enableSCORM();
        if (Config.getSaveBackendURL()) await this.enableSave();
        if (Config.getPreviewBackendURL()) await this.enablePreview();
        if (!Config.isWidgetEditorEnabled()) await this.enableUploadModel();
        if (!Config.isWidgetEditorEnabled()) await this.enableDownload();
        await this.enableValidate();
        await this.enableUndo();
        await this.enableRedo();
    }


    private getAction(name: string): ButtonAction { return this._actions[name]; }
    public get ai(): ButtonAction { return this.getAction('ai'); }
    public get aiUpdate(): ButtonAction { return this.getAction('ai-update'); }
    public get translate(): ButtonAction { return this.getAction('translate'); }
    public get publish(): ButtonAction { return this.getAction('publish'); }
    public get netlify(): ButtonAction { return this.getAction('netlify'); }
    public get scorm(): ButtonAction { return this.getAction('scorm'); }
    public get preview(): ButtonAction { return this.getAction('preview'); }
    public get validate(): ButtonAction { return this.getAction('validate'); }
    public get save(): ButtonAction { return this.getAction('save'); }
    public get download(): ButtonAction { return this.getAction('download'); }
    public get undo(): ButtonAction { return this.getAction('undo'); }
    public get redo(): ButtonAction { return this.getAction('redo'); }
    public get install(): ButtonAction { return this.getAction('install'); }
    public get upload(): ButtonAction { return this.getAction('upload-model'); }

}