import Section from "./section/Section";
import WidgetAcordionContainer from "./widgets/WidgetAcordionContainer/WidgetAcordionContainer";
import WidgetAcordionContent from "./widgets/WidgetAcordionContent/WidgetAcordionContent";
import WidgetAnimation from "./widgets/WidgetAnimation/WidgetAnimation";
import WidgetAnimationContainer from "./widgets/WidgetAnimationContainer/WidgetAnimationContainer";
import WidgetAnimationItem from "./widgets/WidgetAnimationItem/WidgetAnimationItem";
import WidgetAudioTermContainer from "./widgets/WidgetAudioTermContainer/WidgetAudioTermContainer";
import WidgetAudioTermItem from "./widgets/WidgetAudioTermItem/WidgetAudioTermItem";
import WidgetBlockquote from "./widgets/WidgetBlockquote/WidgetBlockquote";
import WidgetButtonTextContainer from "./widgets/WidgetButtonTextContainer/WidgetButtonTextContainer";
import WidgetButtonTextItem from "./widgets/WidgetButtonTextItem/WidgetButtonTextItem";
import WidgetChooseOption from "./widgets/WidgetChooseOption/WidgetChooseOption";
import WidgetTwoColumnsLayout from "./widgets/WidgetTwoColumnsLayout/WidgetTwoColumnsLayout";
import WidgetThreeColumnsLayout from "./widgets/WidgetThreeColumnsLayout/WidgetThreeColumnsLayout";
import WidgetFourColumnsLayout from "./widgets/WidgetFourColumnsLayout/WidgetFourColumnsLayout";
import WidgetCorrectWordContainer from "./widgets/WidgetCorrectWordContainer/WidgetCorrectWordContainer";
import WidgetCorrectWordItem from "./widgets/WidgetCorrectWordItem/WidgetCorrectWordItem";
import WidgetCouplesContainer from "./widgets/WidgetCouplesContainer/WidgetCouplesContainer";
import WidgetCouplesItem from "./widgets/WidgetCouplesItem/WidgetCouplesItem";
import WidgetDragdropContainer from "./widgets/WidgetDragdropContainer/WidgetDragdropContainer";
import WidgetDragdropItem from "./widgets/WidgetDragdropItem/WidgetDragdropItem";
import WidgetGapQuestion from "./widgets/WidgetGapQuestion/WidgetGapQuestion";
import WidgetGuessWord from "./widgets/WidgetGuessWord/WidgetGuessWord";
import WidgetImage from "./widgets/WidgetImage/WidgetImage";
import WidgetImageAndSoundContainer from "./widgets/WidgetImageAndSoundContainer/WidgetImageAndSoundContainer";
import WidgetImageAndSoundItem from "./widgets/WidgetImageAndSoundItem/WidgetImageAndSoundItem";
import WidgetImageAndText from "./widgets/WidgetImageAndText/WidgetImageAndText";
import WidgetInteractiveVideo from "./widgets/WidgetInteractiveVideo/WidgetInteractiveVideo";
import WidgetLatexFormula from "./widgets/WidgetLatexFormula/WidgetLatexFormula";
import WidgetMissingwordsContainer from "./widgets/WidgetMissingwordsContainer/WidgetMissingwordsContainer";
import WidgetMissingwordsItem from "./widgets/WidgetMissingwordsItem/WidgetMissingwordsItem";
import WidgetModal from "./widgets/WidgetModal/WidgetModal";
import WidgetMultipleQuestion from "./widgets/WidgetMultipleQuestion/WidgetMultipleQuestion";
import WidgetPuzzle from "./widgets/WidgetPuzzle/WidgetPuzzle";
import WidgetSchemaContainer from "./widgets/WidgetSchemaContainer/WidgetSchemaContainer";
import WidgetSchemaItem from "./widgets/WidgetSchemaItem/WidgetSchemaItem";
import WidgetSentenceorderContainer from "./widgets/WidgetSentenceorderContainer/WidgetSentenceorderContainer";
import WidgetSentenceorderItem from "./widgets/WidgetSentenceorderItem/WidgetSentenceorderItem";
import WidgetSimpleImage from "./widgets/WidgetSimpleImage/WidgetSimpleImage";
import WidgetSimpleQuestion from "./widgets/WidgetSimpleQuestion/WidgetSimpleQuestion";
import WidgetTabContent from "./widgets/WidgetTabContent/WidgetTabContent";
import WidgetTable from "./widgets/WidgetTable/WidgetTable";
import WidgetTabsContainer from "./widgets/WidgetTabsContainer/WidgetTabsContainer";
import WidgetTermClassifcation from "./widgets/WidgetTermClassifcation/WidgetTermClassifcation";
import WidgetTermClassificationItem from "./widgets/WidgetTermClassificationItem/WidgetTermClassificationItem";
import WidgetTestContainer from "./widgets/WidgetTestContainer/WidgetTestContainer";
import WidgetTextBlock from "./widgets/WidgetTextBlock/WidgetTextBlock";
import WidgetTrueFalseContainer from "./widgets/WidgetTrueFalseContainer/WidgetTrueFalseContainer";
import WidgetTrueFalseItem from "./widgets/WidgetTrueFalseItem/WidgetTrueFalseItem";
import WidgetTrueFalseQuestion from "./widgets/WidgetTrueFalseQuestion/WidgetTrueFalseQuestion";
import WidgetVideo from "./widgets/WidgetVideo/WidgetVideo";
import WidgetElement from "./widgets/WidgetElement/WidgetElement";
import Utils from "../Utils";
import ModelElement from "./ModelElement";
import WidgetItemElement from "./widgets/WidgetItemElement/WidgetItemElement";
import WidgetColumnsLayout from "./widgets/WidgetColumnsLayout/WidgetColumnsLayout";
import WidgetContainerSpecificElement from "./widgets/WidgetContainerSpecificElement/WidgetContainerSpecificElement";
import WidgetSpecificItemElement from "./widgets/WidgetSpecificItemElement/WidgetSpecificItemElement";
import Config from "../Config";
import WidgetLocalAnimation from "./widgets/WidgetAnimation/WidgetLocalAnimation";
import WidgetRemoteAnimation from "./widgets/WidgetAnimation/WidgetRemoteAnimation";
import WidgetLocalAudioTermItem from "./widgets/WidgetAudioTermItem/WidgetLocalAudioTermItem";
import WidgetRemoteAudioTermItem from "./widgets/WidgetAudioTermItem/WidgetRemoteAudioTermItem";
import WidgetLocalButtonTextItem from "./widgets/WidgetButtonTextItem/WidgetLocalButtonTextItem";
import WidgetRemoteButtonTextItem from "./widgets/WidgetButtonTextItem/WidgetRemoteButtonTextItem";
import WidgetLocalChooseOption from "./widgets/WidgetChooseOption/WidgetLocalChooseOption";
import WidgetRemoteChooseOption from "./widgets/WidgetChooseOption/WidgetRemoteChooseOption";
import WidgetLocalCorrectWordItem from "./widgets/WidgetCorrectWordItem/WidgetLocalCorrectWordItem";
import WidgetRemoteCorrectWordItem from "./widgets/WidgetCorrectWordItem/WidgetRemoteCorrectWordItem";
import WidgetLocalCouplesItem from "./widgets/WidgetCouplesItem/WidgetLocalCouplesItem";
import WidgetRemoteCouplesItem from "./widgets/WidgetCouplesItem/WidgetRemoteCouplesItem";
import WidgetLocalImage from "./widgets/WidgetImage/WidgetLocalImage";
import WidgetRemoteImage from "./widgets/WidgetImage/WidgetRemoteImage";
import WidgetLocalImageAndSoundItem from "./widgets/WidgetImageAndSoundItem/WidgetLocalImageAndSoundItem";
import WidgetRemoteImageAndSoundItem from "./widgets/WidgetImageAndSoundItem/WidgetRemoteImageAndSoundItem";
import WidgetLocalImageAndText from "./widgets/WidgetImageAndText/WidgetLocalImageAndText";
import WidgetRemoteImageAndText from "./widgets/WidgetImageAndText/WidgetRemoteImageAndText";
import WidgetLocalPuzzle from "./widgets/WidgetPuzzle/WidgetLocalPuzzle";
import WidgetRemotePuzzle from "./widgets/WidgetPuzzle/WidgetRemotePuzzle";
import WidgetLocalSchemaItem from "./widgets/WidgetSchemaItem/WidgetLocalSchemaItem";
import WidgetRemoteSchemaItem from "./widgets/WidgetSchemaItem/WidgetRemoteSchemaItem";
import WidgetLocalSimpleImage from "./widgets/WidgetSimpleImage/WidgetLocalSimpleImage";
import WidgetRemoteSimpleImage from "./widgets/WidgetSimpleImage/WidgetRemoteSimpleImage";
import WidgetLocalVideo from "./widgets/WidgetVideo/WidgetLocalVideo";
import WidgetRemoteVideo from "./widgets/WidgetVideo/WidgetRemoteVideo";
import WidgetRelatedUnitsContainer from "./widgets/WidgetRelatedUnitsContainer/WidgetRelatedUnitsContainer";
import WidgetRelatedUnitsItem from "./widgets/WidgetRelatedUnitsItem/WidgetRelatedUnitsItem";
import WidgetRelatedUnitsAssociation from "./widgets/WidgetRelatedUnitsAssociation/WidgetRelatedUnitsAssociation";
import WidgetCallout from "./widgets/WidgetCallout/WidgetCallout";
import WidgetBank from "./widgets/WidgetBank/WidgetBank";
import WidgetSpecificContainerElement from "./widgets/WidgetSpecificContainerElement/WidgetSpecificContainerElement";

