import template from "./template.hbs"
import WidgetElement from "../WidgetElement/WidgetElement";
import './styles.scss';

export default class WidgetThreeColumnsLayout extends WidgetElement {
    config = {
        widget: "ThreeColumnsLayout",
        type: "layout",
        allow: ["element", "specific-element-container"],
        category: "layouts",
        toolbar: { edit: false },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACl0lEQVRoge2Zz2vTYBjHv03nxG60HbTKQF6HIjqh4EUCYll3Ed0ObiJB1KIi7OJlu2jrSS+2N/VaEBERpHjw0kNPa9WDdSCC0MEu1v4Dc3N68Ffkicnc5HlnkkmSQT5QaNpv3/eTt8mTkCeCNQhVOwxgAv7SAfCs26p+lFmsSgtVuwNgevdgGvTyi1dv2jDFJ7ut6luphlC1m0LV9Hrzte43S59W9BP5a7pQtUWhasmNpBfvP6n5LmxB4kcnrpL4NOerCFXLAUieGR/x+VD+Q7y/D8dHjtD2Ke57xXpDwSCR2MBHCZSpTULp/8323m3JQqmSK5Qq66pIoKWT8X662M0CeF8oVS5Zn2+Vw4NW+gGtOm30cAn93Qf8KDxmf62cy0I5n3WVJb6P32azkYxAtHzhX/IXATRYaSx9wc8X8/zgx4bdZwFp1uZfPgTZStNkvcuPbI3iJEs4ycoIS55XhNJesSWl+Tr9ch7fxvh6Gi2eRrQ46SpLfI3n2aySHUZP7YZ7aSRixiAcEZFynzXl2GxG2BKWSkcye2zvtZOsMaGDrIzwRPSKUNorpHd5dMvJItLrq4KTrFlOWRIx46S2g/R+2naddpAlZNnN12mRNibkBz/oPmvuCAdX0x1J0wB/r5AMJ9nf0vazMsLq4RWhtFeE0l4RSnuFYjZlrAZNYKg/n0NfbAe/0t1WlaQbt+4+xPLK50A4P6010V7oYK8YZL+3LuMz7YXO7Mn89eSVs2M4tH/IU0kLWrR6c86QPrBPYGdqgM2t7SPS41TqJeasB31+sCs1YAhLepmNcnFqdPWGyeyQXuaShVJF92snOOxWD3nn1FsMD7vSMwEQpiPhHuxKl4tTDepVW+XRB2j+0XJxyq/5NwmAX7rmz3PWi3K4AAAAAElFTkSuQmCC"
    }

    createElement(widget) {
        return template({
            type: this.config.type,
            widget: this.config.widget,
            id: widget.id,
            icon: this.config.icon,
            columns: [4,4,4]
        });
    }

    emptyData() {
        return { data: [[],[], []] };
    }
    
    hasChildren() { return true; }

    validateModel(widget) {
        let error = widget.data.find(elem => elem.length == 0);
        if (error) return ["ColumnLayout.data.empty"];
        return [];
    }

    validateForm(form) { return []; }
}