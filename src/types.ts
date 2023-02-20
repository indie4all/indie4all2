

/** API configuration options. **/
export interface ConfigOptions {
    // Enable service worker for Progressive Web Applications
    enablePWA?: boolean
    // Key to encrypt sensitive data. If null, no encryption is done.
    encryptionKey?: Function | string | null,
    // Server URL to preview the current unit. Default value: '/model/preview'.
    previewBackendURL?: string,
    // Server URL to publish the current unit. Default value: '/model/publish'.
    publishBackendURL?: string,
    // Sets if the API should show a modal asking for additional information when publishing a unit. Default value: true.
    requestAdditionalDataOnPopulate?: boolean,
    // Server URL to store the contents of the unit. Default value: '/model/save'.
    saveBackendURL?: string,
    // Server URL to generate a scorm package with the contents of the unit. Default value: '/model/scorm'.
    scormBackendURL?: string
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
    h: number,
    w: number,
    x: number,
    y: number
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

/** Choose option element */
export interface ChooseOption {
    text: string,
    correct: boolean
}

/** Couples item element */
export interface Couple {
    type: string,
    text: string,
    alt: string,
    blob: string
}