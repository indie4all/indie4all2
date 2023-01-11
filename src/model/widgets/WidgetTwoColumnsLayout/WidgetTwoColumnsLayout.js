/* global $ */
import form from "./form.hbs"
import './styles.scss';
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import Utils from "../../../Utils";

export default class WidgetTwoColumnsLayout extends WidgetColumnsLayout {
    config = {
        widget: "TwoColumnsLayout",
        type: "layout",
        allow: ["element", "specific-element-container"],
        category: "layouts",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACMElEQVRoBe2ZQUgUURjH/06mlGIjbIkgDykk6tRFBgJxvUTWIQUZhJAMYS9d9GK7nuw0eyuvCxERRSxRXfawJ3fbi6sQnVbw0rLnwDQ7uhPf4KjBzJvRHd6bhfeDBzM73/fmN4/HN8t8HTgFM8w7AKYglzqAr41q/refxbE0M8yXABaHBq+Chiw2vtdwJD7dqOZ/+Goww1xlhmkXy5u2bPb+HNj355ZtZpi7zDB1nvTu648F6cIuJH536hmJL3r5aswwkwD0mYfjkrfyCX29Pbg3Pkrnj7yua+4BBcaJKxwfLVamIVHSUdPddVFPW7lk2sr9V0ViLa339dLLbh3Az7SVm3d/b5ftQSv9hladTjqDopvvK2h+qHBjOgsrkef68ARAKVDabvxCs7J9lokjyfVhGGFW+kJm2hnnoZVcHqrkiUJJi6ItpQOrx6H1BYfWZ25M1/67yHN5BEp3sAS0sVtnnrjVXB6B0trjMWech1ZyuU6RzygAJS0KJS0KVaejzOWh6rQolLQolLQolLQo2laamjJugyY2FL9toefyJW/pRjVP0qUXr95i/+BvLJw/Fcqo7dRxnQ16Xndf40u1nfr65NxzfWH2AW6PDAuVdKFFK5a3HOmbNxiuJfo94073EelzKvUSk+6HPhkMJPodYZ9eZimbSU0c/2E66pA+9YpMWzlb1kN4EbZ6+HdOxeJ4hJVeioEw7YQ1hJXOZlIl6lW75VECdP+JbCYl6/4tAuAfoamvJZHAyOIAAAAASUVORK5CYII=",
        columns: [6, 6]
    }

    emptyData(id) {
        return { 
            id: id ?? Utils.generate_uuid(),
            type: this.config.type,
            widget: this.config.widget,
            params: { firstColumnWidth: 6} , data: [[],[]] };
    }

    getInputs(model) {
        const data = {
            instanceId: model.id,
            width: model.params.firstColumnWidth
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.ColumnLayout.label")
        }
    }

    settingsClosed(modelObject) {
        const width = $('#column-layout-width-1').val();
        const $container = $(`[data-id="${modelObject.id}"]`).find('.row');
        const $firstColumn = $container.children().eq(0);
        const $secondColumn = $container.children().eq(1);
        $firstColumn.removeClass().addClass(`col-${width}`);
        $secondColumn.removeClass().addClass(`col-${12 - width}`);
    }

    updateModelFromForm(model, form) {
        model.params.firstColumnWidth = form.width;
    }

    validateModel(widget) {
        const errors = [];
        const emptyElement = widget.data.find(elem => elem.length == 0);
        if (emptyElement) errors.push("ColumnLayout.data.empty");
        const width = widget.params?.firstColumnWidth;
        if ( !/^\d{1,2}$/.test(width) || parseInt(width) < 1 || parseInt(width) > 11)
            errors.push("ColumnLayout.width.invalid");
        return errors;
    }

    validateForm(form) { 
        if ( !/^\d{1,2}$/.test(form.width) || parseInt(form.width) < 1 || parseInt(form.width) > 11)
            return ["ColumnLayout.width.invalid"]
        return []; 
    }
}