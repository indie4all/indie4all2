import Migration10to11 from "./Migration10to11";
import Migration11to12 from "./Migration11to12";
import Migration12to13 from "./Migration12to13";
import Migration13to14 from "./Migration13to14";
import Migration14to15 from "./Migration14to15";
import Migration1to2 from "./Migration1to2";
import Migration2to3 from "./Migration2to3";
import Migration3to4 from "./Migration3to4";
import Migration4to5 from "./Migration4to5";
import Migration5to6 from "./Migration5to6";
import Migration6to7 from "./Migration6to7";
import Migration7to8 from "./Migration7to8";
import Migration8to9 from "./Migration8to9";
import Migration9to10 from "./Migration9to10";

import MigrationEvaluationToContent from "./MigrationEvaluationToContent";

export default class Migrator {

    static VERSION_MIGRATIONS: { [k: number]: any } = {
        2: Migration1to2,
        3: Migration2to3,
        4: Migration3to4,
        5: Migration4to5,
        6: Migration5to6,
        7: Migration6to7,
        8: Migration7to8,
        9: Migration8to9,
        10: Migration9to10,
        11: Migration10to11,
        12: Migration11to12,
        13: Migration12to13,
        14: Migration13to14,
        15: Migration14to15
    };

    // Get the latest version
    static CURRENT_MODEL_VERSION = Math.max(...Object.keys(this.VERSION_MIGRATIONS).map(v => parseInt(v)));

    static async migrate(model: any) {

        // Transform evaluation units into content units
        if (model.evaluation) {
            // Force the update of the content unit
            model.version = 1;
            MigrationEvaluationToContent.run(model);
            delete model.evaluation;
        }

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
            const versions = Object.keys(Migrator.VERSION_MIGRATIONS)
                .map(v => parseInt(v))
                .filter(v => v >= version)
                .sort((v1, v2) => v1 - v2);
            for (let v of versions) {
                await Migrator.VERSION_MIGRATIONS[v].run(model);
                model.version = v;
            }
        }
    }
}