import { inject } from "inversify";
import Migration10to11 from "./versions/migration10to11";
import Migration11to12 from "./versions/migration11to12";
import Migration12to13 from "./versions/migration12to13";
import Migration13to14 from "./versions/migration13to14";
import Migration14to15 from "./versions/migration14to15";
import Migration1to2 from "./versions/migration1to2";
import Migration2to3 from "./versions/migration2to3";
import Migration3to4 from "./versions/migration3to4";
import Migration4to5 from "./versions/migration4to5";
import Migration5to6 from "./versions/migration5to6";
import Migration6to7 from "./versions/migration6to7";
import Migration7to8 from "./versions/migration7to8";
import Migration8to9 from "./versions/migration8to9";
import Migration9to10 from "./versions/migration9to10";

import MigrationEvaluationToContent from "./versions/migrationevaluationtocontent";
import ContainerManager from "../../../container.manager";
import SectionElement from "../../elements/section/section.element";
import Element from "../../elements/element/element";

export default class MigratorService {

    private container = ContainerManager.instance;

    private VERSION_MIGRATIONS: { [k: number]: any } = {
        2: this.container.get(Migration1to2),
        3: this.container.get(Migration2to3),
        4: this.container.get(Migration3to4),
        5: this.container.get(Migration4to5),
        6: this.container.get(Migration5to6),
        7: this.container.get(Migration6to7),
        8: this.container.get(Migration7to8),
        9: this.container.get(Migration8to9),
        10: this.container.get(Migration9to10),
        11: this.container.get(Migration10to11),
        12: this.container.get(Migration11to12),
        13: this.container.get(Migration12to13),
        14: this.container.get(Migration13to14),
        15: this.container.get(Migration14to15)
    };

    // Get the latest version
    private CURRENT_MODEL_VERSION = Math.max(...Object.keys(this.VERSION_MIGRATIONS).map(v => parseInt(v)));

    constructor(
        @inject("Factory<Element>") private create: (widget: string, data: any) => Promise<Element>,
        @inject(MigrationEvaluationToContent) private migrationEvaluationToContent: MigrationEvaluationToContent) { }

    async migrate(model: any) {

        // Transform evaluation units into content units
        if (model.evaluation) {
            // Force the update of the content unit
            model.version = 1;
            this.migrationEvaluationToContent.run(model);
            delete model.evaluation;
        }

        if (!model.sections) {
            model.version = this.CURRENT_MODEL_VERSION;
            return;
        }

        if (typeof model.version !== "number")
            model.version = 0;

        const version = Math.round(model.version);
        if (version > this.CURRENT_MODEL_VERSION)
            throw new Error("The current version of the model is not compatible with this tool.");
        if (version < this.CURRENT_MODEL_VERSION) {
            const versions = Object.keys(this.VERSION_MIGRATIONS)
                .map(v => parseInt(v))
                .filter(v => v >= version)
                .sort((v1, v2) => v1 - v2);
            for (let v of versions) {
                await this.VERSION_MIGRATIONS[v].run(model);
                model.version = v;
            }
        }
    }

    /**
     * Migrate a widget to the latest version
     * @param widget object corresponding to the widget
     * @returns the migrated widget
     */
    async migrateWidget(widget: any) {
        const section = await this.create("Section", { data: [widget] }) as SectionElement;
        const modelObj = { sections: [section.toJSON()] }
        await this.migrate(modelObj);
        return modelObj.sections[0].data[0];
    }

}