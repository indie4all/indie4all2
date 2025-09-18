import { AIResponse, Chatbot } from "./types";
import Config from "../../../config";
import { injectable } from "inversify";
import { Model } from "../../elements/model";

@injectable()
export default class AIService {

    constructor() { }

    private async fetch(url: string, prompt: string, chatbotIds: string[], effort: string, model?: Model, id?: string): Promise<AIResponse> {
        const body = { prompt, chatbotIds, effort };
        if (model) body['model'] = { sections: model.toJSON().sections };
        if (id) body['id'] = id;
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error(res.statusText);
        return await res.json();
    }

    public async createModel(prompt: string, chatbotIds: string[], effort: string): Promise<AIResponse> {
        return this.fetch(`${Config.getAIURL()}/models/create/`, prompt, chatbotIds, effort);
    }

    public async updateModel(prompt: string, chatbotIds: string[], model: Model, effort: string): Promise<AIResponse> {
        return this.fetch(`${Config.getAIURL()}/models/update/`, prompt, chatbotIds, effort, model);
    }

    public async createSection(prompt: string, chatbotIds: string[], model: Model, effort: string): Promise<AIResponse> {
        return this.fetch(`${Config.getAIURL()}/sections/create/`, prompt, chatbotIds, effort, model);
    }

    public async createWidget(prompt: string, chatbotIds: string[], widgetType: string, model: Model, effort: string): Promise<AIResponse> {
        return this.fetch(`${Config.getAIURL()}/widgets/create/${widgetType}`, prompt, chatbotIds, effort, model);
    }

    public async updateWidget(prompt: string, chatbotIds: string[], widgetId: string, model: Model, effort: string): Promise<AIResponse> {
        return this.fetch(`${Config.getAIURL()}/widgets/update/`, prompt, chatbotIds, effort, model, widgetId);
    }

    public async getChatbots(): Promise<Chatbot[]> {
        const res = await fetch(`${Config.getAIURL()}/chatbots/`);
        if (!res.ok) throw new Error(res.statusText);
        return await res.json();
    }
}