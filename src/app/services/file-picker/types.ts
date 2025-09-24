//enum FileType { IMAGE = "IMAGE", VIDEO = "VIDEO", AUDIO = "AUDIO", FILE = "FILE" }

export interface FilePickerResponse {
    "authorName": string,
    "authorizedScreens": string[],
    "elements": {
        "currentPage": number,
        "data": FilePickerElement[];
        "totalElements": number,
        "totalPages": number,
        "pageSize": number
    },
    "eventCode": number,
    "notifications": boolean,
    "quota": number,
    "storageUsed": number
}

export interface FilePickerElement {
    "createdAt": string,
    "elementId": string,
    "elementType": string,
    "name": string,
    "extension"?: string
}

export interface FilePickerDirectory extends FilePickerElement {
    "subFolders": string
}

export interface FilePickerFile extends FilePickerElement {
    "endpointTranscoded": string,
    "extension": string,
    "license": string,
    "rawTags": string,
    "status": string,
    "thumbnail": string
}

export interface FilePickerBreadcrumb {
    name: string;
    id: string;
}

export interface FilePickerDrawOptions {
    files?: boolean;
    folders?: boolean;
    pages?: boolean;
    breadcrumbs?: boolean;
}

export enum FilePickerType { IMAGE = "IMAGE", VIDEO = "VIDEO", AUDIO = "AUDIO", FILE = "FILE", SUBTITLES = "SUBTITLES", ALL = "ALL" }