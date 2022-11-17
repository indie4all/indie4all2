const domloader = require('../domloader');

/** Widget instance */
let widget;

describe('TextBlock widget', function () {
    beforeAll(async function () {
        const dom = await domloader();
        widget = dom.indieauthor.widgets.TextBlock;
    });

    it('Should be defined', function () {
        expect(widget).toBeDefined();
        expect(widget.widgetConfig.widget).toBe('TextBlock');
    });
});