import { Container, interfaces } from "inversify";
import UnitEditor from "./app/editor/unit.editor";
import Editor from "./app/editor/editor";
import VideoElement from "./app/elements/video/video.element";
import VideoLocalElement from "./app/elements/video/video.local.element";
import VideoRemoteElement from "./app/elements/video/video.remote.element";
import Config from "./config";
import SimpleImageElement from "./app/elements/simple-image/simple-image.element";
import SimpleImageLocalElement from "./app/elements/simple-image/simple-image.local.element";
import SimpleImageRemoteElement from "./app/elements/simple-image/simple-image.remote.element";
import ImageTextElement from "./app/elements/image-text/image-text.element";
import ImageTextLocalElement from "./app/elements/image-text/image-text.local.element";
import ImageTextRemoteElement from "./app/elements/image-text/image-text.remote.element";
import ImageElement from "./app/elements/image/image.element";
import ImageLocalElement from "./app/elements/image/image.local.element";
import ImageRemoteElement from "./app/elements/image/image.remote.element";
import ChooseOptionElement from "./app/elements/choose-option/choose-option.element";
import ChooseOptionLocalElement from "./app/elements/choose-option/choose-option.local.element";
import ChooseOptionRemoteElement from "./app/elements/choose-option/choose-option.remote.element";
import AudioTermItemElement from "./app/elements/audio-term-item/audio-term-item.element";
import AudioTermItemLocalElement from "./app/elements/audio-term-item/audio-term-item.local.element";
import AudioTermItemRemoteElement from "./app/elements/audio-term-item/audio-term-item.remote.element";
import ImageSoundItemElement from "./app/elements/image-sound-item/image-sound-item.element";
import ImageSoundItemLocalElement from "./app/elements/image-sound-item/image-sound-item.local.element";
import ImageSoundItemRemoteElement from "./app/elements/image-sound-item/image-sound-item.remote.element";
import CouplesItemElement from "./app/elements/couples-item/couples-item.element";
import CouplesItemLocalElement from "./app/elements/couples-item/couples-item.local.element";
import CouplesItemRemoteElement from "./app/elements/couples-item/couples-item.remote.element";
import SchemaItemElement from "./app/elements/schema-item/schema-item.element";
import SchemaItemLocalElement from "./app/elements/schema-item/schema-item.local.element";
import SchemaItemRemoteElement from "./app/elements/schema-item/schema-item.remote.element";
import PuzzleElement from "./app/elements/puzzle/puzzle.element";
import PuzzleLocalElement from "./app/elements/puzzle/puzzle.local.element";
import PuzzleRemoteElement from "./app/elements/puzzle/puzzle.remote.element";
import CorrectWordItemElement from "./app/elements/correct-word-item/correct-word-item.element";
import CorrectWordItemLocalElement from "./app/elements/correct-word-item/correct-word-item.local.element";
import CorrectWordItemRemoteElement from "./app/elements/correct-word-item/correct-word-item.remote.element";
import AnimationElement from "./app/elements/animation/animation.element";
import AnimationLocalElement from "./app/elements/animation/animation.local.element";
import AnimationRemoteElement from "./app/elements/animation/animation.remote.element";
import ButtonTextItemElement from "./app/elements/button-text-item/button-text-item.element";
import ButtonTextItemLocalElement from "./app/elements/button-text-item/button-text-item.local.element";
import ButtonTextItemRemoteElement from "./app/elements/button-text-item/button-text-item.remote.element";
import TextBlockElement from "./app/elements/text-block/text-block.element";
import BlockquoteElement from "./app/elements/blockquote/blockquote.element";
import LatexFormulaElement from "./app/elements/latex-formula/latex-formula.element";
import BankElement from "./app/elements/bank/bank.element";
import TableElement from "./app/elements/table/table.element";
import TwoColumnsLayoutElement from "./app/elements/two-columns-layout/two-columns-layout.element";
import ThreeColumnsLayoutElement from "./app/elements/three-columns-layout/three-columns-layout.element";
import FourColumnsLayoutElement from "./app/elements/four-columns-layout/four-columns-layout.element";
import TabsContainerElement from "./app/elements/tabs-container/tabs-container.element";
import TabContentElement from "./app/elements/tab-content/tab-content.element";
import AccordionContainerElement from "./app/elements/accordion-container/accordion-container.element";
import AccordionContentElement from "./app/elements/accordion-content/accordion-content.element";
import ModalElement from "./app/elements/modal/modal.element";
import RelatedUnitsContainerElement from "./app/elements/related-units-container/related-units-container.element";
import RelatedUnitsItemElement from "./app/elements/related-units-item/related-units-item.element";
import RelatedUnitsAssociationElement from "./app/elements/related-units-association/related-units-association.element";
import CalloutElement from "./app/elements/callout/callout.element";
import GroupElement from "./app/elements/group/group.element";
import DragdropContainerElement from "./app/elements/dragdrop-container/dragdrop-container.element";
import DragdropItemElement from "./app/elements/dragdrop-item/dragdrop-item.element";
import TrueFalseContainerElement from "./app/elements/true-false-container/true-false-container.element";
import TrueFalseItemElement from "./app/elements/true-false-item/true-false-item.element";
import AudioTermContainerElement from "./app/elements/audio-term-container/audio-term-container.element";
import ImageSoundContainerElement from "./app/elements/image-sound-container/image-sound-container.element";
import CouplesContainerElement from "./app/elements/couples-container/couples-container.element";
import SchemaContainerElement from "./app/elements/schema-container/schema-container.element";
import CorrectWordContainerElement from "./app/elements/correct-word-container/correct-word-container.element";
import MissingWordsContainerElement from "./app/elements/missingwords-container/missingwords-container.element";
import MissingWordsItemElement from "./app/elements/missingwords-item/missingwords-item.element";
import SentenceOrderContainerElement from "./app/elements/sentenceorder-container/sentenceorder-container.element";
import SentenceOrderItemElement from "./app/elements/sentenceorder-item/sentenceorder-item.element";
import GuessWordElement from "./app/elements/guess-word/guess-word.element";
import ButtonTextContainerElement from "./app/elements/button-text-container/button-text-container.element";
import AnimationContainerElement from "./app/elements/animation-container/animation-container.element";
import AnimationItemElement from "./app/elements/animation-item/animation-item.element";
import TermClassificationElement from "./app/elements/term-classification/term-classification.element";
import TermClassificationItemElement from "./app/elements/term-classification-item/term-classification-item.element";
import TestContainerElement from "./app/elements/test-container/test-container.element";
import RouletteElement from "./app/elements/roulette/roulette.element";
import RouletteItemElement from "./app/elements/roulette-item/roulette-item.element";
import GapQuestionElement from "./app/elements/gap-question/gap-question.element";
import SimpleQuestionElement from "./app/elements/simple-question/simple-question.element";
import MultipleQuestionElement from "./app/elements/multiple-question/multiple-question.element";
import TrueFalseQuestionElement from "./app/elements/true-false-question/true-false-question.element";
import SectionElement from "./app/elements/section/section.element";
import Element from "./app/elements/element/element";
import WidgetElement from "./app/elements/widget/widget.element";
import { WidgetInitOptions } from "./types";
import I18nService from "./app/services/i18n/i18n.service";
import { Model } from "./app/elements/model";
import Toolbar from "./app/editor/toolbar/toolbar";
import Footer from "./app/editor/footer/footer";
import ButtonFileAction from "./app/editor/btn/btn.file.action";
import ButtonClickAction from "./app/editor/btn/btn.click.action";
import ModelHandlerDownloadService from "./app/services/model-handler/model-handler.download.service";
import ModelHandlerPublishService from "./app/services/model-handler/model-handler.publish.service";
import ModelHandlerScormService from "./app/services/model-handler/model-handler.scorm.service";
import ColorPickerService from "./app/services/color-picker/color-picker.service";
import ColorPickerElement from "./app/services/color-picker/color-picker.element";
import CoverPickerElement from "./app/services/cover-picker/cover-picker.element";
import CoverPickerService from "./app/services/cover-picker/cover-picker.service";
import ModelHandlerPreviewService from "./app/services/model-handler/model-handler.preview.service";
import ModelHandlerSaveService from "./app/services/model-handler/model-handler.save.service";
import TooltipService from "./app/services/tooltip/tooltip.service";
import SpecificItemElement from "./app/elements/specific-item/specific-item.element";
import ItemElement from "./app/elements/item/item.element";
import ContainerSpecificElement from "./app/elements/container-specific/container-specific.element";
import ColumnsLayoutElement from "./app/elements/columns-layout/columns-layout.element";
import SpecificContainerElement from "./app/elements/specific-container/specific-container.element";
import DragDropService from "./app/services/drag-drop/drag-drop.service";
import AiPrompt from "./app/editor/ai-prompt/ai-prompt";
import WidgetEditor from "./app/editor/widget.editor";
import ModalUnitSettings from "./app/editor/modal-unit-settings/unit-settings.service";
import ModalTranslate from "./app/editor/modal-translate/modal-translate";
import ModalNetlify from "./app/editor/modal-netlify/modal-netlify";
import Palette from "./app/editor/palette/palette";
import CategoryItem from "./app/editor/palette/category-item";
import App from "./app/app";
import UndoRedoService from "./app/services/undoredo/undoredo.service";
import AddElementAction from "./app/services/undoredo/actions/add-element.action";
import AddSectionAction from "./app/services/undoredo/actions/add-section.action";
import EditElementAction from "./app/services/undoredo/actions/edit-element.action";
import MoveContainerAction from "./app/services/undoredo/actions/move-container.action";
import MoveElementAction from "./app/services/undoredo/actions/move-element.action";
import RemoveElementAction from "./app/services/undoredo/actions/remove-element.action";
import RemoveSectionAction from "./app/services/undoredo/actions/remove-section.action";
import SwapSectionsAction from "./app/services/undoredo/actions/swap-section.action";
import Action from "./app/services/undoredo/actions/action";
import Category from "./app/editor/palette/category";
import ReplaceModelAction from "./app/services/undoredo/actions/replace-model.action";
import AddContentPromptService from "./app/services/add-content-prompt/add-content.prompt-service";
import AIService from "./app/services/ai/ai.service";
import AlertService from "./app/services/alert/alert.service";
import BootstrapService from "./app/services/bootstrap/bootstrap.service";
import CipherService from "./app/services/cipher/cipher.service";
import DownloaderService from "./app/services/downloader/downloader.service";
import FilePickerService from "./app/services/file-picker/file-picker.service";
import FontAwesomeService from "./app/services/font-awesome/font-awesome.service";
import LoadingService from "./app/services/loading/loading.service";
import MigratorService from "./app/services/migrator/migrator.service";
import PromptService from "./app/services/prompt/prompt.service";
import ThemeManagerService from "./app/services/theme-manager/theme-manager.service";
import UtilsService from "./app/services/utils/utils.service";

