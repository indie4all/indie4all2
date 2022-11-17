const domloader = require('../domloader');

/** Widget instance */
let widgetContainer;

describe('Term classification container spec', () => {
    beforeAll(async function () {
        const dom = await domloader();
        widgetContainer = dom.indieauthor.widgets.TermClassification;
    });

    it('Should create empty data for container', () => {
        const containerData = widgetContainer.emptyData();
        expect(containerData.params).toBeDefined();
        expect(containerData.params.name).toBeDefined();
        expect(containerData.params.name).not.toEqual("");
        expect(containerData.params.help).toEqual("");
        expect(containerData.data.length).toEqual(0);
    });

    it('Should get duplicated columns in data', () => {
        expect(widgetContainer.functions.getDuplicatedColumn([])).toHaveSize(0);

        const columnTermsOk = [
            { data: { column: "This", terms: ["a", "b", "c"] } },
            { data: { column: "That", terms: ["d", "e", "f"] } },
            { data: { column: "Those", terms: ["g", "h", "i"] } }
        ];

        expect(widgetContainer.functions.getDuplicatedColumn(columnTermsOk)).toHaveSize(0);

        const columnTermsKo = [
            { data: { column: "This", terms: ["a", "b", "c"] } },
            { data: { column: "This", terms: ["d", "e", "f"] } },
            { data: { column: "This", terms: ["a1", "a3", "a2"] } },
            { data: { column: "That", terms: ["g", "h", "i"] } }
        ];

        const duplicatedColumns = widgetContainer.functions.getDuplicatedColumn(columnTermsKo);
        expect(duplicatedColumns).toHaveSize(1);
        expect(duplicatedColumns).toContain("This");
        expect(duplicatedColumns).not.toContain("That");

        const multipleColumnTermsKo = [
            { data: { column: "This", terms: ["a", "b", "c"] } },
            { data: { column: "This", terms: ["d", "e", "f"] } },
            { data: { column: "This", terms: ["a1", "a3", "a2"] } },
            { data: { column: "That", terms: ["g", "h", "i"] } },
            { data: { column: "That", terms: ["g1", "h1", "i1"] } },
            { data: { column: "Thie", terms: ["g2", "h2", "i2"] } }
        ];

        const multipleDuplicatedColumns = widgetContainer.functions.getDuplicatedColumn(multipleColumnTermsKo);
        expect(multipleDuplicatedColumns).toHaveSize(2);
        expect(multipleDuplicatedColumns).toContain("This");
        expect(multipleDuplicatedColumns).toContain("That");
        expect(multipleDuplicatedColumns).not.toContain("Thie");
    });

    it('Should get duplicated columns in term', () => {
        expect(widgetContainer.functions.getDuplicatedTerms([])).toHaveSize(0);

        const columnTermsOk = [
            { data: { column: "This", terms: ["a", "b", "c"] } },
            { data: { column: "That", terms: ["d", "e", "f"] } },
        ];

        expect(widgetContainer.functions.getDuplicatedTerms(columnTermsOk)).toHaveSize(0);

        const columnTermsWithAduplicated = [
            { data: { column: "This", terms: ["a", "b", "c"] } },
            { data: { column: "That", terms: ["a", "e", "f"] } },
        ];

        const duplicatedKo = widgetContainer.functions.getDuplicatedTerms(columnTermsWithAduplicated)

        expect(duplicatedKo).toHaveSize(1);
        expect(duplicatedKo).toContain("a");

        const multipleColumnTermsWithDuplicatedTermsKo = [
            { data: { column: "This", terms: ["a", "b", "c"] } },
            { data: { column: "That", terms: ["d", "a", "f"] } },
            { data: { column: "Those", terms: ["a", "b", "f"] } },
            { data: { column: "Thie", terms: ["a", "h", "i"] } }
        ];

        const multipleDuplicatedKo = widgetContainer.functions.getDuplicatedTerms(multipleColumnTermsWithDuplicatedTermsKo)

        expect(multipleDuplicatedKo).toHaveSize(3);
        expect(multipleDuplicatedKo).toContain("a")
        expect(multipleDuplicatedKo).toContain("b")
        expect(multipleDuplicatedKo).toContain("f")
    });
});