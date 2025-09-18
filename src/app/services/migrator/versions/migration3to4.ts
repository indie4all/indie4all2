import { inject, injectable } from "inversify";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration3to4 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    async run(model: any) {
        const types = ['AcordionContainer', 'AnimationContainer',
            'AudioTermContainer', 'ChooseOption', 'CouplesContainer',
            'DragdropContainer', 'Image', 'ImageAndSoundContainer',
            'ImageAndText', 'Modal', 'SchemaContainer', 'TabsContainer',
            'Test', 'TrueFalseContainer'
        ];
        const widgets = this.utils.findObjectsOfType(model, types);
        widgets
            .filter(widget => typeof widget?.params.help !== "string")
            .forEach(widget => widget.params.help = '');
    }
}