export default class ModelManager {

    private static elements = {
        // Section element
        [Section.widget]: Section,
        //Bank of Widgets
        [WidgetBank.widget]: WidgetBank,
        // Elements
        [WidgetTextBlock.widget]: WidgetTextBlock,
        [WidgetBlockquote.widget]: WidgetBlockquote,
        [WidgetLatexFormula.widget]: WidgetLatexFormula,
        [WidgetVideo.widget]: () => Config.isLocal() ? WidgetLocalVideo : WidgetRemoteVideo,
        [WidgetSimpleImage.widget]: () => Config.isLocal() ? WidgetLocalSimpleImage : WidgetRemoteSimpleImage,
        [WidgetTable.widget]: WidgetTable,
        // Layouts
        [WidgetTwoColumnsLayout.widget]: WidgetTwoColumnsLayout,
        [WidgetThreeColumnsLayout.widget]: WidgetThreeColumnsLayout,
        [WidgetFourColumnsLayout.widget]: WidgetFourColumnsLayout,
        // Containers
        [WidgetTabsContainer.widget]: WidgetTabsContainer,
        [WidgetTabContent.widget]: WidgetTabContent,
        [WidgetAcordionContainer.widget]: WidgetAcordionContainer,
        [WidgetAcordionContent.widget]: WidgetAcordionContent,
        [WidgetModal.widget]: WidgetModal,
        [WidgetRelatedUnitsAssociation.widget]: WidgetRelatedUnitsAssociation,
        [WidgetRelatedUnitsContainer.widget]: WidgetRelatedUnitsContainer,
        [WidgetRelatedUnitsItem.widget]: WidgetRelatedUnitsItem,
        [WidgetCallout.widget]: WidgetCallout,
        // Interactive elements
        [WidgetImageAndText.widget]: () => Config.isLocal() ? WidgetLocalImageAndText : WidgetRemoteImageAndText,
        [WidgetImage.widget]: () => Config.isLocal() ? WidgetLocalImage : WidgetRemoteImage,
        [WidgetChooseOption.widget]: () => Config.isLocal() ? WidgetLocalChooseOption : WidgetRemoteChooseOption,
        [WidgetDragdropContainer.widget]: WidgetDragdropContainer,
        [WidgetDragdropItem.widget]: WidgetDragdropItem,
        [WidgetTrueFalseContainer.widget]: WidgetTrueFalseContainer,
        [WidgetTrueFalseItem.widget]: WidgetTrueFalseItem,
        [WidgetAudioTermContainer.widget]: WidgetAudioTermContainer,
        [WidgetAudioTermItem.widget]: () => Config.isLocal() ? WidgetLocalAudioTermItem : WidgetRemoteAudioTermItem,
        [WidgetImageAndSoundContainer.widget]: WidgetImageAndSoundContainer,
        [WidgetImageAndSoundItem.widget]: () => Config.isLocal() ? WidgetLocalImageAndSoundItem : WidgetRemoteImageAndSoundItem,
        [WidgetCouplesContainer.widget]: WidgetCouplesContainer,
        [WidgetCouplesItem.widget]: () => Config.isLocal() ? WidgetLocalCouplesItem : WidgetRemoteCouplesItem,
        [WidgetSchemaContainer.widget]: WidgetSchemaContainer,
        [WidgetSchemaItem.widget]: () => Config.isLocal() ? WidgetLocalSchemaItem : WidgetRemoteSchemaItem,
        [WidgetInteractiveVideo.widget]: WidgetInteractiveVideo,
        [WidgetPuzzle.widget]: () => Config.isLocal() ? WidgetLocalPuzzle : WidgetRemotePuzzle,
        [WidgetCorrectWordContainer.widget]: WidgetCorrectWordContainer,
        [WidgetCorrectWordItem.widget]: () => Config.isLocal() ? WidgetLocalCorrectWordItem : WidgetRemoteCorrectWordItem,
        [WidgetMissingwordsContainer.widget]: WidgetMissingwordsContainer,
        [WidgetMissingwordsItem.widget]: WidgetMissingwordsItem,
        [WidgetSentenceorderContainer.widget]: WidgetSentenceorderContainer,
        [WidgetSentenceorderItem.widget]: WidgetSentenceorderItem,
        [WidgetGuessWord.widget]: WidgetGuessWord,
        [WidgetButtonTextContainer.widget]: WidgetButtonTextContainer,
        [WidgetButtonTextItem.widget]: () => Config.isLocal() ? WidgetLocalButtonTextItem : WidgetRemoteButtonTextItem,
        [WidgetAnimation.widget]: () => Config.isLocal() ? WidgetLocalAnimation : WidgetRemoteAnimation,
        [WidgetAnimationContainer.widget]: WidgetAnimationContainer,
        [WidgetAnimationItem.widget]: WidgetAnimationItem,
        [WidgetTermClassifcation.widget]: WidgetTermClassifcation,
        [WidgetTermClassificationItem.widget]: WidgetTermClassificationItem,
        // Tests
        [WidgetTestContainer.widget]: WidgetTestContainer,
        [WidgetGapQuestion.widget]: WidgetGapQuestion,
        [WidgetSimpleQuestion.widget]: WidgetSimpleQuestion,
        [WidgetMultipleQuestion.widget]: WidgetMultipleQuestion,
        [WidgetTrueFalseQuestion.widget]: WidgetTrueFalseQuestion
    };

