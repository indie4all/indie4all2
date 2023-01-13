import Migration9to10 from "./Migration9to10";

export default class Migrator {

    static VERSION_MIGRATIONS = {
        10: Migration9to10
    };

    // Get the latest version
    static CURRENT_MODEL_VERSION = Math.max(...Object.keys(this.VERSION_MIGRATIONS).map(v => parseInt(v)));

    static migrate(model) {

        if (!model.sections) {
            model.version = Migrator.CURRENT_MODEL_VERSION;
            return;
        }

        if (typeof model.version !== "number")
            model.version = 0;

        const version = Math.round(model.version);
        if (version > Migrator.CURRENT_MODEL_VERSION)
            throw new Error("The current version of the model is not compatible with this tool.");
        if (version < Migrator.CURRENT_MODEL_VERSION) {
            Object.keys(Migrator.VERSION_MIGRATIONS)
                .map(v => parseInt(v))
                .filter(v => v >= version)
                .sort((v1,v2) => v1 - v2).forEach(v => {
                    Migrator.VERSION_MIGRATIONS[v].run(model);
                    model.version = v;
                });
        }
    }
}