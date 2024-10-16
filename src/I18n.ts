import Config from "./Config";

export default class I18n {

    private static INSTANCE: I18n;
    private static LANGUAGES: {
        [lng: string]: () => Promise<any>
    } = {
            "ar": () => import("./lang/INDIE4ALL2_AR_trad.json"),
            "bg": () => import("./lang/INDIE4ALL2_BG_trad.json"),
            "ca": () => import("./lang/INDIE4ALL2_CA_trad.json"),
            "cs": () => import("./lang/INDIE4ALL2_CS_trad.json"),
            "da": () => import("./lang/INDIE4ALL2_DA_trad.json"),
            "de": () => import("./lang/INDIE4ALL2_DE_trad.json"),
            "el": () => import("./lang/INDIE4ALL2_EL_trad.json"),
            "et": () => import("./lang/INDIE4ALL2_ET_trad.json"),
            "eu": () => import("./lang/INDIE4ALL2_EU_trad.json"),
            "fi": () => import("./lang/INDIE4ALL2_FI_trad.json"),
            "fr": () => import("./lang/INDIE4ALL2_FR_trad.json"),
            "ga": () => import("./lang/INDIE4ALL2_GA_trad.json"),
            "gl": () => import("./lang/INDIE4ALL2_GL_trad.json"),
            "hr": () => import("./lang/INDIE4ALL2_HR_trad.json"),
            "hu": () => import("./lang/INDIE4ALL2_HU_trad.json"),
            "it": () => import("./lang/INDIE4ALL2_IT_trad.json"),
            "ja": () => import("./lang/INDIE4ALL2_JA_trad.json"),
            "lv": () => import("./lang/INDIE4ALL2_LV_trad.json"),
            "mt": () => import("./lang/INDIE4ALL2_MT_trad.json"),
            "nb": () => import("./lang/INDIE4ALL2_NB_trad.json"),
            "nl": () => import("./lang/INDIE4ALL2_NL_trad.json"),
            "pl": () => import("./lang/INDIE4ALL2_PL_trad.json"),
            "pt-pt": () => import("./lang/INDIE4ALL2_PT-PT_trad.json"),
            "ro": () => import("./lang/INDIE4ALL2_RO_trad.json"),
            "sk": () => import("./lang/INDIE4ALL2_SK_trad.json"),
            "sl": () => import("./lang/INDIE4ALL2_SL_trad.json"),
            "sv": () => import("./lang/INDIE4ALL2_SV_trad.json"),
            "uk": () => import("./lang/INDIE4ALL2_UK_trad.json"),
            "yue": () => import("./lang/INDIE4ALL2_YUE_trad.json"),
            "es": () => import("./lang/INDIE4ALL2_ES_trad.json"),
            "en": () => import("./lang/INDIE4ALL2_EN_trad.json"),
            "lt": () => import("./lang/INDIE4ALL2_LT_trad.json")
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
        headers.append("Accept", "application/json");
        const response = await fetch(url, { method: 'POST', headers, body: query, redirect: 'follow' });
        if (!response.ok)
            throw new Error(this.value("messages.translateError"));
        return await response.json();
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