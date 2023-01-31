import form from "./form.hbs";
import "./styles.scss";

import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetBlockquote extends WidgetItemElement {

    static widget = "Blockquote";
    static type = "element";
    static label = "Blockquote";
    static category = "simpleElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAwCAYAAABuZUjcAAAACXBIWXMAAAsSAAALEgHS3X78AAADIUlEQVRoBe2ZX0hTURzHv/snoTYTLB+qmwRFGZYVsiD/TAgV6cEeWpGNJGLVXtKXcFAvQW0vMXrxYfTHFwktwqAkn1RWkEEgFBr2so2gB3tw/tmD5m78bt65/57dde5m7AOXnXvO714+99yzcznnh62KJtpbMFm6AdwCUJXj5xkG0BOYHPKlCoiICybLMwBdVy+2o7WxTjXDeH78nMOTwRFMz/rmATQHJoemUgYLJotZMFnE0YlPYj4QXFwS26y3RcFkGUvlrF3/vdLSVIeWHPZ0NMbSEjy8e5NqqEOTDltZvOrIgVwP61iqN3zSim85mMXF9zMQv/iTtq31jar+3GziwRB+3/BA9P9KaCLp8ICXg1p69CxBawNeaPbthPbsycQ25ysYnndzE2w0HXPv6ThD8/kjl8M2Ltcz9TjJhb0zWDFasbL3+kY9DZFgCKvtD6Q2HkOmyKCvBdABYKzX6enKSJzkNi3Hx/HBnZl4/rCj1+kxM4trhIpNy/FxvGH6cxq+upPWazsbUNTZkJPX8f9/gPKNgrjabFlxplmFViV08OLUiWo+4i/fTsD9+AU3cf/HwYyvYRKnHum5dl6JEzeYxZW8Tp4UZhW1KYirDTfx1dN3/q6YjFapLBN+8zlSTwedK4GbePSOQGw5EBcXe85KYagkUFa8UZOqHN+WAUwfICUYPtwHAnPSfoy2szFyB529FdqjAsLeb1jrewedwhUUtx6X159iMCTJxrTVH5Z2xnT2NsU9zn2M612Xk8ppaoSEB8rovll6pYV6VlOfPEJHD5QFhVlFbSLiwaXlvBLbbMUli7+mVc5CHsmTT5FBj10V5UnbZfH+hcXl+Qv2e1zXlqw8HRyRloo1h/anvCQ6XUjbuZQyrK0+WAVjqbL5NVumv/uxsLgsSacQb6Z98sh0uJ5PPE6pw+lZnzk6Uthd2VS2vcScpRMTlLSqrChHSfG2tHEJ83hgcoh2/cej6y45PZRyUEWcAUrcMk+Hw/IFOcbnctimmMVdDhvlYHpyLE0dd04+0aSPjaXX6aFkaVcm1/wjSLrf5bDlw1vPAgB/AO1fcZ9mjVkZAAAAAElFTkSuQmCC";
    static cssClass = "widget-blockquote";

    constructor(values) {
        super(values);
        this.data = values?.data ?? { quote: "", caption: "", alignment: "", source: "" };
    }

    clone() {
        return new WidgetBlockquote(this);
    }

    getInputs() {
        return {
            inputs: form({
                instanceId: this.id,
                caption: this.data.caption,
                quote: this.data.quote,
                alignment: this.data.alignment,
                source: this.data.source
            }),
            title: this.translate("widgets.Blockquote.label")
        };

    }

    preview() {
        return this.data?.quote ? this.data.quote : this.translate("widgets.Blockquote.prev");
    }

    updateModelFromForm(form) {
        this.data.quote = form.quote;
        this.data.caption = form.caption;
        this.data.alignment = form.alignment;
        this.data.source = form.source;
    }

    validateModel() {
        const errors = [];
        if (this.data.quote.length == 0)
            errors.push("Blockquote.quote.invalid");
        return errors;
    }

    validateForm(form) {
        if (form.quote.length == 0)
            return ["Blockquote.quote.invalid"];
        return [];
    }
}