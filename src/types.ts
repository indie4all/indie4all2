

/** API configuration options. **/
export interface ConfigOptions {
    // Enable service worker for Progressive Web Applications
    enablePWA?: boolean
    // Key to encrypt sensitive data. If null, no encryption is done.
    encryptionKey?: Function | string | null,
    // Work with local or remote resources
    local?: boolean,
    // Server URL to preview the current unit. Default value: '/model/preview'.
    previewBackendURL?: string,
    // Server URL to publish the current unit. Default value: '/model/publish'.
    publishBackendURL?: string,
    // Sets if the API should show a modal asking for additional information when publishing a unit. Default value: true.
    requestAdditionalDataOnPopulate?: boolean,
    // Server URL to store the contents of the unit. Default value: '/model/save'.
    saveBackendURL?: string,
    // Server URL to generate a scorm package with the contents of the unit. Default value: '/model/scorm'.
    scormBackendURL?: string,
    // Server URL to retrieve a remote resource
    resourceBackendURL?: string
    // List of permitted origins for hosting resources
    allowedResourceOrigins?: []
}

/** Edit form data **/
export interface FormEditData {
    inputs: string,
    title: string
}

/** Piece data */
export interface PieceElement {
    altImg?: string,
    altRec?: string,
    h: string,
    w: string,
    x: string,
    y: string
}

/** Interactive areas of a piece */
export interface PieceInteractiveAreas {
    "move": Path2D[],
    "e-resize": Path2D[],
    "w-resize": Path2D[],
    "n-resize": Path2D[],
    "s-resize": Path2D[],
    "nw-resize": Path2D[],
    "nwse-resize": Path2D[],
    "ne-resize": Path2D[],
    "nesw-resize": Path2D[]
}

export interface Feedback {
    negative?: string,
    positive?: string
}

interface InputWidgetData {
    widget: string,
    [x: string]: any
}

interface InputModelElementData {
    id?: string,
    data?: any,
    params?: any,
    widget?: string
}

interface InputWidgetElementData extends InputModelElementData {
    category: string,
    icon: string
}

export interface InputSectionData extends InputModelElementData {
    bookmark?: string,
    data?: InputWidgetData[],
    index?: number,
    name?: string
}

export interface TextBlockData {
    style?: string,
    text?: string
}

export interface InputTextBlockData extends InputWidgetElementData {
    data?: TextBlockData,
    style?: string,
    text?: string
}

export interface BlockquoteData {
    alignment?: string,
    caption?: string,
    quote?: string,
    source?: string
}

export interface InputBlockquoteData extends InputWidgetElementData {
    data?: BlockquoteData
}

export interface WidgetLatexFormulaData {
    caption?: string,
    formula?: string
}

export interface InputLatexFormulaData extends InputWidgetElementData {
    data?: WidgetLatexFormulaData
}

export interface WidgetVideoParams {
    name?: string
}

export interface WidgetVideoData {
    captions?: string,
    defaultCaptions?: string,
    descriptions?: string,
    videourl?: string
}

export interface InputWidgetVideoData extends InputWidgetElementData {
    params: WidgetVideoParams,
    data: WidgetVideoData
}

export interface WidgetSimpleImageParams {
    align?: string,
    aspect?: string,
    name?: string
}

export interface WidgetSimpleImageData {
    alt?: string,
    blob?: string,
    height?: number,
    image?: string,
    width?: number
}

export interface InputWidgetSimpleImageData extends InputWidgetElementData {
    data?: WidgetSimpleImageData,
    params?: WidgetSimpleImageParams
}

export interface WidgetTableData {
    columns?: string[],
    rows?: { [x: string]: string }[]
}

export interface WidgetTableParams {
    name?: string,
    help?: string
}

export interface InputWidgetTableData extends InputWidgetElementData {
    data?: WidgetTableData,
    params?: WidgetTableParams
}

export interface WidgetTwoColumnsLayoutParams {
    firstColumnWidth?: string
}

export interface InputWidgetTwoColumnsLayoutData extends InputWidgetElementData {
    data?: InputWidgetData[][],
    params?: WidgetTwoColumnsLayoutParams
}

export interface InputWidgetThreeColumnsLayoutData extends InputWidgetElementData {
    data?: InputWidgetData[][]
}

export interface InputWidgetFourColumnsLayoutData extends InputWidgetElementData {
    data?: InputWidgetData[][]
}

export interface WidgetTabsContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetTabsContainerData extends InputWidgetElementData {
    data?: InputWidgetData[],
    params?: WidgetTabsContainerParams
}

export interface WidgetTabContentParams {
    name?: string
}

export interface InputWidgetTabContentData extends InputWidgetElementData {
    data?: InputWidgetData[],
    params?: WidgetTabContentParams
}

