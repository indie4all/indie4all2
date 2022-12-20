import I18n from "../I18n"
export default function(query) {
    return I18n.getInstance().translate(query);
}