export default class ContainerManager extends Container {

    private static _instance: ContainerManager;

    public static get instance(): ContainerManager {
        if (!ContainerManager._instance) this._instance = this.createContainer();
        return this._instance;
    }

    private _mappings: { [x: string]: interfaces.Newable<Element> } = {
        [SectionElement.widget]: SectionElement,
        [TextBlockElement.widget]: TextBlockElement,
        [BlockquoteElement.widget]: BlockquoteElement,
        [LatexFormulaElement.widget]: LatexFormulaElement,
        [BankElement.widget]: BankElement,
        [VideoElement.widget]: Config.isLocal() ? VideoLocalElement : VideoRemoteElement,
        [SimpleImageElement.widget]: Config.isLocal() ? SimpleImageLocalElement : SimpleImageRemoteElement,
        [TableElement.widget]: TableElement,
        [TwoColumnsLayoutElement.widget]: TwoColumnsLayoutElement,
        [ThreeColumnsLayoutElement.widget]: ThreeColumnsLayoutElement,
        [FourColumnsLayoutElement.widget]: FourColumnsLayoutElement,
        [TabsContainerElement.widget]: TabsContainerElement,
        [TabContentElement.widget]: TabContentElement,
        [AccordionContainerElement.widget]: AccordionContainerElement,
        [AccordionContentElement.widget]: AccordionContentElement,
        [ModalElement.widget]: ModalElement,
        [RelatedUnitsContainerElement.widget]: RelatedUnitsContainerElement,
        [RelatedUnitsItemElement.widget]: RelatedUnitsItemElement,
        [RelatedUnitsAssociationElement.widget]: RelatedUnitsAssociationElement,
        [CalloutElement.widget]: CalloutElement,
        [GroupElement.widget]: GroupElement,
        [ImageTextElement.widget]: Config.isLocal() ? ImageTextLocalElement : ImageTextRemoteElement,
        [ImageElement.widget]: Config.isLocal() ? ImageLocalElement : ImageRemoteElement,
        [ChooseOptionElement.widget]: Config.isLocal() ? ChooseOptionLocalElement : ChooseOptionRemoteElement,
        [DragdropContainerElement.widget]: DragdropContainerElement,
        [DragdropItemElement.widget]: DragdropItemElement,
        [TrueFalseContainerElement.widget]: TrueFalseContainerElement,
        [TrueFalseItemElement.widget]: TrueFalseItemElement,
        [AudioTermContainerElement.widget]: AudioTermContainerElement,
        [AudioTermItemElement.widget]: Config.isLocal() ? AudioTermItemLocalElement : AudioTermItemRemoteElement,
        [ImageSoundContainerElement.widget]: ImageSoundContainerElement,
        [ImageSoundItemElement.widget]: Config.isLocal() ? ImageSoundItemLocalElement : ImageSoundItemRemoteElement,
        [CouplesContainerElement.widget]: CouplesContainerElement,
        [CouplesItemElement.widget]: Config.isLocal() ? CouplesItemLocalElement : CouplesItemRemoteElement,
        [SchemaContainerElement.widget]: SchemaContainerElement,
        [SchemaItemElement.widget]: Config.isLocal() ? SchemaItemLocalElement : SchemaItemRemoteElement,
        [PuzzleElement.widget]: Config.isLocal() ? PuzzleLocalElement : PuzzleRemoteElement,
        [CorrectWordContainerElement.widget]: CorrectWordContainerElement,
        [CorrectWordItemElement.widget]: Config.isLocal() ? CorrectWordItemLocalElement : CorrectWordItemRemoteElement,
        [MissingWordsContainerElement.widget]: MissingWordsContainerElement,
        [MissingWordsItemElement.widget]: MissingWordsItemElement,
        [SentenceOrderContainerElement.widget]: SentenceOrderContainerElement,
        [SentenceOrderItemElement.widget]: SentenceOrderItemElement,
        [GuessWordElement.widget]: GuessWordElement,
        [ButtonTextContainerElement.widget]: ButtonTextContainerElement,
        [ButtonTextItemElement.widget]: Config.isLocal() ? ButtonTextItemLocalElement : ButtonTextItemRemoteElement,
        [AnimationElement.widget]: Config.isLocal() ? AnimationLocalElement : AnimationRemoteElement,
        [AnimationContainerElement.widget]: AnimationContainerElement,
        [AnimationItemElement.widget]: AnimationItemElement,
        [TermClassificationElement.widget]: TermClassificationElement,
        [TermClassificationItemElement.widget]: TermClassificationItemElement,
        [TestContainerElement.widget]: TestContainerElement,
        [RouletteElement.widget]: RouletteElement,
        [RouletteItemElement.widget]: RouletteItemElement,
        [GapQuestionElement.widget]: GapQuestionElement,
        [SimpleQuestionElement.widget]: SimpleQuestionElement,
        [MultipleQuestionElement.widget]: MultipleQuestionElement,
        [TrueFalseQuestionElement.widget]: TrueFalseQuestionElement
    };