export interface WidgetAcordionContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetAcordionContainerData extends InputWidgetElementData {
    data?: InputWidgetData[],
    params?: WidgetAcordionContainerParams
}

export interface WidgetAcordionContentParams {
    title?: string
}

export interface InputWidgetAcordionContentData extends InputWidgetElementData {
    data?: InputWidgetData[],
    params?: WidgetAcordionContentParams
}

export interface WidgetModalParams {
    help?: string,
    name?: string,
    text?: string
}

export interface InputWidgetModalData extends InputWidgetElementData {
    data?: InputWidgetData[],
    params?: WidgetModalParams
}

export interface WidgetImageAndTextParams {
    help?: string,
    name?: string
}

export interface WidgetImageAndTextData {
    alt?: string,
    blob?: string,
    image?: string,
    layout?: number,
    text?: string
}

export interface InputWidgetImageAndTextData extends InputWidgetElementData {
    data?: WidgetImageAndTextData
}

export interface WidgetImageData {
    alt?: string,
    blob?: string,
    image?: string,
    text?: string
}

export interface WidgetImageParams {
    help?: string,
    name?: string
}

export interface InputWidgetImageData extends InputWidgetElementData {
    data?: WidgetImageData,
    params?: WidgetImageParams
}

export interface WidgetChooseOptionItem {
    text: string,
    correct: boolean
}

export interface WidgetChooseOptionParams {
    help?: string,
    name?: string
}

export interface WidgetChooseOptionData {
    alt?: string,
    blob?: string,
    image?: string,
    options?: WidgetChooseOptionItem[],
    text?: string
}

export interface InputWidgetChooseOptionData extends InputWidgetElementData {
    data?: WidgetChooseOptionData,
    params?: WidgetChooseOptionParams
}

export interface WidgetDragDropContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetDragDropContainerData extends InputWidgetElementData {
    data?: InputWidgetDragDropItemData[],
    params?: WidgetDragDropContainerParams
}

export interface WidgetDragDropItemData {
    definition?: string,
    term?: string
}

export interface InputWidgetDragDropItemData extends InputWidgetElementData {
    data?: WidgetDragDropItemData
}

export interface WidgetTrueFalseContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetTrueFalseContainer extends InputWidgetElementData {
    data?: InputWidgetTrueFalseItem[],
    params?: WidgetTrueFalseContainerParams
}

export interface WidgetTrueFalseItemData {
    answer?: boolean,
    feedback?: Feedback,
    question?: string
}

export interface InputWidgetTrueFalseItem extends InputWidgetElementData {
    data?: WidgetTrueFalseItemData
}

export interface WidgetAudioTermItemData {
    audio?: string,
    audioblob?: string,
    captions?: string,
    captionsblob?: string,
    definition: string,
    term: string
}

export interface InputWidgetAudioTermItemData extends InputWidgetElementData {
    data?: WidgetAudioTermItemData
}

export interface WidgetAudioTermContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetAudioTermContainerData extends InputWidgetElementData {
    data?: InputWidgetAudioTermItemData[],
    params?: WidgetAudioTermContainerParams
}

export interface WidgetImageAndSoundItemData {
    alt?: string,
    audio?: string,
    audioblob?: string,
    blob?: string,
    captions?: string,
    captionsblob?: string,
    image?: string,
    text?: string
}

export interface InputWidgetImageAndSoundItemData extends InputWidgetElementData {
    data?: WidgetImageAndSoundItemData,
}

export interface WidgetImageAndSoundContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetImageAndSoundContainerData extends InputWidgetElementData {
    data?: InputWidgetImageAndSoundItemData[],
    params?: WidgetImageAndSoundContainerParams
}

export interface WidgetCoupleElementData {
    type: string,
    text: string,
    alt: string,
    blob?: string,
    image?: string
}

export interface WidgetCouplesItemData {
    couples: [WidgetCoupleElementData, WidgetCoupleElementData]
}

export interface InputWidgetCouplesItemData extends InputWidgetElementData {
    data?: WidgetCouplesItemData
}

export interface WidgetCouplesContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetCouplesContainerData extends InputWidgetElementData {
    data: InputWidgetCouplesItemData[],
    params: WidgetCouplesContainerParams
}

export interface WidgetSchemaItemData {
    alt?: string,
    blob?: string,
    image?: string
}

export interface InputWidgetSchemaItemData extends InputWidgetElementData {
    data: WidgetSchemaItemData,
}

export interface WidgetSchemaContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetSchemaContainerData extends InputWidgetElementData {
    data: InputWidgetSchemaItemData[],
    params: WidgetSchemaContainerParams
}

export interface WidgetInteractiveVideoParams {
    name?: string
}

