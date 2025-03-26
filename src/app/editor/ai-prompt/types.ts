export enum AIAction { Create = "create", Update = "update" }

export interface AIElementInfo {
    type: string;
}

export interface AIWidgetInfo extends AIElementInfo {
    id: string;
}