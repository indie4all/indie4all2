export default class I18n {

    static #INSTANCE = null;
    static #LANGUAGES = {
        "el": () => import("./lang/el.json"), 
        "es": () => import("./lang/es.json"), 
        "en": () => import("./lang/en.json"), 
        "fr": () => import("./lang/fr.json"),
        "lt": () => import("./lang/lt.json")};


    #corpus = {}

    constructor() {}

    static init() {
        const lang = navigator && navigator.language ? navigator.language.substring(0,2).toLowerCase() : 'en';
        return I18n.#LANGUAGES[lang in I18n.#LANGUAGES ? lang : "en"]().then(({ default: corpus}) => {
            I18n.#INSTANCE = new I18n();
            I18n.#INSTANCE.#corpus = corpus;
            return I18n.#INSTANCE;
        });
    }

    static getInstance() {
        if (!I18n.#INSTANCE)
            throw new Error("I18n must be initialised first");
            
        return I18n.#INSTANCE;
    }

    hasKey(query) {
        return this.translate(query).length > 0;
    }


    translate(query) {
        return [query.split('.').reduce((acc, current) => acc[current], this.#corpus)];
    }

    value(query) {
        const translations = this.translate(query);
        return translations.length ? translations[0] : "";
    }
}