    private static rules = {
        // Section element
        [Section.widget]: { "allows": [WidgetElement], "refuses": [WidgetSpecificItemElement, WidgetAcordionContent, WidgetTabContent] },
        [WidgetTwoColumnsLayout.widget]: {
            "allows": [WidgetItemElement, WidgetContainerSpecificElement, WidgetCallout],
            "refuses": [WidgetSpecificItemElement]
        },
        [WidgetThreeColumnsLayout.widget]: {
            "allows": [WidgetItemElement, WidgetContainerSpecificElement, WidgetCallout],
            "refuses": [WidgetSpecificItemElement]
        },
        [WidgetFourColumnsLayout.widget]: {
            "allows": [WidgetItemElement, WidgetContainerSpecificElement, WidgetCallout],
            "refuses": [WidgetSpecificItemElement]
        },
        [WidgetTabsContainer.widget]: { "allows": [WidgetTabContent] },
        [WidgetTabContent.widget]: {
            "allows": [WidgetItemElement, WidgetColumnsLayout, WidgetContainerSpecificElement],
            "refuses": [WidgetSpecificItemElement]
        },
        [WidgetAcordionContainer.widget]: { "allows": [WidgetAcordionContent] },
        [WidgetAcordionContent.widget]: {
            "allows": [WidgetItemElement, WidgetColumnsLayout, WidgetContainerSpecificElement],
            "refuses": [WidgetSpecificItemElement]
        },
        [WidgetModal.widget]: {
            "allows": [WidgetItemElement],
            "refuses": [WidgetSpecificItemElement]
        },
        [WidgetCallout.widget]: {
            "allows": [WidgetItemElement, WidgetColumnsLayout],
            "refuses": [WidgetSpecificItemElement]
        },
        [WidgetDragdropContainer.widget]: { "allows": [WidgetDragdropItem] },
        [WidgetTrueFalseContainer.widget]: { "allows": [WidgetTrueFalseItem] },
        [WidgetAudioTermContainer.widget]: { "allows": [WidgetAudioTermItem] },
        [WidgetImageAndSoundContainer.widget]: { "allows": [WidgetImageAndSoundItem] },
        [WidgetCouplesContainer.widget]: { "allows": [WidgetCouplesItem] },
        [WidgetSchemaContainer.widget]: { "allows": [WidgetSchemaItem] },
        [WidgetCorrectWordContainer.widget]: { "allows": [WidgetCorrectWordItem] },
        [WidgetMissingwordsContainer.widget]: { "allows": [WidgetMissingwordsItem] },
        [WidgetSentenceorderContainer.widget]: { "allows": [WidgetSentenceorderItem] },
        [WidgetButtonTextContainer.widget]: { "allows": [WidgetButtonTextItem] },
        [WidgetAnimationContainer.widget]: { "allows": [WidgetAnimationItem] },
        [WidgetTermClassifcation.widget]: { "allows": [WidgetTermClassificationItem] },
        [WidgetRelatedUnitsContainer.widget]: { "allows": [WidgetRelatedUnitsItem, WidgetRelatedUnitsAssociation] },
        [WidgetRelatedUnitsAssociation.widget]: { "allows": [WidgetRelatedUnitsItem] },
        [WidgetTestContainer.widget]: { "allows": [WidgetGapQuestion, WidgetSimpleQuestion, WidgetMultipleQuestion, WidgetTrueFalseQuestion] },
    }

