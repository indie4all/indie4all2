import './styles.scss';
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";

export default class WidgetFourColumnsLayout extends WidgetColumnsLayout {
    config = {
        widget: "FourColumnsLayout",
        type: "layout",
        allow: ["element", "specific-element-container"],
        category: "layouts",
        toolbar: { edit: false },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADB0lEQVRoBe2ZQWjTUBjHv7bbxG60HVRlIHEoohMKXiQglnUX0e3gBhKEWlSEXrxsF2096cX2pl4LIqIdUkS9VOhprfVgHYgw6GQXa64Kc3PuoLaRL/R176XJW1YliZAfFPL6T9Lfe0m+PPo8QCGI0nEAmAZ7aQDAS7lW+GZk0ZEWROkuAMzuH9kD+LGLt+/r0BafkWuFD4YagijdEkRJKVXeKXaz9n1DOZO4rgiitCqIUognvfrgadF2YQKKn5y+huKzer5eQZRiABA6PzVu8628RWBoEE6Pn8D2Ob3cSzZwRycR5Ph4HWVqElf6X7NroD+UyuRiqUyOqSKOlg4FhvBltwAAn1KZ3GXy/f9ye+BIP8RRx0Yfb8/fU3eYti8bB0/kgLqtLH2GZirP5H3Fm53tVr4Krflqp+2JCODLXuy0m6knoCzJhrkBlwCgzJVuVZdZ6bXNrcbaZldOo8hfmVx7SVGYlxswCtuN9MD6Y8PMc2qMm/vSM+rHCPqq7BS35FmFK20V3AexmXnB9jAeBY8QVrfV6pCvMjn94ClvlqFV/dhp43F4PAGPxXMY5Ty2kX7OSkePArSlQf7SldPSKEzn3ugYKz1fZUueJu9Zuv8VW5bIi4Vsa3MaFFA7SQj62Q5m42zd1+Q9S2MtNiTo5+bqbUSuil5ODcBOcauHVbjSVsF9EH8GEkwbqwV5+LAO/5pkp670BAprvLbk0ZMknPZqS57ZSRRXGk/EQJeloL87p1BfFlSO82UmjwjMZdbmPUvzeo4li5erdZrzsjAx4Tc+d89H2ogrbRWutFW40lbhSluFt70oQxZoHEPp9SIM+nfrj7RcK6B0+fa9R7C+8cMRzs+KFaivNOCgMKKbk7nHXH2lsXA2cSN09cIkHDs8aqkkAQetVFlUpY8cEmBveFh3P3odEf9OxbXEGPmjzw72hYdVYYO1zHI2nZzozPLaK6RX9PZMZXKKXZ3Qw2z1MF45tRbVw6z0nAOE8U64D2als+lkGdeqSXm0Afz9iWw6adfv/yUA8AcZbfJgqCxy0gAAAABJRU5ErkJggg==",
        columns: [3,3,3,3]
    }

    emptyData() {
        return { data: [[],[], [], []] };
    }
}