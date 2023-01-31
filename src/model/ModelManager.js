import Section from "./section/Section.js";
import WidgetAcordionContainer from "./widgets/WidgetAcordionContainer/WidgetAcordionContainer.js";
import WidgetAcordionContent from "./widgets/WidgetAcordionContent/WidgetAcordionContent.js";
import WidgetAnimation from "./widgets/WidgetAnimation/WidgetAnimation.js";
import WidgetAnimationContainer from "./widgets/WidgetAnimationContainer/WidgetAnimationContainer.js";
import WidgetAnimationItem from "./widgets/WidgetAnimationItem/WidgetAnimationItem.js";
import WidgetAudioTermContainer from "./widgets/WidgetAudioTermContainer/WidgetAudioTermContainer.js";
import WidgetAudioTermItem from "./widgets/WidgetAudioTermItem/WidgetAudioTermItem.js";
import WidgetBlockquote from "./widgets/WidgetBlockquote/WidgetBlockquote.js";
import WidgetButtonTextContainer from "./widgets/WidgetButtonTextContainer/WidgetButtonTextContainer.js";
import WidgetButtonTextItem from "./widgets/WidgetButtonTextItem/WidgetButtonTextItem.js";
import WidgetChooseOption from "./widgets/WidgetChooseOption/WidgetChooseOption.js";
import WidgetTwoColumnsLayout from "./widgets/WidgetTwoColumnsLayout/WidgetTwoColumnsLayout.js";
import WidgetThreeColumnsLayout from "./widgets/WidgetThreeColumnsLayout/WidgetThreeColumnsLayout.js";
import WidgetFourColumnsLayout from "./widgets/WidgetFourColumnsLayout/WidgetFourColumnsLayout.js";
import WidgetCorrectWordContainer from "./widgets/WidgetCorrectWordContainer/WidgetCorrectWordContainer.js";
import WidgetCorrectWordItem from "./widgets/WidgetCorrectWordItem/WidgetCorrectWordItem.js";
import WidgetCouplesContainer from "./widgets/WidgetCouplesContainer/WidgetCouplesContainer.js";
import WidgetCouplesItem from "./widgets/WidgetCouplesItem/WidgetCouplesItem.js";
import WidgetDragdropContainer from "./widgets/WidgetDragdropContainer/WidgetDragdropContainer.js";
import WidgetDragdropItem from "./widgets/WidgetDragdropItem/WidgetDragdropItem.js";
import WidgetGapQuestion from "./widgets/WidgetGapQuestion/WidgetGapQuestion.js";
import WidgetGuessWord from "./widgets/WidgetGuessWord/WidgetGuessWord.js";
import WidgetImage from "./widgets/WidgetImage/WidgetImage.js";
import WidgetImageAndSoundContainer from "./widgets/WidgetImageAndSoundContainer/WidgetImageAndSoundContainer.js";
import WidgetImageAndSoundItem from "./widgets/WidgetImageAndSoundItem/WidgetImageAndSoundItem.js";
import WidgetImageAndText from "./widgets/WidgetImageAndText/WidgetImageAndText.js";
import WidgetInteractiveVideo from "./widgets/WidgetInteractiveVideo/WidgetInteractiveVideo.js";
import WidgetLatexFormula from "./widgets/WidgetLatexFormula/WidgetLatexFormula.js";
import WidgetMissingwordsContainer from "./widgets/WidgetMissingwordsContainer/WidgetMissingwordsContainer.js";
import WidgetMissingwordsItem from "./widgets/WidgetMissingwordsItem/WidgetMissingwordsItem.js";
import WidgetModal from "./widgets/WidgetModal/WidgetModal.js";
import WidgetPuzzle from "./widgets/WidgetPuzzle/WidgetPuzzle.js";
import WidgetSchemaContainer from "./widgets/WidgetSchemaContainer/WidgetSchemaContainer.js";
import WidgetSchemaItem from "./widgets/WidgetSchemaItem/WidgetSchemaItem.js";
import WidgetSentenceorderContainer from "./widgets/WidgetSentenceorderContainer/WidgetSentenceorderContainer.js";
import WidgetSentenceorderItem from "./widgets/WidgetSentenceorderItem/WidgetSentenceorderItem.js";
import WidgetSimpleImage from "./widgets/WidgetSimpleImage/WidgetSimpleImage.js";
import WidgetSimpleQuestion from "./widgets/WidgetSimpleQuestion/WidgetSimpleQuestion.js";
import WidgetTabContent from "./widgets/WidgetTabContent/WidgetTabContent.js";
import WidgetTable from "./widgets/WidgetTable/WidgetTable.js";
import WidgetTabsContainer from "./widgets/WidgetTabsContainer/WidgetTabsContainer.js";
import WidgetTermClassifcation from "./widgets/WidgetTermClassifcation/WidgetTermClassifcation.js";
import WidgetTermClassificationItem from "./widgets/WidgetTermClassificationItem/WidgetTermClassificationItem.js";
import WidgetTestContainer from "./widgets/WidgetTestContainer/WidgetTestContainer.js";
import WidgetTextBlock from "./widgets/WidgetTextBlock/WidgetTextBlock.js";
import WidgetTrueFalseContainer from "./widgets/WidgetTrueFalseContainer/WidgetTrueFalseContainer.js";
import WidgetTrueFalseItem from "./widgets/WidgetTrueFalseItem/WidgetTrueFalseItem.js";
import WidgetTrueFalseQuestion from "./widgets/WidgetTrueFalseQuestion/WidgetTrueFalseQuestion.js";
import WidgetVideo from "./widgets/WidgetVideo/WidgetVideo.js";

