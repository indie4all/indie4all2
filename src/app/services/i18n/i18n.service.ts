import { injectable } from "inversify";
import i18next, { TFunction } from "i18next";
import Config from "../../../config";

@injectable()
export default class I18nService {

    private _LANGUAGES = {
        "ar": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_AR_trad.json"),
        "bg": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_BG_trad.json"),
        "ca": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_CA_trad.json"),
        "cs": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_CS_trad.json"),
        "da": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_DA_trad.json"),
        "de": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_DE_trad.json"),
        "el": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_EL_trad.json"),
        "en": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_EN_trad.json"),
        "es": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_ES_trad.json"),
        "et": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_ET_trad.json"),
        "eu": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_EU_trad.json"),
        "fi": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_FI_trad.json"),
        "fr": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_FR_trad.json"),
        "ga": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_GA_trad.json"),
        "gl": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_GL_trad.json"),
        "hr": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_HR_trad.json"),
        "hu": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_HU_trad.json"),
        "it": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_IT_trad.json"),
        "ja": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_JA_trad.json"),
        "lv": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_LV_trad.json"),
        "lt": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_LT_trad.json"),
        "mt": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_MT_trad.json"),
        "nb": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_NB_trad.json"),
        "nl": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_NL_trad.json"),
        "pl": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_PL_trad.json"),
        "pt": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_PT-PT_trad.json"),
        "ro": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_RO_trad.json"),
        "sk": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_SK_trad.json"),
        "sl": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_SL_trad.json"),
        "sv": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_SV_trad.json"),
        "uk": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_UK_trad.json"),
        "yue": () => import(/* webpackFetchPriority: "high" */"../../../lang/INDIE4ALL2_YUE_trad.json")
    };

    private _lang!: string;
    private _i18n!: TFunction;

    constructor() { }

    async init(): Promise<void> {

        // Get the lang attribute from the html tag
        // If the lang attribute is not set, use the navigator language
        const lang = document.documentElement.lang;
        const currLang = lang in this._LANGUAGES ? lang : "en";
        const { default: corpus } = await this._LANGUAGES[currLang]();
        return new Promise((resolve, reject) => {
            i18next.createInstance({ lng: currLang, resources: { [currLang]: { translation: corpus } } }, (err, t) => {
                if (err) reject(err);
                this._i18n = t;
                this._lang = currLang;
                resolve();
            });
        });
    }

    get lang(): string { return this._lang; }

    public get allLanguages(): string[] {
        return Object.keys(this._LANGUAGES);
    }

    value(query: string, options?: any): string {
        return this._i18n(query, options).toString();
    }

    object(query: string, options?: any): Object {
        const opts = { ...options };
        if (!opts.returnObjects) opts.returnObjects = true;
        return this._i18n(query, opts);
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