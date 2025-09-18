import { inject, injectable } from "inversify";
import ContainerManager from "../../container.manager";
import { Model } from "../elements/model";
import './styles/styles.scss';
import Element from "../elements/element/element";
import { WidgetInitOptions } from "../../types";
import I18nService from "../services/i18n/i18n.service";
import UtilsService from "../services/utils/utils.service";
import UndoRedoService from "../services/undoredo/undoredo.service";
import BootstrapService from "../services/bootstrap/bootstrap.service";
import AIService from "../services/ai/ai.service";
import Toolbar from "./toolbar/toolbar";
import Footer from "./footer/footer";
import PromptService from "../services/prompt/prompt.service";
import LoadingService from "../services/loading/loading.service";
import AiPrompt from "./ai-prompt/ai-prompt";
import CipherService from "../services/cipher/cipher.service";
import ModelHandlerPublishService from "../services/model-handler/model-handler.publish.service";
import ModelHandlerDownloadService from "../services/model-handler/model-handler.download.service";
import ModelHandlerScormService from "../services/model-handler/model-handler.scorm.service";
import ModelHandlerPreviewService from "../services/model-handler/model-handler.preview.service";
import ModelHandlerSaveService from "../services/model-handler/model-handler.save.service";
import TooltipService from "../services/tooltip/tooltip.service";
import DragDropService from "../services/drag-drop/drag-drop.service";
import MigratorService from "../services/migrator/migrator.service";
import AddContentPromptService from "../services/add-content-prompt/add-content.prompt-service";
import Config from "../../config";
import AddElementAction from "../services/undoredo/actions/add-element.action";
import SectionElement from "../elements/section/section.element";
import AddSectionAction from "../services/undoredo/actions/add-section.action";
import ColumnsLayoutElement from "../elements/columns-layout/columns-layout.element";
import RemoveElementAction from "../services/undoredo/actions/remove-element.action";
import RemoveSectionAction from "../services/undoredo/actions/remove-section.action";
import SwapSectionsAction from "../services/undoredo/actions/swap-section.action";
import BankElement from "../elements/bank/bank.element";
import WidgetElement from "../elements/widget/widget.element";
import Palette from "./palette/palette";
import ModalUnitSettings from "./modal-unit-settings/unit-settings.service";
import ModalTranslate from "./modal-translate/modal-translate";
import ModalNetlify from "./modal-netlify/modal-netlify";
import { AIAction, AIElementInfo, AIWidgetInfo, MultipleSelectChoice } from "./ai-prompt/types";
import { AIChanges, AIModel, AIResponse, AIResponseOK, AIResult, AISection, AIWidget, isAIResponseError } from "../services/ai/types";
import EditElementAction from "../services/undoredo/actions/edit-element.action";
import Action from "../services/undoredo/actions/action";
import ReplaceModelAction from "../services/undoredo/actions/replace-model.action";
import UpdateElementAction from "../services/undoredo/actions/update-element.action";
import * as jsonpatch from 'fast-json-patch';

@injectable()
export default abstract class Editor {

