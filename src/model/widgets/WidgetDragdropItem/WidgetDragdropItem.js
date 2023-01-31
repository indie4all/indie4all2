import form from "./form.hbs";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetDragdropItem extends WidgetItemElement {

    static widget = "DragdropItem";
    static type = "specific-element";
    static label = "Drag And Drop Item ";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACrUlEQVRoge2ZT2jTUBzHv02noq21g04pSDoU/6wgiCIZoq47KG4TXGXGwRjzH7146S7a3PRie3OCp6KIB4fUgV6K9LTWKloHxYsd1IMllx0czq2rF7GRV5a62pcYsSYp5AOB9JeX9z55fby8l58N62A5/iCAYRhLCcBzMZf4qmRRl2Y5/g6A8E5vF8hhFG/zBayJB8Vc4r2iBsvxN1mOl1KZd5LRLJdXpdPj1yWW45dYjnerSS89eJI0XFiGiB8dvkbEwzRfhuX4AAD3yFCfwUP5Fy6nA6f6jpDfZ2nXGfmEFDQT21R8GFOZasSSbjWbNm5wR6LxQCQab5hFTC3tdjnJy24WwKdINH5RjrfL8CA9/ZD0OtpwTE+gDaW7Yc0eOmJJ60VbSnfQgtKr+aaY7ViPakVT92eo8cujAy1fjDVJE+Hvg7ebCtqFc7ALQWolZLfxNJnG+aFAQ5zEeg/5a0crofY0DUn8TP0HCM6iiJOME+GrIw3xN/kP9fPq4yyq01nVNuyxMdgO+P7ool06O48f4iL1mrdcQXDhi/r94iKqWfpDy9iXv2ly0SzNjJ1QHB4f8wXcmnqEF2pCQlDx/r+lWZrtAnPmMPDbUzPH9ytW7d/rw0q5Al/vhYa4a6vjv+zsm6RtrAcd09T9pCJkq/b62b2WyylhvVz0wpLWC0taLyxpvbCk9cKS1ou2lSZJGTlBYxpSL+fg2LKZLi3mEkQ6TRbxK6sVUzjPJDMoFEvYxXqp1+X19GShWJodGL/hvjI6CP+ebl0lZUinpTJzNel9u1ls93RSy63PI5LPqSSXGJA/9BnBDk9nTVhhx5OOCaH++s5lLUN6iVYyEo1LRj0EDa2zh3LmVF9qHlqlJ00gTEbCXWiVjgmhNMlVy9OjAZD2+2NCyKj2/xEAPwGP2L6VdBBYHQAAAABJRU5ErkJggg==";
    static cssClass = "widget-dragdrop-item";

    constructor(values) {
        super(values);
        this.data = values?.data ?? { term: "", definition: "" };
    }

    clone() {
        return new WidgetDragdropItem(this);
    }

    getInputs() {
        var data = {
            instanceId: this.id,
            term: this.data ? this.data.term : '',
            definition: this.data ? this.data.definition : ''
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.DragdropItem.label")
        };
    }

    preview() {
        return this.data?.term && this.data?.definition ?
            `<p><b>${this.data.term}</b><span> -> ${this.data.definition}</span></p>` :
            this.translate("widgets.DragdropItem.prev");
    }

    updateModelFromForm(form) {
        this.data.term = form.term;
        this.data.definition = form.definition;
    }

    validateModel() {
        var errors = [];
        if (this.data.term.length == 0) errors.push("DragpdropItem.term.invalid");
        if (this.data.term.definition == 0) errors.push("DragpdropItem.definition.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (form.term.length == 0) errors.push("DragpdropItem.term.invalid");
        if (form.term.definition == 0) errors.push("DragpdropItem.definition.invalid");
        return errors;
    }
}
