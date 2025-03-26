export interface AIResponse {

}

export interface AIResponseOK extends AIResponse {
    explanation: string;
    model: AIModel;
}

export interface AIResponseError extends AIResponse {
    timestamp: string;
    error: string;
    code: string;
    parameters: {
        [x: string]: string;
    }
}

export function isAIResponseError(response: AIResponse): response is AIResponseError {
    return (response as AIResponseError).error !== undefined;
}

export function isAIResponseOK(response: AIResponse): response is AIResponseOK {
    return (response as AIResponseOK).model !== undefined;
}

export interface AIModel {
    sections: AISection[];
}

export interface AISection {
    id: string;
    data: any[];
    name: string;
    hidden: boolean;
    widget: "Section";
    bookmark: string;
}