    private static _rules = {
        // Section element
        [SectionElement.widget]: {
            "allows": [WidgetElement],
            "rejects": [SpecificItemElement, AccordionContentElement, TabContentElement, RouletteItemElement, RelatedUnitsAssociationElement]
        },
        [TwoColumnsLayoutElement.widget]: {
            "allows": [ItemElement, ContainerSpecificElement, CalloutElement],
            "rejects": [SpecificItemElement, RelatedUnitsContainerElement]
        },
        [ThreeColumnsLayoutElement.widget]: {
            "allows": [ItemElement, ContainerSpecificElement, CalloutElement],
            "rejects": [SpecificItemElement, RelatedUnitsContainerElement]
        },
        [FourColumnsLayoutElement.widget]: {
            "allows": [ItemElement, ContainerSpecificElement, CalloutElement],
            "rejects": [SpecificItemElement, RelatedUnitsContainerElement]
        },
        [TabsContainerElement.widget]: { "allows": [TabContentElement] },
        [TabContentElement.widget]: {
            "allows": [ItemElement, ColumnsLayoutElement, ContainerSpecificElement],
            "rejects": [SpecificItemElement, RelatedUnitsContainerElement]
        },
        [AccordionContainerElement.widget]: { "allows": [AccordionContentElement] },
        [AccordionContentElement.widget]: {
            "allows": [ItemElement, ColumnsLayoutElement, ContainerSpecificElement],
            "rejects": [SpecificItemElement, RelatedUnitsContainerElement]
        },
        [ModalElement.widget]: {
            "allows": [ItemElement],
            "rejects": [SpecificItemElement, RelatedUnitsContainerElement]
        },
        [CalloutElement.widget]: {
            "allows": [ItemElement, ColumnsLayoutElement],
            "rejects": [SpecificItemElement, RelatedUnitsContainerElement]
        },
        [GroupElement.widget]: {
            "allows": [ItemElement, ColumnsLayoutElement, ContainerSpecificElement, CalloutElement],
            "rejects": [SpecificItemElement, RelatedUnitsContainerElement]
        },
        [DragdropContainerElement.widget]: { "allows": [DragdropItemElement] },
        [TrueFalseContainerElement.widget]: { "allows": [TrueFalseItemElement] },
        [AudioTermContainerElement.widget]: { "allows": [AudioTermItemElement] },
        [ImageSoundContainerElement.widget]: { "allows": [ImageSoundItemElement] },
        [CouplesContainerElement.widget]: { "allows": [CouplesItemElement] },
        [SchemaContainerElement.widget]: { "allows": [SchemaItemElement] },
        [CorrectWordContainerElement.widget]: { "allows": [CorrectWordItemElement] },
        [MissingWordsContainerElement.widget]: { "allows": [MissingWordsItemElement] },
        [SentenceOrderContainerElement.widget]: { "allows": [SentenceOrderItemElement] },
        [ButtonTextContainerElement.widget]: { "allows": [ButtonTextItemElement] },
        [AnimationContainerElement.widget]: { "allows": [AnimationItemElement] },
        [TermClassificationElement.widget]: { "allows": [TermClassificationItemElement] },
        [RelatedUnitsContainerElement.widget]: { "allows": [RelatedUnitsItemElement, RelatedUnitsAssociationElement] },
        [RelatedUnitsAssociationElement.widget]: { "allows": [RelatedUnitsItemElement] },
        [TestContainerElement.widget]: {
            "allows": [GapQuestionElement, SimpleQuestionElement, MultipleQuestionElement, TrueFalseQuestionElement,
                ChooseOptionElement, DragdropContainerElement, TrueFalseContainerElement, CouplesContainerElement,
                PuzzleElement, CorrectWordContainerElement, MissingWordsContainerElement, SentenceOrderContainerElement,
                TermClassificationElement]
        },
        [RouletteItemElement.widget]: {
            "allows":
                [GapQuestionElement, SimpleQuestionElement, MultipleQuestionElement, TrueFalseQuestionElement,
                    ChooseOptionElement, DragdropContainerElement, TrueFalseContainerElement, CouplesContainerElement,
                    PuzzleElement, CorrectWordContainerElement, MissingWordsContainerElement, SentenceOrderContainerElement,
                    TermClassificationElement]
        },
        [RouletteElement.widget]: { "allows": [RouletteItemElement] },
    }


