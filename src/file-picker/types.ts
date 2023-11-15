//enum FileType { IMAGE = "IMAGE", VIDEO = "VIDEO", AUDIO = "AUDIO", FILE = "FILE" }

interface FilePickerResponse {
    "folders": {
        "data": FilePickerDirectory[];
        "totalElements": number,
        "totalPages": number,
        "currentPage": number,
        "pageSize": number
    },
    "mediaFiles": {
        "data": FilePickerFile[];
        "totalElements": number,
        "totalPages": number,
        "currentPage": number,
        "pageSize": number

    }
}

interface FilePickerDirectory {
    name: string;
    id: string;
    folderType: string;
    authorizedUsers: string[]; // TODO: ask about this
    eventCode: number;
    createdAt: string;
}

interface FilePickerFile {
    title: string;
    fileType: string;
    rawTags: string;
    mediaFileId: string;
    thumbnail: string;
    license: string;
    createdAt: string;
    endpointTranscoded: string;
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