    static canHave(parent: typeof ModelElement, child: typeof ModelElement) {

        const parentRules = this.rules[parent.widget];
        if (parentRules.refuses && parentRules.refuses.some((elem: any) => elem.isPrototypeOf(child) || elem === child))
            return false;
        if (parentRules.allows && parentRules.allows.some((elem: any) => elem.isPrototypeOf(child) || elem === child))
            return true;
        return false;
    }

    static allowed(widget: string): any[] {
        return this.rules[widget] ? this.rules[widget]?.allows : [];
    }

    static refused(widget: string): any[] {
        return this.rules[widget] ? this.rules[widget]?.refuses : [];
    }

    static addRule(widget: string, { allows, refuses }: { allows?: any[], refuses?: any[] }) {
        if (allows) this.rules[widget].allows = allows;
        if (refuses) this.rules[widget].refuses = refuses;
    }

    static getAllWidgets(): typeof WidgetElement[] {
        let widgets = Object
            .values(this.elements)
            .map(elem => ModelElement.isPrototypeOf(elem) ? elem : (elem as Function)())
            .filter(elem => WidgetElement.isPrototypeOf(elem))
            .map(elem => elem as typeof WidgetElement);
        if (!Config.getBankOfWidgetsURL())
            widgets = widgets.filter(elem => elem != WidgetBank);
        return widgets;
    }

