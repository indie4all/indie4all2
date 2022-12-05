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
import WidgetColumnLayout from "./widgets/WidgetColumnLayout/WidgetColumnLayout.js";
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

    static #widgets = {};
    static #section = null;

    static {
        let widgets = [ new WidgetAcordionContainer(), new WidgetAcordionContent(), new WidgetAnimation(),
          new WidgetAnimationContainer(), new WidgetAnimationItem(), new WidgetAudioTermContainer(),
          new WidgetAudioTermItem(), new WidgetBlockquote(), new WidgetButtonTextContainer(),
          new WidgetButtonTextItem(), new WidgetChooseOption(), new WidgetColumnLayout(),
          new WidgetCorrectWordContainer(), new WidgetCorrectWordItem(), new WidgetCouplesContainer(),
          new WidgetCouplesItem(), new WidgetDragdropContainer(), new WidgetDragdropItem(),
          new WidgetGapQuestion(), new WidgetGuessWord(), new WidgetImage(),
          new WidgetImageAndSoundContainer(), new WidgetImageAndSoundItem(), new WidgetImageAndText(),
          new WidgetInteractiveVideo(), new WidgetLatexFormula(), new WidgetMissingwordsContainer(),
          new WidgetMissingwordsItem(), new WidgetModal(), new WidgetPuzzle(), new WidgetSchemaContainer(),
          new WidgetSchemaItem(), new WidgetSentenceorderContainer(), new WidgetSentenceorderItem(),
          new WidgetSimpleImage(), new WidgetSimpleQuestion(), new WidgetTabContent(), new WidgetTable(),
          new WidgetTabsContainer(), new WidgetTermClassifcation(), new WidgetTermClassificationItem(),
          new WidgetTestContainer(), new WidgetTextBlock(), new WidgetTrueFalseContainer(),
          new WidgetTrueFalseItem(), new WidgetTrueFalseQuestion(), new WidgetVideo()]
          
        this.#widgets = Object.fromEntries(widgets.map(elem => [elem.config.widget, elem]));
        this.#section = new Section();
    }

    static getWidget(widget) {
        return this.#widgets[widget];
    }

    static getSection() {
        return this.#section;
    }
}