    private static createContainer(): ContainerManager {
        const container = new ContainerManager({ autoBindInjectable: true });
        container.bind(App).toSelf().inSingletonScope();
        container.bindEditor();
        container.bindModelElements();
        container.bindServices();
        return container;
    }

    private bindEditor() {
        // Bind the Appropriate Editor
        this.bind(Editor).to(Config.isWidgetEditorEnabled() ? WidgetEditor : UnitEditor).inSingletonScope();
        // Editor AIPrompt
        this.bind(AiPrompt).toSelf().inSingletonScope();
        // Bind Toolbar and Footer actions
        this.bind(ButtonFileAction).toSelf().inTransientScope();
        this.bind(ButtonClickAction).toSelf().inTransientScope();
        // Editor Footer
        this.bind(Footer).toSelf().inSingletonScope();
        // Editor Netlify Modal
        this.bind(ModalNetlify).toSelf().inSingletonScope();
        // Editor Translate Modal
        this.bind(ModalTranslate).toSelf().inSingletonScope();
        // Editor Unit Settings modal
        this.bind(ModalUnitSettings).toSelf().inSingletonScope();
        // Editor Palette
        this.bind(Palette).toSelf().inSingletonScope();
        this.bind(Category).toSelf().inTransientScope();
        this.bind(CategoryItem).toSelf().inTransientScope();
        // Editor Toolbar
        this.bind(Toolbar).toSelf().inSingletonScope();
    }

