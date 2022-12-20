indieauthor.migrator = (function() {

    const CURRENT_MODEL_VERSION = 1;

    const ELEMENTS_WITH_CHILDREN = ['specific-container', 'simple-container', 
    'specific-element-container', 'element-container', 'layout', 'section-container'];

    const allElements = function() {
        let result = [this];
        if ( ELEMENTS_WITH_CHILDREN.includes(this.type)) {
            result = result.concat((this.type === 'layout' ? this.data.flat() : this.data)
                .flatMap(elem => allWidgets.apply(elem)));
        };
        return result;
    };

    const widgetsOfType = function(type) {
        return allElements
            .apply(this)
            .filter(elem => Array.isArray(type) ? type.includes(elem.widget) : type);
    }

    const VERSION_MIGRATIONS = {};

    return {
        migrate: function(model) {
            if (typeof model.CURRENT_MODEL_VERSION === "number") {
                const version = Math.round(model.CURRENT_MODEL_VERSION);
                if (version > CURRENT_MODEL_VERSION)
                    throw new Error("The current version of the model is not compatible with this tool.");
                if (version < CURRENT_MODEL_VERSION) {
                    Object.keys(VERSION_MIGRATIONS)
                        .filter(v => v >= version)
                        .sort().forEach(v => VERSION_MIGRATIONS[v](model))
                }
            }
        }
    }
})();