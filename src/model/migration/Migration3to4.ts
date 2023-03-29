import Utils from "../../Utils";

export default class Migration3to4 {

    static run(model: any) {
        const types = ['AcordionContainer', 'AnimationContainer',
            'AudioTermContainer', 'ChooseOption', 'CouplesContainer',
            'DragdropContainer', 'Image', 'ImageAndSoundContainer',
            'ImageAndText', 'Modal', 'SchemaContainer', 'TabsContainer',
            'Test', 'TrueFalseContainer'
        ];
        const widgets = Utils.findObjectsOfType(model, types);
        widgets
            .filter(widget => typeof widget?.params.help !== "string")
            .forEach(widget => widget.params.help = '');
    }
}