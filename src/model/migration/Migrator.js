import Migration9to10 from "./Migration9to10";

export default class Migrator {

    static VERSION_MIGRATIONS = {
        10: Migration9to10
    };

    // Get the latest version
    static CURRENT_MODEL_VERSION = Math.max(...Object.keys(this.VERSION_MIGRATIONS));

    static migrate(model) {

        if (!model.sections) {
            model.CURRENT_MODEL_VERSION = Migrator.CURRENT_MODEL_VERSION;
            return;
        }

        if (typeof model.CURRENT_MODEL_VERSION !== "number")
            model.CURRENT_MODEL_VERSION = 0;

        const version = Math.round(model.CURRENT_MODEL_VERSION);
        if (version > Migrator.CURRENT_MODEL_VERSION)
            throw new Error("The current version of the model is not compatible with this tool.");
        if (version < Migrator.CURRENT_MODEL_VERSION) {
            Object.keys(Migrator.VERSION_MIGRATIONS)
                .filter(v => v >= version)
                .sort().forEach(v => {
                    Migrator.VERSION_MIGRATIONS[v].run(model);
                    model.CURRENT_MODEL_VERSION = v;
                });
        }
    }
}