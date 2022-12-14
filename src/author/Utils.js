import I18n from "./I18n";
import toastr from "toastr";

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
        for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            var name = element.name;
            var value = element.value;
            var type = element.type;

            let matchedArray = name.match(/^([^[]*)\[(\d+)\](?:\[([^\]]+)\])?$/);
            if (matchedArray)
            {
                let field = matchedArray[1];
                let position = matchedArray[2];
                let subField = matchedArray.length > 3 ? matchedArray[3] : null;
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
        }
        return obj;
    }

    static #notify(title, message, type) {
        toastr[type](message, title, {
            timeOut: 50000,
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
        switch (string.toLowerCase()) {
            case "true": return true;
            case "false": return false;
            default: return void 0;
        }
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
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }

    static swap(elementOrigin, elementTarget) {
        var div1 = $(elementOrigin);
        var div2 = $(elementTarget);

        var tdiv1 = div1.clone();
        var tdiv2 = div2.clone();

        if (!div2.is(':empty')) {
            div1.replaceWith(tdiv2);
            div2.replaceWith(tdiv1);
        }
    }

    static isURL(st) {
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
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

        for (var i = 0; i < allowedDomains.length; i++) {
            var allowedDomain = allowedDomains[i];
            if (url.startsWith(allowedDomain))
                return true;
        }

        return false;
    }

    static isIndieResource(url) {
        return this.isUrlWithinDomains(url, ["https://indiemedia.upct.es", "http://indieopen.upct.es", "https://multimediarepository.blob.core.windows.net"]);
    }

    static isValidBase64DataUrl(data) {
        const pattern = /^data:([-\w.]+\/[-\w.+]+)?;base64\,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
        return typeof data === 'string' && data.match(pattern);
    }

    static isOnlyOneWord(string) {
        if (!string) return false;
        string = string.trim();
        var splited = string.split(" ");
        return (splited.length == 1);
    }

    static getNumber(number) {
        return number;
    }

    static hasNameInParams(widgetInstance) {
        return (widgetInstance.params && (widgetInstance.params.name && (widgetInstance.params.name.length > 0)));
    }

    static isInteractiveVideo(url) {
        return this.isUrlWithinDomains(url, ["https://indieopen.upct.es", "https://backendcpcd-servicio-gateway.azuremicroservices.io", "https://scgateway-cpcd-upct-gufcfdgzgee5fydr.z01.azurefd.net"]);
    }

    static getAllUrlParams(url) {
        var queryString = url.split('?')[1];

        // we'll store the parameters here
        var obj = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');

                // set parameter name and value (use 'true' if empty)
                var paramName = a[0];
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {

                    // create key if it doesn't exist
                    var key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) obj[key] = [];

                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        var index = /\[(\d+)\]/.exec(paramName)[1];
                        obj[key][index] = paramValue;
                    } else {
                        // otherwise add the value to the end of the array
                        obj[key].push(paramValue);
                    }
                } else {
                    // we're dealing with a string
                    if (!obj[paramName]) {
                        // if it doesn't exist, create property
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                        // if property does exist and it's a string, convert it to an array
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        // otherwise add the property
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }

        return obj;
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

    static renderTemplate(template, model) {
        var templateInstance = Handlebars.compile(template);
        var html = templateInstance(model);
        return html;
    }
}



