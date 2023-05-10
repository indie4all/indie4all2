export abstract class TranslationService {
    protected endpoint!: string;
    protected key!: string;
    protected location?: string;

    public constructor() {
        if (!process.env.TRANSLATION_ENDPOINT || !process.env.TRANSLATION_KEY)
            throw new Error("The translation service endpoint and key are not set");

        this.endpoint = process.env.TRANSLATION_ENDPOINT;
        this.key = process.env.TRANSLATION_KEY;
        this.location = process.env.TRANSLATION_LOCATION;
    }

    public async translateJSON(content: any, from: string, to: string): Promise<any> {
        if (from === to) return Promise.resolve(content);
        if (typeof content === "string") return await this.translate(content.toString(), from, to);
        if (Array.isArray(content)) return await Promise.all(content.map((item) => this.translateJSON(item, from, to)));
        if (typeof content === "object") {
            const entries = await Promise.all(Object.entries(content)
                .map(async ([key, value]) => [key, await this.translateJSON(value, from, to)]));
            return Promise.resolve(Object.fromEntries(entries));
        }
        throw new Error("Invalid content type: " + (typeof content));
    }

    public abstract translate(content: string, from: string, to: string): Promise<string>;

    public healthCheck(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                this.translate("", "en", "en");
                resolve(true);
            } catch (error) {
                resolve(false);
            }
        });
    };
}