    protected _containerElem: HTMLElement;
    protected _paletteElem: HTMLElement;
    protected _injector = ContainerManager.instance;
    @inject(I18nService)
    protected _i18n: I18nService;
    @inject(Model)
    protected _model: Model;
    @inject("Factory<Element>") protected _factory: (widget: string, values?: any, options?: WidgetInitOptions) => Promise<Element>;
    @inject(Palette) protected _palette: Palette;
    @inject(ModalUnitSettings) protected _settings: ModalUnitSettings;
    @inject(UtilsService) protected _utils: UtilsService;
    @inject(UndoRedoService) protected _undoredo: UndoRedoService;
    @inject(BootstrapService) protected _bootstrap: BootstrapService;
    @inject(AIService) protected _ai: AIService;
    @inject(Toolbar) protected _toolbar: Toolbar;
    @inject(Footer) protected _footer: Footer;
    @inject(PromptService) protected _prompt: PromptService;
    @inject(LoadingService) protected _loading: LoadingService;
    @inject(AiPrompt) protected _aiprompt: AiPrompt;
    @inject(ModalTranslate) protected _translateModal: ModalTranslate;
    @inject(CipherService) protected _cipher: CipherService
    @inject(ModelHandlerPublishService) protected _publisher: ModelHandlerPublishService;
    @inject(ModelHandlerDownloadService) protected _downloader: ModelHandlerDownloadService;
    @inject(ModelHandlerScormService) protected _scormer: ModelHandlerScormService;
    @inject(ModalNetlify) protected _netlify: ModalNetlify;
    @inject(ModelHandlerPreviewService) protected _previewer: ModelHandlerPreviewService;
    @inject(ModelHandlerSaveService) protected _saver: ModelHandlerSaveService;
    @inject(TooltipService) protected _tooltip: TooltipService;
    @inject(DragDropService) protected _dragDrop: DragDropService;
    @inject(MigratorService) protected _migrator: MigratorService;
    @inject(AddContentPromptService) protected _contentPrompt: AddContentPromptService;
    @inject('Factory<Action>') protected _actionFactory: <T extends Action>(typeAction: new () => T, model: Model, data: any) => T;

    private async getChatbots(): Promise<MultipleSelectChoice[]> {
        return (await this._ai.getChatbots()).map(chatbot => ({
            text: chatbot.title,
            value: chatbot.chatbotId
        }));
    }