export interface WidgetInteractiveVideoData {
    videourl?: string
}

export interface InputWidgetInteractiveVideoData extends InputWidgetElementData {
    data?: WidgetInteractiveVideoData,
    params?: WidgetInteractiveVideoParams
}

export interface WidgetPiecesElementParams {
    help?: string,
    name?: string
}

export interface WidgetPiecesElementData {
    alt?: string,
    blob?: string,
    image?: string,
    pieces?: PieceElement[]
}

export interface InputWidgetPiecesElementData extends InputWidgetElementData {
    data?: WidgetPiecesElementData,
    params?: WidgetInteractiveVideoParams
}

export interface WidgetCorrectWordItemData {
    alt?: string,
    blob?: string,
    image?: string,
    question?: string,
    word?: string
}

export interface InputWidgetCorrectWordItemData extends InputWidgetElementData {
    data?: WidgetCorrectWordItemData
}

export interface WidgetCorrectWordContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetCorrectWordContainerData extends InputWidgetElementData {
    data?: InputWidgetCorrectWordItemData[],
    params: WidgetCorrectWordContainerParams
}

export interface WidgetMissingwordsItemData {
    combinations?: string[],
    sentence?: string
}

export interface InputWidgetMissingwordsItemData extends InputWidgetElementData {
    data?: WidgetMissingwordsItemData
}

export interface WidgetMissingwordsContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetMissingwordsContainerData extends InputWidgetElementData {
    data?: InputWidgetMissingwordsItemData[],
    params?: WidgetMissingwordsContainerParams
}

export interface WidgetSentenceorderItemData {
    answers?: string[],
    words?: string[]
}

export interface InputWidgetSentenceorderItemData extends InputWidgetElementData {
    data?: WidgetSentenceorderItemData
}

export interface WidgetSentenceorderContainerParms {
    help?: string,
    name?: string
}

export interface InputWidgetSentenceorderContainerData extends InputWidgetElementData {
    data?: InputWidgetSentenceorderItemData[],
    params?: WidgetSentenceorderContainerParms
}

export interface WidgetGuessWordParams {
    help?: string,
    name?: string
}

export interface WidgetGuessWordData {
    answer?: string,
    attempts?: number,
    question?: string
}

export interface InputWidgetGuessWordData extends InputWidgetElementData {
    data?: WidgetGuessWordData,
    params?: WidgetGuessWordParams
}

export interface WidgetButtonTextItemData {
    alt?: string,
    blob?: string,
    image?: string,
    text?: string
}

export interface InputWidgetButtonTextItemData extends InputWidgetElementData {
    data?: WidgetButtonTextItemData
}

export interface WidgetButtonTextContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetButtonTextContainerData extends InputWidgetElementData {
    data?: InputWidgetButtonTextItemData[],
    params?: WidgetButtonTextContainerParams
}

export interface WidgetAnimationItemData {
    image?: string
}

export interface InputWidgetAnimationItemData extends InputWidgetElementData {
    data?: WidgetAnimationItemData
}

export interface WidgetAnimationContainerParams {
    height?: number,
    help?: string,
    image?: string,
    name?: string,
    width?: number
}

export interface InputWidgetAnimationContainerData extends InputWidgetElementData {
    data?: InputWidgetAnimationItemData[]
}

export interface WidgetTermClassificationItemData {
    column: string,
    terms: string[]
}

export interface InputWidgetTermClassificationItemData extends InputWidgetElementData {
    data?: WidgetTermClassificationItemData
}

export interface WidgetTermClassificationContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetTermClassificationContainerData extends InputWidgetElementData {
    data?: InputWidgetTermClassificationItemData[],
    params: WidgetTermClassificationContainerParams
}

export interface WidgetTestContainerParams {
    help?: string,
    name?: string
}

export interface InputWidgetTestContainerData extends InputWidgetElementData {
    data?: InputWidgetElementData[],
    params: WidgetTestContainerParams
}

export interface WidgetGapQuestionData {
    answers?: { text: string, correct: boolean }[],
    feedback?: Feedback,
    question?: string
}

export interface InputWidgetGapQuestionData extends InputWidgetElementData {
    data?: WidgetGapQuestionData
}

export interface WidgetSimpleQuestionData {
    answers?: { text: string, correct: boolean }[],
    feedback?: Feedback,
    question?: string
}

export interface InputWidgetSimpleQuestionData extends InputWidgetElementData {
    data?: WidgetSimpleQuestionData
}

export interface WidgetTrueFalseQuestionData {
    answer?: boolean,
    feedback?: Feedback,
    question?: string
}

export interface InputWidgetTrueFalseQuestionData extends InputWidgetElementData {
    data?: WidgetTrueFalseQuestionData
}