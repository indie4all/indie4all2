//enum FileType { IMAGE = "IMAGE", VIDEO = "VIDEO", AUDIO = "AUDIO", FILE = "FILE" }

interface FilePickerResponse {
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

interface FilePickerElement {
    "createdAt": string,
    "elementId": string,
    "elementType": string,
    "name": string,
    "extension"?: string
}

interface FilePickerDirectory extends FilePickerElement {
    "subFolders": string
}

interface FilePickerFile extends FilePickerElement {
    "endpointTranscoded": string,
    "extension": string,
    "license": string,
    "rawTags": string,
    "status": string,
    "thumbnail": string
}

interface FilePickerBreadcrumb {
    name: string;
    id: string;
}

interface FilePickerDrawOptions {
    files?: boolean;
    folders?: boolean;
    pages?: boolean;
    breadcrumbs?: boolean;
}