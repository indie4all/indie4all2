import './styles.scss';
import WidgetPiecesElement from "../WidgetPiecesElement/WidgetPiecesElement";

export default class WidgetAnimation extends WidgetPiecesElement {
    
    static widget = "Animation";
    static type = "element";
    static label = "Animation";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAz1BMVEUAAAB4h5oeN1YeN1Z4h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///94h5oeN1a7w8xhc4n5DVxWaIDu8PLHzdXV2d/x8vT3+Pnh5OjM0dn7+/zl6Oz+4evQ1dy/x8+Om6oqQl/a3uT9wtaqtL/8hq1ygpVHXHXz9Pbq7O/9pMKcp7X7Z5n6SYT6KnA5T2v4ts38dqNPY3snP13/8PXKwc38lbeAjqCebo/7WI7tPHr5G2bsD1zRFVt+JVmaH1lHL1e+6C3CAAAAEXRSTlMAQECAMPfg0GAQuqagl4BwMDhYLxIAAAF3SURBVEjHzdTZcoIwFIDhiFvtDokISUBEEMR9q93393+mhohgK5C0V/0vYJj55nAROCBOKe8aZFXrUFD9ZG/P/BlRS7MeYKIViFRhXr3FcXWkiiNQ2eFO+jbkFuojPHYnEjgvOpbGjouQ6XTLcNeyLQbooI94fUxT3G5cZtgwLMwFttFBeLzHmnaeYlSUnWKtxrE4jiv/DpOOj+Qne22LXe+nQpw11J9u2Q0TGTzV9eV6toJ+hEsxjiJTDXTWB4wbhfmYmuZsFIPVox739sn5KiQ52INpOu/1HfL88BgTM01Per7jj7j0UJZ7/bIWn+CCuV4QDDeL5UYGz6W/jSEbLI/ZYCEeIJwcYU+MjWRtBPNffM+9eDClApw1cRGynRLM14bzbW0MaD42DAdz8GNt0BxsoKJwzmRiFPXnv1ty8ydYgaYYe9uIY3Dqh0Qw14M32g6DCyhqyy3HoKWwrtrFccpxUk0TlmHQFNkGyKo1BbYGDquUxsAXPhWNRXY4UVUAAAAASUVORK5CYII=";
    static cssClass = "widget-animation";

    constructor(values) { super(values); }

    clone() { return new WidgetAnimation(this); }
}