export default class ModelManager {

    static #elements = {};

    static #containerTypes = ['specific-container', 'simple-container', 
        'specific-element-container', 'element-container','layout',
        'section-container' ];

    static {
        const elements = [ Section, WidgetAcordionContainer, WidgetAcordionContent, WidgetAnimation,
          WidgetAnimationContainer, WidgetAnimationItem, WidgetAudioTermContainer,
          WidgetAudioTermItem, WidgetBlockquote, WidgetButtonTextContainer,
          WidgetButtonTextItem, WidgetChooseOption, WidgetTwoColumnsLayout,
          WidgetThreeColumnsLayout, WidgetFourColumnsLayout,  WidgetCorrectWordContainer, 
          WidgetCorrectWordItem, WidgetCouplesContainer, WidgetCouplesItem, 
          WidgetDragdropContainer, WidgetDragdropItem, WidgetGapQuestion, 
          WidgetGuessWord, WidgetImage, WidgetImageAndSoundContainer, 
          WidgetImageAndSoundItem, WidgetImageAndText, WidgetInteractiveVideo, 
          WidgetLatexFormula, WidgetMissingwordsContainer, WidgetMissingwordsItem, 
          WidgetModal, WidgetPuzzle, WidgetSchemaContainer, WidgetSchemaItem, 
          WidgetSentenceorderContainer, WidgetSentenceorderItem, WidgetSimpleImage, 
          WidgetSimpleQuestion, WidgetTabContent, WidgetTable, WidgetTabsContainer, 
          WidgetTermClassifcation, WidgetTermClassificationItem, WidgetTestContainer, 
          WidgetTextBlock, WidgetTrueFalseContainer, WidgetTrueFalseItem, 
          WidgetTrueFalseQuestion, WidgetVideo]
          
        this.#elements = Object.fromEntries(elements.map(elem => [elem.widget, elem]));
    }

    static get(widget = "Section") {
        return this.#elements[widget];
    }

    static create(widget = "Section", values) {
        return new this.#elements[widget](values);
    }

    static hasChildren(elem) {
        return ModelManager.#containerTypes.includes(elem.type);
    }
}