    public async init(): Promise<void> {
        this._paletteElem = document.getElementById('palette');
        this._containerElem = document.getElementById('main-container');
        await this._bootstrap.loadAlertModule();
        await this._bootstrap.loadCollapseModule();
        // Dinamycally load tooltips in container
        const tooltipModule = await this._bootstrap.loadTooltipModule();
        tooltipModule.getOrCreateInstance(this._containerElem, { selector: '[data-bs-toggle="tooltip"],[data-tooltip]' });

        // UNIT SETTINGS MODAL
        await this._settings.init();

        // TRANSLATE MODAL
        this._translateModal.submitCallback = async (e: Event, from: string, to: string) => {
            e.preventDefault();
            await this._loading.show();
            const texts = this._model.texts;
            try {
                const translated = await this._i18n.translateOnDemand(JSON.stringify(texts), from ?? "EN", to);
                this._model.texts = translated;
                this._model.language = to;
                await this._loading.show();
                this.load();
            } catch (error) {
                console.error(error);
                this._utils.notifyError(error.message);
            } finally {
                await this._loading.hide();
            }
        };

        // FOOTER
        await this._footer.init();
        if (this._footer.clear) this._footer.clear.callback = () => this.clear();
        if (this._footer.addSection) this._footer.addSection.callback = () => this.addSection();
        if (this._footer.importSection) this._footer.importSection.callback = () => this.importSection();
        if (this._footer.addSectionWithAI) this._footer.addSectionWithAI.callback = () => this.addSectionWithAI();

        // AI PROMPT
        await this._aiprompt.init();
        // this._aiprompt.showCallback = () =>
        //     document.body.classList.add('ai-prompt-offcanvas-open');
        // this._aiprompt.hideCallback = () =>
        //     document.body.classList.remove('ai-prompt-offcanvas-open');

        // TOOLBAR
        await this._toolbar.init();
        if (this._toolbar.ai) this._toolbar.ai.callback = () => this.addModelWithAI();
        if (this._toolbar.aiUpdate) this._toolbar.aiUpdate.callback = () => this.updateModelWithAI();
        if (this._toolbar.upload) this._toolbar.upload.callback = async (e: ProgressEvent<FileReader>) => {
            const model = JSON.parse(e.target.result as string);
            await this.load(model);
        };
        if (this._toolbar.translate) this._toolbar.translate.callback = () => this.doIfValid(() => this._translateModal.show());
        if (this._toolbar.publish) this._toolbar.publish.callback = () => this.doIfValid(() => this._publisher.start(this._model));
        if (this._toolbar.download) this._toolbar.download.callback = () => this.doIfValid(() => this._downloader.start(this._model));
        if (this._toolbar.scorm) this._toolbar.scorm.callback = () => this.doIfValid(() => this._scormer.start(this._model));
        if (this._toolbar.netlify) this._toolbar.netlify.callback = () => this.doIfValid(() => this._netlify.start(this._model));
        if (this._toolbar.preview) this._toolbar.preview.callback = () => this.doIfValid(() => this._previewer.start(this._model));
        if (this._toolbar.save) this._toolbar.save.callback = () => this.doIfValid(() => this._saver.start(this._model));
        if (this._toolbar.undo) this._toolbar.undo.callback = () => this._undoredo.undo();
        if (this._toolbar.redo) this._toolbar.redo.callback = () => this._undoredo.redo();
        if (this._toolbar.validate) this._toolbar.validate.callback = () => this.validateContent(true);

        // DRAG AND DROP (FROM PALETTE TO CONTAINER)
        await this._dragDrop.init(this._paletteElem, this._containerElem, this._model);

        // ACTIONS TO DO WHEN THE MODEL CHANGES
        this._model.modelChanged.subscribe(() => {
            // Do not allow the user to call create a model with AI when the content is not empty
            this._toolbar.toggleAI(this._model.empty);
            // Force the user to update the omdel with AI when the content is not empty
            this._toolbar.toggleAIUpdate(!this._model.empty);
            // Prevent the user from creating a model when the model is not empty
            if (this._aiprompt.action === AIAction.Create && this._aiprompt.type === 'Model') 
                this._aiprompt.toggleSendButton(this._model.empty)
            // Prevent the user from editing content when the model is empty
            else this._aiprompt.toggleSendButton(!this._model.empty)
        });

        // BIND EVENTS FROM CHILDREN ELEMENTS IN CONTAINER
        this._containerElem.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const btn = target.closest('.btn-toolbar-action') as HTMLButtonElement;
            if (!btn) return;
            // Needed in order to hide after click on the delete button
            tooltipModule.getInstance(btn)?.hide();
            const container = btn.closest('[data-id]') as HTMLElement;
            const containerId = container.dataset.id;
            if (btn.classList.contains('btn-export-section')) this.exportSection(containerId);
            else if (btn.classList.contains('btn-import-element')) this.importElement(containerId)
            else if (btn.classList.contains('btn-copy-section')) this.copySection(containerId);
            else if (btn.classList.contains('btn-swap-up')) this.swap(containerId, 1);
            else if (btn.classList.contains('btn-swap-down')) this.swap(containerId, 0);
            else if (btn.classList.contains('btn-remove-section')) this.removeSection(containerId);
            else if (btn.classList.contains('btn-add-content')) this.addContent(containerId, container.dataset.widget);
            else if (btn.classList.contains('btn-edit-element')) this.editElement(containerId);
            else if (btn.classList.contains('btn-copy-element')) this.copyElement(containerId);
            else if (btn.classList.contains('btn-export-element')) this.exportElement(containerId);
            else if (btn.classList.contains('btn-remove-element')) this.removeElement(containerId);
            else if (btn.classList.contains('btn-bank-questions')) this.openWidgetBank(containerId);
            else if (btn.classList.contains('btn-ai-add-widget')) this.addWidgetWithAI(containerId);
            else if (btn.classList.contains('btn-ai-edit-widget')) this.editWidgetWithAI(containerId, container.dataset.widget);
        });

        if (Config.getAnalyticsBasePath()) {
            // ANALYTICS: send start and stop events
            navigator.sendBeacon(Config.getAnalyticsBasePath() + "/entrance")
            document.addEventListener('visibilitychange', function (event) {
                navigator.sendBeacon(Config.getAnalyticsBasePath() + (document.visibilityState === "hidden" ? "/exit" : "/entrance"))
            });
        }

        // [Fix] TinyMCE in bootstrap modals
        document.addEventListener('focusin', (e) => {
            if ((e.target as HTMLElement).closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
                e.stopImmediatePropagation();
            }
        });

        // Load all the categories by default
        await this._palette.init(this._paletteElem, this._injector.allWidgets);

        // Initialize the model with an empty object
        await this._model.init({});

    }

    editElement(id: string) {
        this._model.edit(id, async (before, now) => {
            const action = this._actionFactory(EditElementAction, this._model, { before, now, id });
            await this._undoredo.pushAndExecuteCommand(action);
        });
    }

    clear() {
        this._prompt.prompt(
            this._i18n.value("general.areYouSure"),
            this._i18n.value("messages.confirmClearContent"), (result) => {
                if (result) {
                    $(this._containerElem).children().fadeOut(500).promise().done(() => {
                        $(this._containerElem).empty();
                        this._utils.notifySuccess(this._i18n.value("messages.contentCleared"));
                        this._model.clear();
                    });
                }
            },
            { button: { confirm: this._i18n.value("general.delete") } });
    }

    async resetModel() { await this._model.init({}); }

    getModelErrors(...args: any[]) {
        const currentErrors = this._model.currentErrors;
        const newErrors = this._model.validate();
        return { currentErrors, newErrors };
    }

    async addSpecificContent(containerId: string, type: string) {
        const elem = await this._factory(type);
        this.addModelElement(elem, containerId);
    }

    async addModelElement(modelElement: Element, parentContainerId: string, parentContainerIndex?: number) {
        const action = this._actionFactory(AddElementAction, this._model, {
            element: modelElement,
            // Only important for columns, and we cannot add items in columns without dragging
            parentContainerIndex,
            parentContainerId,
            // Add the element at the end of its container
            inPositionElementId: null
        });
        await this._undoredo.pushAndExecuteCommand(action);
    }

    async addSection(modelSection?: SectionElement) {
        const index = this._model.numberOfSections + 1;
        const section = modelSection ?? await this._factory(SectionElement.widget, { index });
        const action = this._actionFactory(AddSectionAction, this._model, {
            element: section,
            position: this._model.numberOfSections,
            container: this._containerElem
        });
        await this._undoredo.pushAndExecuteCommand(action);
    }

    addContent(containerId: string, widget: string) {
        const allowed = this._injector.allowed(widget);
        if (allowed.length === 0) throw new Error('Cannot create content for non-specific container');
        if (allowed.length === 1) {
            this.addSpecificContent(containerId, allowed[0].widget);
            return;
        }

        const options = allowed.map(proto => ({
            text: this._i18n.value(`widgets.${proto.widget}.label`),
            value: proto.widget
        }));

        this._contentPrompt.prompt(this._i18n.value("common.selectType"), options,
            (value) => this.addSpecificContent(containerId, value));
    }

    copyElement(id: string) {
        let parentId = <string>$(`[data-id=${id}]`).parents('[type=container]').first().attr('data-id');
        this.copyModelElement(this.getModelElement(id), parentId);
    }

    async copyModelElement(element: Element, sectionId: string) {
        const parent = this._model.findObject(sectionId);
        if (parent instanceof ColumnsLayoutElement) {
            const index = parent.data.findIndex((elem) => elem.includes(element));
            this.addModelElement(await element.clone(), sectionId, index);
        }
        else this.addModelElement(await element.clone(), sectionId);
    }

    getModelElement(id: string) { return this._model.findObject(id); }

    copySection(id: string) { this.copyModelSection(this.getModelElement(id) as SectionElement) }

    async copyModelSection(section: SectionElement) {
        this.addSection(await section.clone() as SectionElement);
    }

    async importElement(id: string) {
        try {
            const encrypted: string | null = localStorage.getItem('copied-element');
            if (!encrypted) {
                localStorage.removeItem('copied-element');
                this._utils.notifyWarning(this._i18n.value("messages.noElement"));
                return;
            }

            const decrypted = await this._cipher.decrypt(encrypted);
            const elementJSON = JSON.parse(decrypted);
            const modelElement = await this._factory(elementJSON.widget, elementJSON);
            this.copyModelElement(modelElement, id);
            this._utils.notifySuccess(this._i18n.value("messages.importedElement"));

        } catch (err) {
            localStorage.removeItem('copied-element');
            this._utils.notifyWarning(this._i18n.value("messages.noElement"));
        }
    }

    async importSection() {
        try {
            const encrypted: string | null = localStorage.getItem('copied-section');
            if (!encrypted) {
                localStorage.removeItem('copied-section');
                this._utils.notifyWarning(this._i18n.value("messages.noSection"));
                return;
            }
            const decrypted = await this._cipher.decrypt(encrypted);
            const sectionJSON = JSON.parse(decrypted);
            const sectionElement = await this._factory(sectionJSON.widget, sectionJSON) as SectionElement;
            this.copyModelSection(sectionElement);
            this._utils.notifySuccess(this._i18n.value("messages.importedSection"));
        } catch (err) {
            localStorage.removeItem('copied-section');
            this._utils.notifyWarning(this._i18n.value("messages.noSection"));
        }
    }

    async removeElement(id: string) {
        var elementToBeRemoved = this._model.findObject(id);
        var parent = this._model.findParentOfObject(id);
        var parentContainerId = parent.id;
        var parentContainerIndex = -1;
        var inPositionElementId = null;
        let container: any[];
        if (parent instanceof ColumnsLayoutElement) {
            parentContainerIndex = parent
                .data.findIndex(elemArr => elemArr.findIndex(elem => elem.id === id) !== -1);
            container = parent.data[parentContainerIndex];
        } else {
            container = parent.data;
        }

        const positionIndex = container.findIndex(elem => elem.id === id);
        if (positionIndex < container.length - 1)
            inPositionElementId = container[positionIndex + 1].id;

        const action = this._actionFactory(RemoveElementAction, this._model, {
            element: elementToBeRemoved,
            parentContainerIndex,
            parentContainerId,
            inPositionElementId
        });
        await this._undoredo.pushAndExecuteCommand(action);
    }

    async removeSection(sectionId: string) {
        const action = this._actionFactory(RemoveSectionAction, this._model, {
            element: this._model.findObject(sectionId),
            position: this._model.indexOfSection(sectionId),
            container: this._containerElem
        });
        await this._undoredo.pushAndExecuteCommand(action);
        this._utils.notifySuccess(this._i18n.value("messages.deletedSection"));
    }

    exportElement(id: string) {
        try {
            const original = this.getModelElement(id);
            this._cipher.encrypt(JSON.stringify(original)).then(encrypted => {
                localStorage.setItem('copied-element', encrypted);
                this._utils.notifySuccess(this._i18n.value("messages.exportedElement"));
            });
        } catch (err) {
            this._utils.notifyWarning(this._i18n.value("messages.couldNotExportElement"));
        }
    }

    exportSection(id: string) {
        try {
            const original = this.getModelElement(id);
            this._cipher.encrypt(JSON.stringify(original)).then(encrypted => {
                localStorage.setItem('copied-section', encrypted);
                this._utils.notifySuccess(this._i18n.value("messages.exportedSection"));
            });
        } catch (err) {
            this._utils.notifyWarning(this._i18n.value("messages.couldNotExportSection"));
        }
    }

    async swap(sectionOriginId: string, direction: number) {
        const action = this._actionFactory(SwapSectionsAction, this._model, {
            sectionOriginId: sectionOriginId,
            direction: direction
        });
        await this._undoredo.pushAndExecuteCommand(action);
    }

    async doIfValid(callback: Function) {
        // Check if the model is valid before trying to download
        if (!await this.validateContent(true)) return;
        callback();
    }

    async validateContent(print: boolean = false) {
        const { currentErrors, newErrors } = this.getModelErrors();
        // Remove previous errors
        await Promise.all(currentErrors
            .map(error => document.querySelector("[data-id='" + error.element + "']"))
            .filter(elem => elem !== null)
            .map(async elem => {
                await this._tooltip.dispose(elem.querySelector('[data-prev]'));
                elem.parentNode && (elem.parentNode as HTMLElement).classList.remove('editor-error');
            }));

        // // Show new errors
        await Promise.all(newErrors
            .map(async error => {
                const element = document.querySelector("[data-id='" + error.element + "']");
                if (element) {
                    element.parentNode && (element.parentNode as HTMLElement).classList.add('editor-error');
                    const preview = <HTMLElement>element.querySelector('[data-prev]');
                    if (preview) {
                        const title = error.keys
                            .map(key => this._i18n.value("errors." + key))
                            .join(" ");
                        await this._tooltip.create(preview, title);
                    }
                }
            }));

        // Print errors in the view

        // No sections
        if (this._model.numberOfSections == 0) {
            if (print) this._utils.notifyError(this._i18n.value("messages.emptyContent"));
            return false;
        }

        // // Only hidden sections
        if (this._model.numberOfVisibleSections == 0) {
            if (print) this._utils.notifyError(this._i18n.value("messages.hiddenContent"));
            return false;
        }

        if (newErrors.length > 0) {
            if (print) this._utils.notifyError(this._i18n.value("messages.contentErrors"));
            return false;
        }
        if (print) this._utils.notifySuccess(this._i18n.value("messages.noErrors"));
        return true;
    }

    async openWidgetBank(id: string) {
        const bank = await this._factory(BankElement.widget) as BankElement;
        const parent = this._model.findObject(id);
        const constructor = parent.constructor as typeof WidgetElement;
        // Get only the widgets that are allowed in the current context
        bank.filters = { types: this._injector.allowed(constructor.widget).map(ele => ele.widget) };
        await bank.edit(async (formData) => {
            let elems = formData.widget.filter(elem => elem.checked);
            if (formData.random) elems = elems.sort(() => Math.random() - 0.5).slice(0, formData['random-number']);
            await Promise.all(elems.map(async elem => {
                const updated = await this._migrator.migrateWidget(JSON.parse(elem.content));
                const widget = await (await this._factory(elem.type, updated)).clone();
                this.addModelElement(widget, id);
            }));
        });
    }

    async addModelWithAI(): Promise<void> {
        const chatbots = await this.getChatbots();
        this._aiprompt.show(AIAction.Create, { type: 'Model', chatbots }, async (aiAction, info, prompt, chatbotIds, effort) => {
            const before = this._model.toJSON();
            const model = (await this.onSubmitAIPrompt(aiAction, info, prompt, chatbotIds, effort) as AIModel);
            const json = this._model.toJSON();
            json.sections = model.sections;
            const action = this._actionFactory(ReplaceModelAction, this._model, { before, now: json, container: this._containerElem });
            this._undoredo.pushAndExecuteCommand(action);
        });
    }

    async updateModelWithAI(): Promise<void> {
        const chatbots = await this.getChatbots();
        this._aiprompt.show(AIAction.Update, { type: 'Model', chatbots }, async (aiAction, info, prompt, chatbotIds, effort) => {
            const before = this._model.toJSON();
            const changes = ((await this.onSubmitAIPrompt(aiAction, info, prompt, chatbotIds, effort)) as AIChanges).changes;
            const json = this._model.toJSON();
            const result = jsonpatch.applyPatch(json, changes, false, true);
            const action = this._actionFactory(ReplaceModelAction, this._model, { before, now: json, container: this._containerElem });
            this._undoredo.pushAndExecuteCommand(action);
        });
    }

    async addSectionWithAI(): Promise<void> {
        const chatbots = await this.getChatbots();
        this._aiprompt.show(AIAction.Create, { type: SectionElement.widget, chatbots }, async (action, info, prompt, chatbotIds, effort) => {
            const section = (await this.onSubmitAIPrompt(action, info, prompt, chatbotIds, effort)) as AISection;
            const sectionElement = await this._factory(SectionElement.widget, section) as SectionElement;
            this.addSection(sectionElement);
        });
    }

    async addWidgetWithAI(sectionId: string) {
        const chatbots = await this.getChatbots();
        const allWidgetsAllowedInSection = this._injector.allWidgets.filter(widget =>
            this._injector.canHave(SectionElement, widget))
            // Only allow widgets that can use AI to generate content
            .filter(proto => proto.generable);

        const options = allWidgetsAllowedInSection.map(proto => ({
            text: this._i18n.value(`widgets.${proto.widget}.label`),
            value: proto.widget
        }));
        // Sort options by text
        options.sort((a, b) => a.text.localeCompare(b.text));
        this._contentPrompt.prompt(this._i18n.value("common.selectType"), options,
            (value) => this._aiprompt.show(AIAction.Create, { type: value, chatbots }, async (action, info, prompt, chatbotIds, effort) => {
                const elem = await this.onSubmitAIPrompt(action, info, prompt, chatbotIds, effort) as AIWidget;
                const widgetElement = await this._factory(elem.widget, elem) as WidgetElement;
                this.addModelElement(widgetElement, sectionId);
            }));
    }

    async editWidgetWithAI(widgetId: string, widgetType: string) {
        const info: AIWidgetInfo = { type: widgetType, id: widgetId, chatbots: await this.getChatbots() };
        this._aiprompt.show(AIAction.Update, info, async (aiAction, info, prompt, chatbotIds, effort) => {
            const widget = await this.onSubmitAIPrompt(aiAction, info, prompt, chatbotIds, effort);
            const modelElem = this._model.findObject(widgetId);
            const before = modelElem.toJSON();
            const now = widget;
            const action = this._actionFactory(UpdateElementAction, this._model, { before, now, id: widgetId });
            this._undoredo.pushAndExecuteCommand(action);
        });
    }

    async onSubmitAIPrompt(action: AIAction, info: AIElementInfo, prompt: string, chatbotIds: string[], effort: string): Promise<AIResult> {
        let response: AIResponse;
        await this._loading.show();
        if (action === AIAction.Create) {
            if (info.type === 'Model') response = await this._ai.createModel(prompt, chatbotIds, effort);
            else if (info.type === 'Section') response = await this._ai.createSection(prompt, chatbotIds, this._model, effort);
            else response = await this._ai.createWidget(prompt, chatbotIds, info.type, this._model, effort);
        } else if (action === AIAction.Update) {
            if (info.type === 'Model') response = await this._ai.updateModel(prompt, chatbotIds, this._model, effort);
            else if (info.type === 'Section') throw new Error('Cannot update a section');
            else {
                const wInfo = info as AIWidgetInfo;
                response = await this._ai.updateWidget(prompt, chatbotIds, wInfo.id, this._model, effort);
            }
        }
        await this._loading.hide();
        if (isAIResponseError(response)) {
            this._aiprompt.explanation = this._i18n.value("errors.AI.sorry");
            this._utils.notifyError(this._i18n.value("errors.AI." + (response.code || "sorry"), response.parameters));
            throw new Error(response.error);
        }
        const responseOK = response as AIResponseOK;
        this._aiprompt.explanation = responseOK.explanation;
        return responseOK.model;
    }

    abstract load(model?: object, onLoaded?: Function): Promise<void>;

}