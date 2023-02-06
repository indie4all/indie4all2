import "./styles.scss";
import WidgetPiecesElement from "../WidgetPiecesElement/WidgetPiecesElement";

export default class WidgetPuzzle extends WidgetPiecesElement {

    static widget = "Puzzle";
    static type = "element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAMAAABADLOjAAABAlBMVEUAAAAeN1YeN1Z4h5oeN1YeN1Z4h5oeN1YeN1Z4h5oeN1Z4h5pOYXl4h5p4h5olPVseN1YeN1YeN1Z4h5oeN1Z4h5p4h5p4h5r////WBUt4h5oeN1aPm6vHzdVWaYA1S2f40t77X5P8+fr9tc79ob/XBUvx8/T57/L46u/35Or8lbf8j7T8faj7Z5n5GWTiBk/gBk79/Pz79/j69Pb45uz9q8b8h677TohIXXb6LnM6UGv5EV/dBU3ZBUz43+f32eO5wcr9rsmdqLX7bZ1CV3L6KG76JWzqBlL42OL6ydmrtMD8mbr8ibD8c6GAj6BygpX7WI9ic4lcboX6P336Nnf1BlbkOH6qAAAAGHRSTlMAQIC/v+9AMBDv35cg38/Pn49wYGBQMBBrtB48AAABj0lEQVRIx+3SV3eCMBgGYGrd2r2Q1CooIhS1de+67d79/3+lJJ8UQg+J3vWi7wXnPeQxhiSClUiAk+Oo8JMD1L1gB8UjNg6gkchJoR2yZw9NmBJ49xDwFiqI/DwHbS2ukfO/o/fCZxvojBQ7onUxi3ODqwbVrSUpTOleiqRu1bJK6pDSCUrLRNySvymTrlF6m9ImBo/QDaJFhs5j0IR+iXuPpRtkviyu+heuMkvniFZL+fxTiqTko4emoRDtBHRuOr72at0aalWbXt1THqydNLzaJINL/Lhy8+UAPxWP/rTeVQDYmryBFD1adljfts4Pa7SG7zPmFZjQTr/f/FBhHx0Nh7HI4tOhsxAVWX2t0RoHb9PvHYQBr4aMCSk3tJpuprhnCSupO/ekw9Ag5tB17h2cYjCoum5YlaE7RLQUq94N4FwYWiaigxfegg/WfLRP/jVfJ1F6Dd2egRaC7QIX36O3lY6EupM0M6MXNJNWWojuxxE7mXcJtBOJE1rvcnXCpcM8HEsKrpzssNdxKmyYb5RBwWFBnx50AAAAAElFTkSuQmCC";
    static cssClass = "widget-puzzle";

    constructor(values) { super(values); }

    clone() { return new WidgetPuzzle(this); }
}
