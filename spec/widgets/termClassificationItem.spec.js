const domloader = require('../domloader');

/** Widget instance */
let widgetItem;

describe('Term classification item spec', () => {
    beforeAll(async function () {
        const dom = await domloader();
        widgetItem = dom.indieauthor.widgets.TermClassificationItem;
    });

    it('Should create empty data for item', () => {
        const containerData = widgetItem.emptyData();
        expect(containerData.params).not.toBeDefined();
        expect(containerData.data.column).toEqual("");
        expect(containerData.data.terms.length).toEqual(0);
    });

    it('Item should parse terms in a string separated by semicolon', () => {
        const emptyTerms = widgetItem.functions.parseTerms("");
        expect(emptyTerms.length).toEqual(0);

        const onlyOneTerm = widgetItem.functions.parseTerms("term");
        expect(onlyOneTerm.length).toEqual(1);

        const twoTerms = widgetItem.functions.parseTerms("one;two");
        expect(twoTerms.length).toEqual(2);
        expect(twoTerms[0]).toEqual("one");
        expect(twoTerms[1]).toEqual("two");

        const multipleTerms = widgetItem.functions.parseTerms("one;two;three;four;five");
        expect(multipleTerms.length).toEqual(5);
    });

    it('Item should parse terms with whitespaces inside in a string separated by semicolon', () => {
        const twoTerms = widgetItem.functions.parseTerms("one;this two");
        expect(twoTerms.length).toEqual(2);
        expect(twoTerms[0]).toEqual("one");
        expect(twoTerms[1]).toEqual("this two");

        const whiteSpaceTerms = widgetItem.functions.parseTerms("one  ;this    is     two");
        expect(whiteSpaceTerms.length).toEqual(2);
        expect(whiteSpaceTerms[0]).toEqual("one");
        expect(whiteSpaceTerms[1]).toEqual("this is two");
    });

    it('Should reduce terms from array to string', () => {
        const someTermsArray = ["one", "two", "three"];
        const reducedSomeTerms = widgetItem.functions.reduceTerms(someTermsArray);
        expect(reducedSomeTerms).toEqual("one;two;three");
    });

    it('Should remove duplicated terms', () => {
        const multipleTerms = widgetItem.functions.parseTerms("one;two;two;four;two");
        expect(multipleTerms.length).toEqual(3);
        expect(multipleTerms[0]).toEqual("one");
        expect(multipleTerms[1]).toEqual("two");
        expect(multipleTerms[2]).toEqual("four");
    });
});