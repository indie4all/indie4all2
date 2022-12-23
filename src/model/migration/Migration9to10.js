import Utils from "../../Utils";

export default class Migration9to10 {

    static run(model) {
        const columns = Utils.findElementsOfType(model, "ColumnLayout");
        const texts = Utils.findElementsOfType(model, "TextBlock");
        texts.filter(text => !text.data?.style).forEach(text => text.data.style = 'default');
        // Cast ColumnLayout to TwoColumnsLayout / ThreeColumnsLayout / FourColumnsLayout depending on the 
        // number of columns
        columns.forEach(column => {
            if (!column.params.columns)
                throw new Error("Number of columns not known");
            const columns = Math.round(column.params.columns);
            delete column.params.columns;
            switch (columns) {
                case 2: 
                    column.widget = "TwoColumnsLayout";
                    column.params.firstColumnWidth = "6";
                    break;
                case 3: column.widget = "ThreeColumnsLayout"; break;
                case 4: column.widget = "FourColumnsLayout"; break;
                default: throw new Error("Unsupported number of columns.")
            }
        })
    }
}