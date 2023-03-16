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

export default class ModelManager {

    private static elements = {
        // Section element
        [Section.widget]: Section,
        // Elements
        [WidgetTextBlock.widget]: WidgetTextBlock,
        [WidgetBlockquote.widget]: WidgetBlockquote,
        [WidgetLatexFormula.widget]: WidgetLatexFormula,
        [WidgetVideo.widget]: WidgetVideo,
        [WidgetSimpleImage.widget]: WidgetSimpleImage,
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
        // Interactive elements
        [WidgetImageAndText.widget]: WidgetImageAndText,
        [WidgetImage.widget]: WidgetImage,
        [WidgetChooseOption.widget]: WidgetChooseOption,
        [WidgetDragdropContainer.widget]: WidgetDragdropContainer,
        [WidgetDragdropItem.widget]: WidgetDragdropItem,
        [WidgetTrueFalseContainer.widget]: WidgetTrueFalseContainer,
        [WidgetTrueFalseItem.widget]: WidgetTrueFalseItem,
        [WidgetAudioTermContainer.widget]: WidgetAudioTermContainer,
        [WidgetAudioTermItem.widget]: WidgetAudioTermItem,
        [WidgetImageAndSoundContainer.widget]: WidgetImageAndSoundContainer,
        [WidgetImageAndSoundItem.widget]: WidgetImageAndSoundItem,
        [WidgetCouplesContainer.widget]: WidgetCouplesContainer,
        [WidgetCouplesItem.widget]: WidgetCouplesItem,
        [WidgetSchemaContainer.widget]: WidgetSchemaContainer,
        [WidgetSchemaItem.widget]: WidgetSchemaItem,
        [WidgetInteractiveVideo.widget]: WidgetInteractiveVideo,
        [WidgetPuzzle.widget]: WidgetPuzzle,
        [WidgetCorrectWordContainer.widget]: WidgetCorrectWordContainer,
        [WidgetCorrectWordItem.widget]: WidgetCorrectWordItem,
        [WidgetMissingwordsContainer.widget]: WidgetMissingwordsContainer,
        [WidgetMissingwordsItem.widget]: WidgetMissingwordsItem,
        [WidgetSentenceorderContainer.widget]: WidgetSentenceorderContainer,
        [WidgetSentenceorderItem.widget]: WidgetSentenceorderItem,
        [WidgetGuessWord.widget]: WidgetGuessWord,
        [WidgetButtonTextContainer.widget]: WidgetButtonTextContainer,
        [WidgetButtonTextItem.widget]: WidgetButtonTextItem,
        [WidgetAnimation.widget]: WidgetAnimation,
        [WidgetAnimationContainer.widget]: WidgetAnimationContainer,
        [WidgetAnimationItem.widget]: WidgetAnimationItem,
        [WidgetTermClassifcation.widget]: WidgetTermClassifcation,
        [WidgetTermClassificationItem.widget]: WidgetTermClassificationItem,
        // Tests
        [WidgetTestContainer.widget]: WidgetTestContainer,
        [WidgetGapQuestion.widget]: WidgetGapQuestion,
        [WidgetSimpleQuestion.widget]: WidgetSimpleQuestion,
        [WidgetTrueFalseQuestion.widget]: WidgetTrueFalseQuestion
    };

    private static rules = {
        // Section element
        [Section.widget]: { "allows": [WidgetElement], "refuses": [WidgetSpecificItemElement, WidgetAcordionContent, WidgetTabContent] },
        [WidgetTwoColumnsLayout.widget]: { "allows": [WidgetItemElement, WidgetContainerSpecificElement] },
        [WidgetThreeColumnsLayout.widget]: { "allows": [WidgetItemElement, WidgetContainerSpecificElement] },
        [WidgetFourColumnsLayout.widget]: { "allows": [WidgetItemElement, WidgetContainerSpecificElement] },
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
        [WidgetTestContainer.widget]: { "allows": [WidgetGapQuestion, WidgetSimpleQuestion, WidgetTrueFalseQuestion] },
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
        return this.rules[widget].allows;
    }

    static getAllWidgets(): typeof WidgetElement[] {
        return Object.values(this.elements).filter(elem => WidgetElement.isPrototypeOf(elem)).map(elem => elem as typeof WidgetElement);
    }

    static getAllWidgetsByCategory() {
        return Utils.groupBy({ collection: this.getAllWidgets().filter(widget => widget.category), key: "category" });
    }

    static get(widget = "Section"): { new(): ModelElement } {
        return this.elements[widget];
    }

    static create(widget = "Section", values?: any): ModelElement {
        return new this.elements[widget](values);
    }
}