    private bindModelElements() {
        // The Model will be unique for the whole editor
        this.bind(Model).toSelf().inSingletonScope();
        // Bind widget strings to classes
        Object.entries(this._mappings).forEach(([key, value]) => {
            this.bind(key).to(value as interfaces.Newable<Element>).inTransientScope();
        });
        // Factory to create and instantiate model elements
        this.bind<interfaces.Factory<Element>>("Factory<Element>").toFactory(context => {
            return async (widget: string, data?: any, options?: WidgetInitOptions) => {
                const ele = context.container.get(widget) as Element;
                await ele.init(data, options);
                return ele;
            };
        });
    }

    private bindServices() {
        // Modal window to add a model element
        this.bind(AddContentPromptService).toSelf().inSingletonScope();
        // Service to communicate with the AI microservice
        this.bind(AIService).toSelf().inSingletonScope();
        // Service to manage alert messages
        this.bind(AlertService).toSelf().inSingletonScope();
        // Service to load on demand Bootstrap dependencies
        this.bind(BootstrapService).toSelf().inSingletonScope();
        // Service to encrypt and decrypt data
        this.bind(CipherService).toSelf().inSingletonScope();
        // Service to initialize a color picker on a given element
        this.bind(ColorPickerService).toSelf().inSingletonScope();
        this.bind(ColorPickerElement).toSelf().inTransientScope();
        this
            .bind<interfaces.Factory<CoverPickerElement>>("Factory<ColorPickerElement>")
            .toFactory<ColorPickerElement, [string]>(
                (context: interfaces.Context) => {
                    return (selector: string) => {
                        const color = context.container.get(ColorPickerElement);
                        color.init(selector);
                        return color;
                    };
                });
        // Convenience service to manage the cover picker in the unit settings modal
        this.bind(CoverPickerService).toSelf().inSingletonScope();
        this.bind(CoverPickerElement).toSelf().inTransientScope();
        this
            .bind<interfaces.Factory<CoverPickerElement>>("Factory<CoverPickerElement>")
            .toFactory<CoverPickerElement, [HTMLInputElement, HTMLInputElement, HTMLImageElement]>(
                (context: interfaces.Context) => {
                    return (coverFileElem: HTMLInputElement, coverBlobElem: HTMLInputElement, previewElem: HTMLImageElement) => {
                        const cover = context.container.get(CoverPickerElement);
                        cover.init(coverFileElem, coverBlobElem, previewElem);
                        return cover;
                    };
                });
        // Service to download a given file
        this.bind(DownloaderService).toSelf().inSingletonScope();
        // Drag and drop from palette to container
        this.bind(DragDropService).toSelf().inSingletonScope();
        // FilePicker Service to pick files from INDIeMedia
        this.bind(FilePickerService).toSelf().inSingletonScope();
        // Service to manage fontawesome icons
        this.bind(FontAwesomeService).toSelf().inSingletonScope();
        // Internationalization Service
        this.bind(I18nService).toSelf().inSingletonScope();
        // Loading modal
        this.bind(LoadingService).toSelf().inSingletonScope();
        // Model migration
        this.bind(MigratorService).toSelf().inSingletonScope();
        // Actions with the whole model
        this.bind(ModelHandlerDownloadService).toSelf().inSingletonScope();
        this.bind(ModelHandlerPublishService).toSelf().inSingletonScope();
        this.bind(ModelHandlerScormService).toSelf().inSingletonScope();
        this.bind(ModelHandlerPreviewService).toSelf().inSingletonScope();
        this.bind(ModelHandlerSaveService).toSelf().inSingletonScope();
        // Service to display modal prompts
        this.bind(PromptService).toSelf().inSingletonScope();
        // Service to load unit themes
        this.bind(ThemeManagerService).toSelf().inSingletonScope();
        // Service to create and delete tooltips
        this.bind(TooltipService).toSelf().inSingletonScope();
        // Service to provide undo and redo functionality to the editor
        this.bind(UndoRedoService).toSelf().inSingletonScope();
        this.bind(AddElementAction).toSelf().inTransientScope();
        this.bind(AddSectionAction).toSelf().inTransientScope();
        this.bind(ReplaceModelAction).toSelf().inTransientScope();
        this.bind(EditElementAction).toSelf().inTransientScope();
        this.bind(MoveContainerAction).toSelf().inTransientScope();
        this.bind(MoveElementAction).toSelf().inTransientScope();
        this.bind(RemoveElementAction).toSelf().inTransientScope();
        this.bind(RemoveSectionAction).toSelf().inTransientScope();
        this.bind(SwapSectionsAction).toSelf().inTransientScope();
        this
            .bind<interfaces.Factory<Action>>("Factory<Action>")
            .toFactory<Action, [typeAction: new () => Action, model: Model, data: any]>
            ((context: interfaces.Context) => {
                return <T extends Action>(typeAction: new () => T, model: Model, data: any) => {
                    const act = context.container.get(typeAction) as T;
                    act.init(model, data);
                    return act;
                };
            });
        // Service with various utility functions
        this.bind(UtilsService).toSelf().inSingletonScope();
    }

