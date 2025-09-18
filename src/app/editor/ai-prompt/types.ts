import { OptionRowData } from "multiple-select-vanilla";

export enum AIAction { Create = "create", Update = "update" }

export interface AIElementInfo {
    type: string;
    chatbots: OptionRowData[];
}

export interface AIWidgetInfo extends AIElementInfo {
    id: string;
}

export interface MultipleSelectChoice {
    text: string;
    value: string;
}