/* global $ */
import Config from "./Config";
import I18n from "./I18n";
import { Model } from "./model/Model";
import ModelElement from "./model/ModelElement";

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

        const setInputValue = (object: any, element: HTMLInputElement, field: string): void => {
            const { name, value, type } = element;
            if (type == 'checkbox') object[field] = element.checked
            else if (type != 'radio' || element.checked)
                object[field] = value;
        }

        var obj: any = {};
        var elements = <NodeListOf<HTMLInputElement>>form.querySelectorAll("input, select, textarea");
        elements.forEach(element => {
            const { name, ...other } = element;
            let matchedArray = name.match(/^([^[]*)\[(\d+)\](?:\[([^\]]+)\])?$/);
            if (matchedArray) {
                const [, field, position, subField] = matchedArray;
                if (!obj[field]) obj[field] = [];
                if (subField) {
                    if (!obj[field][position]) obj[field][position] = {};
                    setInputValue(obj[field][position], element, subField);
                } else
                    setInputValue(obj[field], element, position);
            }
            else
                name && setInputValue(obj, element, name);
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

    static isValidResource(url: string): boolean {
        return this.isUrlWithinDomains(url, Config.getAllowedResourceOrigins());
    }

    static isValidVideoResource(url: string): boolean {
        const additionalRules = Config.getAdditionalVideoResourceRules();
        // The url belongs to an allowed origin and all the additional rules are fulfilled
        return this.isUrlWithinDomains(url, Config.getAllowedResourceOrigins()) && additionalRules.every(rule => rule(url));
    }

    static isValidBase64DataUrl(data: any): boolean {
        const pattern = /^data:([-\w.]+\/[-\w.+]+)?;base64,[A-Za-z0-9+/]*={0,2}?$/;
        return typeof data === 'string' && new RegExp(pattern).test(data);
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

    static async base64DataURLToURL(base64: string): Promise<string> {
        const resourceBackend = Config.getResourceBackendURL();
        if (!resourceBackend)
            throw new Error("Conversion from base64 to remote url is not supported");

        const blob = await fetch(base64).then(res => res.blob());
        const headers = new Headers();
        headers.append("Content-Type", "application/octet-stream");
        headers.append("Accept", "application/json, application/octet-stream");
        return await fetch(resourceBackend, { method: 'POST', headers, body: blob, redirect: 'follow' }).then(response => response.text());
    }

    static findAllElements(model: Model): ModelElement[] {

        let result: ModelElement[] = [...model.sections];
        let children: ModelElement[] = [...model.sections];
        do {
            children = children
                .filter(elem => (<typeof ModelElement>elem.constructor).hasChildren())
                .flatMap(elem => elem.data.flat());
            result = result.concat(children);
        } while (children.length);
        return result;
    }

    static findElementsOfType<T extends ModelElement>(model: Model, typeT: new () => T): T[] {
        return Utils.findAllElements(model).filter(elem => elem instanceof typeT).map(elem => elem as T);
    }

    static findAllObjects(model: any): any[] {

        const hasChildren = (obj: any): boolean => {
            if (!obj.data) return false;
            if (!Array.isArray(obj.data)) return false;
            return obj.data.every((elem: any) => elem.widget) ||
                obj.data.every((arr: any) => Array.isArray(arr) &&
                    arr.every(elem => elem.widget))
        };

        let result: any[] = [...model.sections];
        let children: any[] = [...model.sections];
        do {
            children = children.filter(elem => hasChildren(elem)).flatMap(elem => elem.data.flat());
            result = result.concat(children);
        } while (children.length);
        return result;
    }

    static findObjectsOfType(model: any, type: string | string[]): any[] {
        return this.findAllObjects(model).filter(obj => Array.isArray(type) ?
            type.includes(obj.widget) : type === obj.widget);
    }

    static groupBy({ collection, key }: { collection: any[]; key: string; }): { [key: string]: any[] } {
        return collection.reduce(function (accumulator, value) {
            (accumulator[value[key]] = accumulator[value[key]] || []).push(value);
            return accumulator;
        }, {});
    }

    static toKebabCase(text: string): string {
        return text.split(/(?=[A-Z])/).join('-').toLowerCase();
    }

    static resourceURL(resource: string): string {
        let url = resource;
        if (Config.getResourceProxyBackendURL())
            url = Config.getResourceProxyBackendURL() + "?resource=" + url;
        return url;
    }

    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }
}