    private filterWidget(widget: string) {
        if (Array.isArray(Config.getWidgetsBlacklist()))
            return !Config.getWidgetsBlacklist().includes(widget);
        if (Array.isArray(Config.getWidgetsWhitelist()))
            return Config.getWidgetsWhitelist().includes(widget);
        return true;
    }

    public get allWidgets(): typeof WidgetElement[] {
        let widgets = Object
            // Filter widgets by type
            .entries(this._mappings)
            .filter(entry => this.filterWidget(entry[0]))
            // Get the associated element
            .map(entry => entry[1])
            .filter(elem => WidgetElement.isPrototypeOf(elem))
            .map((elem: any) => elem as typeof WidgetElement);
        if (!Config.getBankOfWidgetsURL())
            widgets = widgets.filter(elem => elem != BankElement);
        return widgets;
    }

    getElement(widget: string = SectionElement.widget): typeof Element {
        return this._mappings[widget] as any;
    }

    canHave(parent: typeof Element, child: typeof Element) {
        const parentRules = ContainerManager._rules[parent.widget];
        if (parentRules.rejects && parentRules.rejects.some((elem: any) => elem.isPrototypeOf(child) || elem === child))
            return false;
        if (parentRules.allows && parentRules.allows.some((elem: any) => elem.isPrototypeOf(child) || elem === child))
            return true;
        return false;
    }

