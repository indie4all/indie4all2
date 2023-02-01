/* global $ */
import I18n from "./I18n";
import toastr from "toastr";
import ModelManager from "./model/ModelManager";

export default class Utils {

    static #b64() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    static generate_uuid() {
        return this.#b64() + this.#b64() + this.#b64();
    }

    static contains(a, b) {
        return a.contains ?
            a != b && a.contains(b) :
            !!(a.compareDocumentPosition(b) & 16);
    }

    static isStringEmptyOrWhitespace(str) {
        return str === null || (typeof str === "string" && str.trim().length === 0);
    }

    static toJSON(form) {

        var obj = {};
        var elements = form.querySelectorAll("input, select, textarea");
        elements.forEach(element => {
            const {name, value, type} = element;
            let matchedArray = name.match(/^([^[]*)\[(\d+)\](?:\[([^\]]+)\])?$/);
            if (matchedArray) {
                const [, field, position, subField] = matchedArray;
                if (!obj[field]) obj[field] = [];
                if (subField) {
                    if (!obj[field][position]) obj[field][position] = {};
                    if (type != 'radio' || element.checked)
                        obj[field][position][subField] = value;
                } else 
                    if (type != 'radio' || element.checked)
                        obj[field][position] = value;
            }
            else {
                if (name && (type != 'radio' || element.checked))
                    obj[name] = value;
            }
        });
        return obj;
    }

    static #notify(title, message, type) {
        toastr[type](message, title, {
            timeOut: 5000,
            positionClass: "toast-bottom-right"
        });
    }

    static notifySuccess(message) {
        const title = I18n.getInstance().translate("messages.successMessage");
        this.#notify(title, message, "success");
    }

    static notifyError(message) {
        const title = I18n.getInstance().translate("messages.errorMessage");
        this.#notify(title, message, "error");
    }
    
    static notifyWarning(message) {
        const title = I18n.getInstance().translate("messages.warningMessage");
        this.#notify(title, message, "warning");
    }

    static stringIsInArray(string, arrayStrings) {
        return arrayStrings.includes(string);
    }

    static clearDataAttributes(element) {
        $.each($(element).data(), function (i) {
            $(element).removeAttr("data-" + i);
        });
    }

    static isEmpty = function (obj) {
        return Object.keys(obj).length === 0;
    }

    static parseBoolean = function (string) {
        return string.toLowerCase() === "true";
    };

    static booleanToString(bool) {
        return typeof bool === "boolean" ? bool.toString() : null;
    }

    static findIndexObjectInArray(array, key, value) {
        return array.findIndex(elem => elem[key] == value);
    }

    static findObjectInArray = function (array, key, value) {
        return array.find(elem => elem[key] == value);
    }

    static array_move(arr, old_index, new_index) {
        if (new_index >= arr.length)
            arr.push(...new Array(new_index - arr.length + 1));
        [arr[new_index], arr[old_index]] = [arr[old_index], arr[new_index]];
    }

    static swap(elementOrigin, elementTarget) {
        const $target = $(elementTarget);
        const $replaced = $(elementOrigin).replaceWith($target.clone());
        $target.replaceWith($replaced);
    }

    static isURL(st) {
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/;
        return regex.test(st);
    }

    static isYoutubeVideoURL(url) {
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if (url.match(p)) {
            return url.match(p)[1];
        }
        return false;
    }

    static isUrlWithinDomains(url, allowedDomains) {
        if (!this.isURL(url))
            return false;
        return allowedDomains.some(dom => url.startsWith(dom));
    }

    static isIndieResource(url) {
        return this.isUrlWithinDomains(url, ["https://indiemedia.upct.es", "http://indieopen.upct.es", "https://multimediarepository.blob.core.windows.net"]);
    }

    static isValidBase64DataUrl(data) {
        const pattern = /^data:([-\w.]+\/[-\w.+]+)?;base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
        return typeof data === 'string' && data.match(pattern);
    }

    static hasNameInParams(widgetInstance) {
        return (widgetInstance.params && (widgetInstance.params.name && (widgetInstance.params.name.length > 0)));
    }

    static isInteractiveVideo(url) {
        return this.isUrlWithinDomains(url, ["https://indieopen.upct.es", "https://backendcpcd-servicio-gateway.azuremicroservices.io", "https://scgateway-cpcd-upct-gufcfdgzgee5fydr.z01.azurefd.net"]);
    }

    static encodeBlobAsBase64DataURL(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    static async encodeURLAsBase64DataURL(url) {
        const res = await fetch(url);
        return await this.encodeBlobAsBase64DataURL(res.blob());
    }

    static findAllElements(model) {

        let result = [...model.sections];
        let children = [...model.sections];
        do {
            children = children
                .filter(elem => ModelManager.hasChildren(elem))
                .flatMap(elem => elem.type === 'layout' ? elem.data.flat() : elem.data);
            result = result.concat(children);
        } while(children.length);
        return result;
    }

    static findElementsOfType(model, type) {
        return Utils.findAllElements(model)
            .filter(elem => Array.isArray(type) ? type.includes(elem.widget) : (type === elem.widget));                
    }

    static groupBy(collection, key) {
        return collection.reduce(function(accumulator, value) {
            (accumulator[value[key]] = accumulator[value[key]] || []).push(value);
            return accumulator;
        }, {});
    }
}