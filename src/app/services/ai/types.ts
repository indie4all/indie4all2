export interface AIResponse {}

export interface AIResponseOK extends AIResponse {
    explanation: string;
    model: AIResult;
    references: string[];
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

export interface AIResult {}

interface AIChange {
    op: "add" | "remove" | "replace" | "move" | "copy";
    path: string;
    value: any;
    from: string | null;
}

export interface AIChanges extends AIResult {
    changes: AIChange[];
}

export interface AIModel extends AIResult {
    sections: AISection[];
}

export interface AISection extends AIResult {
    id: string;
    data: any[];
    name: string;
    hidden: boolean;
    widget: "Section";
    bookmark: string;
}
export interface AIWidget extends AIResult {
    id: string;
    widget: string;
}

export interface Chatbot {
    chatbotId: string;
    title: string;
    description: string;
}