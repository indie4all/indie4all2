import Config from "./Config";

export default class I18n {

    private static INSTANCE: I18n;
    private static LANGUAGES: {
        [lng: string]: () => Promise<any>
    } = {
            "el": () => import("./lang/el.json"),
            "es": () => import("./lang/es.json"),
            "en": () => import("./lang/en.json"),
            "fr": () => import("./lang/fr.json"),
            "lt": () => import("./lang/lt.json")
        };


    private corpus: any = {}
    private lang!: string;

    constructor() { }

    static async init(): Promise<I18n> {
        const lang = navigator && navigator.language ? navigator.language.substring(0, 2).toLowerCase() : 'en';
        const currLang = lang in I18n.LANGUAGES ? lang : "en";
        const { default: corpus } = await I18n.LANGUAGES[currLang]();
        I18n.INSTANCE = new I18n();
        I18n.INSTANCE.corpus = corpus;
        I18n.INSTANCE.lang = currLang;
        return I18n.INSTANCE;
    }

    static getInstance(): I18n {
        if (!I18n.INSTANCE)
            throw new Error("I18n must be initialised first");

        return I18n.INSTANCE;
    }

    getLang(): string {
        return this.lang;
    }

    hasKey(query: string): boolean {
        return this.translate(query).length > 0;
    }


    translate(query: string): string[] {
        return [<string>query.split('.').reduce((acc, current) => acc[current], this.corpus)];
    }

    value(query: string): string {
        const translations = this.translate(query);
        return translations.length ? translations[0] : "";
    }

    async translateOnDemand(query: any, from: string, to: string): Promise<any> {

        const translationBackend = Config.getTranslationBackendURL();
        if (!translationBackend)
            throw new Error("Dynamic translation is not configured");

        const url = translationBackend + "?" + new URLSearchParams({ from, to });
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return await fetch(url, { method: 'POST', headers, body: query, redirect: 'follow' }).then(response => response.json());

    }

    canTranslateUnits(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const translationBackend = Config.getTranslationBackendURL();
                if (!translationBackend)
                    resolve(false);
                const url = translationBackend + "/status";
                await fetch(url).then(response => resolve(response.ok));
            } catch (error) {
                resolve(false);
            }
        });
    }
}