    static getAllWidgetsAllowedIn(widget: string): typeof WidgetElement[] {
        return Object
            .values(this.elements)
            .map(elem => ModelElement.isPrototypeOf(elem) ? elem : (elem as Function)())
            .filter(elem => WidgetElement.isPrototypeOf(elem))
            .filter(elem =>
                !this.refused(widget) || !this.refused(widget).some(className => className.isPrototypeOf(elem)))
            .filter(elem => {
                // Accordion and Tabs allows any widget allowed in their children
                const isSpecificContainer = WidgetSpecificContainerElement.isPrototypeOf(this.get(widget));
                let allowed = this.allowed(widget);
                if (isSpecificContainer && allowed)
                    allowed = allowed.concat(allowed.flatMap(child => this.allowed(child.widget)));
                return allowed && allowed.some(className => className.isPrototypeOf(elem))
            })
    }

    static getAllWidgetsByCategory() {
        return Utils.groupBy({ collection: this.getAllWidgets().filter(widget => widget.category), key: "category" });
    }

    static getAllWidgetsAllowedByCategory(widget: string) {
        return Utils.groupBy({ collection: this.getAllWidgetsAllowedIn(widget).filter(widget => widget.category), key: "category" });
    }

    static get(widget = "Section"): typeof ModelElement {
        const value: any = this.elements[widget];
        if (ModelElement.isPrototypeOf(value))
            return value;
        return (value as Function)();
    }

    static getWidgetElement(widget: string): typeof WidgetElement {
        const element = this.get(widget);
        if (WidgetElement.isPrototypeOf(element))
            return element as typeof WidgetElement;
        return null;
    }


    static async create(widget = "Section", values?: any): Promise<ModelElement> {
        return this.get(widget).create(values);
    }
}