    allowed(widget: string): any[] {
        return ContainerManager._rules[widget] ? ContainerManager._rules[widget]?.allows : [];
    }

    refused(widget: string): any[] {
        return ContainerManager._rules[widget] ? ContainerManager._rules[widget]?.rejects : [];
    }

    addRule(widget: string, { allows, rejects }: { allows?: any[], rejects?: any[] }) {
        if (allows) ContainerManager._rules[widget].allows = allows;
        if (rejects) ContainerManager._rules[widget].rejects = rejects;
    }

    getAllWidgetsAllowedIn(widget: string): typeof WidgetElement[] {
        return Object
            // Filter widgets by type
            .entries(this._mappings)
            .filter(entry => this.filterWidget(entry[0]))
            // Get the associated element
            .map(entry => entry[1])
            .filter((elem: any) => WidgetElement.isPrototypeOf(elem))
            .map((elem: any) => elem as typeof WidgetElement)
            .filter(elem =>
                !this.refused(widget) || !this.refused(widget).some(className => className.isPrototypeOf(elem) || className === elem))
            .filter((elem, idx, array) => {
                // Accordion and Tabs allows any widget allowed in their children
                const isSpecificContainer = SpecificContainerElement.isPrototypeOf(this._mappings[widget]);
                let allowed = this.allowed(widget);
                if (isSpecificContainer && allowed)
                    allowed = allowed.concat(allowed.flatMap(child => this.allowed(child.widget)));
                return allowed && allowed.some(className => className.isPrototypeOf(elem) || className === elem)
            })
    }
}