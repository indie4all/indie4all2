/* global $ */
import I18n from "./I18n";
import { Model } from "./model/Model";
import ModelElement from "./model/ModelElement";
import ModelManager from "./model/ModelManager";
import WidgetColumnsLayout from "./model/widgets/WidgetColumnsLayout/WidgetColumnsLayout";

export default class Utils {

    private static b64(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    static generate_uuid(): string {
        return this.b64() + this.b64() + this.b64();
    }

    static contains(a: HTMLElement, b: HTMLElement): boolean {
        return a.contains ?
            a != b && a.contains(b) :
            !!(a.compareDocumentPosition(b) & 16);
    }

    static isStringEmptyOrWhitespace(str: string): boolean {
        return str === null || (typeof str === "string" && str.trim().length === 0);
    }

    static toJSON(form: HTMLElement): any {

        var obj: any = {};
        var elements = <NodeListOf<HTMLInputElement>>form.querySelectorAll("input, select, textarea");
        elements.forEach(element => {
            const { name, value, type } = element;
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

    private static notify(title: string, message: string, type: "success" | "error" | "warning") {
        import('toastr/build/toastr.css')
            .then(() => import("toastr"))
            .then(({ default: toastr }) => {
                toastr[type](message, title, {
                    timeOut: 5000,
                    positionClass: "toast-bottom-right"
                });
            });
    }

    static notifySuccess(message: string) {
        const title = I18n.getInstance().value("messages.successMessage");
        this.notify(title, message, "success");
    }

    static notifyError(message: string) {
        const title = I18n.getInstance().value("messages.errorMessage");
        this.notify(title, message, "error");
    }

    static notifyWarning(message: string) {
        const title = I18n.getInstance().value("messages.warningMessage");
        this.notify(title, message, "warning");
    }

    static stringIsInArray(string: string, arrayStrings: string[]) {
        return arrayStrings.includes(string);
    }

    static isEmpty = function (obj: object) {
        return Object.keys(obj).length === 0;
    }

    static parseBoolean = function (string: string) {
        return string.toLowerCase() === "true";
    };

    static findIndexObjectInArray(array: any[], key: string, value: any) {
        return array.findIndex(elem => elem[key] == value);
    }

    static findObjectInArray = function (array: any[], key: string, value: any) {
        return array.find(elem => elem[key] == value);
    }

    static array_move(arr: any[], old_index: number, new_index: number) {
        if (new_index >= arr.length)
            arr.push(...new Array(new_index - arr.length + 1));
        [arr[new_index], arr[old_index]] = [arr[old_index], arr[new_index]];
    }

    static swap(elementOrigin: HTMLElement, elementTarget: HTMLElement) {
        const $target = $(elementTarget);
        const $replaced = $(elementOrigin).replaceWith($target.clone());
        $target.replaceWith($replaced);
    }

    static isURL(st: string): boolean {
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/;
        return regex.test(st);
    }

    static isYoutubeVideoURL(url: string): boolean {
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return !!url.match(p);
    }

    static isUrlWithinDomains(url: string, allowedDomains: string[]): boolean {
        if (!this.isURL(url))
            return false;
        return allowedDomains.some(dom => url.startsWith(dom));
    }

    static isIndieResource(url: string): boolean {
        return this.isUrlWithinDomains(url, ["https://indiemedia.upct.es", "http://indieopen.upct.es", "https://multimediarepository.blob.core.windows.net"]);
    }

    static isValidBase64DataUrl(data: any): boolean {
        const pattern = /^data:([-\w.]+\/[-\w.+]+)?;base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
        return typeof data === 'string' && !!data.match(pattern);
    }

    static hasNameInParams(widgetInstance: any): boolean {
        return (widgetInstance.params && (widgetInstance.params.name && (widgetInstance.params.name.length > 0)));
    }

    static isInteractiveVideo(url: string): boolean {
        return this.isUrlWithinDomains(url, ["https://indieopen.upct.es", "https://backendcpcd-servicio-gateway.azuremicroservices.io", "https://scgateway-cpcd-upct-gufcfdgzgee5fydr.z01.azurefd.net"]);
    }

    static encodeBlobAsBase64DataURL(blob: Blob): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    static async encodeURLAsBase64DataURL(url: string): Promise<string | ArrayBuffer | null> {
        const res = await fetch(url);
        const blob = await res.blob();
        return await this.encodeBlobAsBase64DataURL(blob);
    }

    static findAllElements(model: any) {

        let result: any[] = [...model.sections];
        let children: any[] = [...model.sections];
        do {
            children = children
                .filter(elem => ModelManager.hasChildren(elem))
                .flatMap(elem => WidgetColumnsLayout.isPrototypeOf(ModelManager.get(elem.widget)) ? elem.data.flat() : elem.data);
            result = result.concat(children);
        } while (children.length);
        return result;
    }

    static findElementsOfType(model: any, type: string | string[]): any[] {
        return Utils.findAllElements(model)
            .filter(elem => Array.isArray(type) ?
                type.includes((<typeof ModelElement>elem.constructor).widget) :
                (type === (<typeof ModelElement>elem.constructor).widget));
    }

    static groupBy({ collection, key }: { collection: any[]; key: string; }): { [key: string]: any[] } {
        return collection.reduce(function (accumulator, value) {
            (accumulator[value[key]] = accumulator[value[key]] || []).push(value);
            return accumulator;
        }, {});
    }
}