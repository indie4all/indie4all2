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
}