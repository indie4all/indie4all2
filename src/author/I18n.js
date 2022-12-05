import LANG_EL from "./lang/el.json";
import LANG_EN from "./lang/en.json";
import LANG_ES from "./lang/es.json";
import LANG_FR from "./lang/fr.json";
import LANG_LT from "./lang/lt.json";
import jsonpath from "jsonpath/jsonpath.min.js";

export default class I18n {

    static #INSTANCE = null;
    #locale = 'EN';

    constructor() {
        let lang = navigator && navigator.language ? navigator.language.substring(0,2) : 'en';
        const LANGUAGES = ["EL", "ES", "EN", "FR", "LT"];
        this.#locale = LANGUAGES.find(elem => elem === lang.toUpperCase()) ?? "EN";
    }

    static getInstance() {
        if (!this.#INSTANCE) {
            this.#INSTANCE = new I18n();
        }
        return this.#INSTANCE;
    }

    translate(query) {
        switch (this.#locale) {
            case "EL": return jsonpath.query(LANG_EL, "$."+query);
            case "ES": return jsonpath.query(LANG_ES, "$."+query);
            case "FR": return jsonpath.query(LANG_FR, "$."+query);
            case "LT": return jsonpath.query(LANG_LT, "$."+query);
            default: return jsonpath.query(LANG_EN, "$."+query);
        }
    }
}