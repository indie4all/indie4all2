import { AIResponse } from "./types";
import Config from "../../../config";
import { injectable } from "inversify";

@injectable()
export default class AIService {

    constructor() { }

    private async fetch(url: string, prompt: string, model?: any): Promise<AIResponse> {
        const body = { prompt };
        if (model) body['model'] = model;
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error(res.statusText);
        return await res.json();
    }

    public async createModel(prompt: string): Promise<AIResponse> {
        return this.fetch(`${Config.getAIURL()}/models/create/`, prompt);
    }

    public async createSection(prompt: string, model: any): Promise<AIResponse> {
        return this.fetch(`${Config.getAIURL()}/sections/create/`, prompt, model);
    }

    public async createWidget(prompt: string, widgetType: string, model: any): Promise<AIResponse> {
        return this.fetch(`${Config.getAIURL()}/widgets/create/${widgetType}`, prompt, model);
    }

    public async updateWidget(prompt: string, widgetId: string, model: any): Promise<AIResponse> {
        return this.fetch(`${Config.getAIURL()}/widgets/update/${widgetId}`, prompt, model);
    }
}