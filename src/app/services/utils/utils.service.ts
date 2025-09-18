/* global $ */
import { inject, injectable } from "inversify";
import Config from "../../../config";
import I18nService from "../i18n/i18n.service";
import Element from "../../elements/element/element";
import { Model } from "../../elements/model";

@injectable()
export default class UtilsService {

    constructor(@inject(I18nService) private i18n: I18nService) { }

    private b64(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    generate_uuid(): string {
        return this.b64() + this.b64() + this.b64();
    }

    /**
     * Converts an ArrayBuffer to a string
     * @param buf the ArrayBuffer to convert
     * @returns the string
     */
    public ab2str(buf: ArrayBuffer): string {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    /**
     * Converts a string to an ArrayBuffer
     * @param str the string to convert
     * @returns the ArrayBuffer
     */
    public str2ab(str: string): ArrayBuffer {
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    contains(a: HTMLElement, b: HTMLElement): boolean {
        return a.contains ?
            a != b && a.contains(b) :
            !!(a.compareDocumentPosition(b) & 16);
    }

    isStringEmptyOrWhitespace(str: string): boolean {
        return str === null || (typeof str === "string" && str.trim().length === 0);
    }

    toJSON(form: HTMLElement): any {

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

    private notify(title: string, message: string, type: "success" | "error" | "warning") {
        import('toastr/build/toastr.css')
            .then(() => import("toastr"))
            .then(({ default: toastr }) => {
                toastr[type](message, title, {
                    timeOut: 5000,
                    positionClass: "toast-bottom-right"
                });
            });
    }

    notifySuccess(message: string) {
        const title = this.i18n.value("messages.successMessage");
        this.notify(title, message, "success");
    }

    notifyUnauthorizedError(message: string) {
        const title = this.i18n.value("messages.unauthorizedMessage");
        this.notify(title, message, "error");
    }

    notifyError(message: string) {
        const title = this.i18n.value("messages.errorMessage");
        this.notify(title, message, "error");
    }

    notifyWarning(message: string) {
        const title = this.i18n.value("messages.warningMessage");
        this.notify(title, message, "warning");
    }

    stringIsInArray(string: string, arrayStrings: string[]) {
        return arrayStrings.includes(string);
    }

    isEmpty = function (obj: object) {
        return Object.keys(obj).length === 0;
    }

    parseBoolean = function (string: string) {
        return string.toLowerCase() === "true";
    };

    findIndexObjectInArray(array: any[], key: string, value: any) {
        return array.findIndex(elem => elem[key] == value);
    }

    findObjectInArray = function (array: any[], key: string, value: any) {
        return array.find(elem => elem[key] == value);
    }

    array_move(arr: any[], old_index: number, new_index: number) {
        if (new_index >= arr.length)
            arr.push(...new Array(new_index - arr.length + 1));
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }

    swap(elementOrigin: HTMLElement, elementTarget: HTMLElement) {
        const $target = $(elementTarget);
        const $replaced = $(elementOrigin).replaceWith($target.clone());
        $target.replaceWith($replaced);
    }

    isURL(st: string): boolean {
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/;
        return regex.test(st);
    }

    isYoutubeVideoURL(url: string): boolean {
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return !!url.match(p);
    }

    isPublicMediaVideoURL(url: string): boolean {
        const indieMediaURL = Config.getIndieMediaURL();
        if (!indieMediaURL) return false;
        const pattern = /\/videoCC\/[0-9a-zA-Z]{1,64}\/VIDEO/
        return url.startsWith(indieMediaURL) && !!url.match(pattern);
    }

    getPublicMediaVideoId(url: string): string {
        const pattern = /\/videoCC\/([0-9a-f]{32})\/VIDEO/
        const match = url.match(pattern);
        return match ? match[1] : null;
    }

    isRelativeURL(url: string): boolean {
        return url.startsWith("/");
    }

    isUrlWithinDomains(url: string, allowedDomains: string[]): boolean {
        if (!this.isURL(url))
            return false;
        return allowedDomains.some(dom => url.startsWith(dom));
    }

    isValidResource(url: string): boolean {
        return this.isRelativeURL(url) || this.isUrlWithinDomains(url, Config.getAllowedResourceOrigins());
    }

    isValidVideoResource(url: string): boolean {
        const additionalRules = Config.getAdditionalVideoResourceRules();
        // The url belongs to an allowed origin and all the additional rules are fulfilled
        return this.isRelativeURL(url) || (this.isUrlWithinDomains(url, Config.getAllowedResourceOrigins()) && additionalRules.every(rule => rule(url)));
    }

    isValidBase64DataUrl(data: any): boolean {
        const pattern = /^data:([-\w.]+\/[-\w.+]+)?;base64,[A-Za-z0-9+/]*={0,2}$/;
        return typeof data === 'string' && new RegExp(pattern).test(data);
    }

    hasNameInParams(widgetInstance: any): boolean {
        return (widgetInstance.params && (widgetInstance.params.name && (widgetInstance.params.name.length > 0)));
    }

    encodeBlobAsBase64DataURL(blob: Blob): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async encodeURLAsBase64DataURL(url: string): Promise<string | ArrayBuffer | null> {
        const res = await fetch(url);
        const blob = await res.blob();
        return await this.encodeBlobAsBase64DataURL(blob);
    }

    async base64DataURLToURL(base64: string): Promise<string> {
        const resourceBackend = Config.getResourceBackendURL();
        if (!resourceBackend)
            throw new Error("Conversion from base64 to remote url is not supported");

        const blob = await fetch(base64).then(res => res.blob());
        const headers = new Headers();
        headers.append("Content-Type", "application/octet-stream");
        headers.append("Accept", "application/json, application/octet-stream");
        return await fetch(resourceBackend, { method: 'POST', headers, body: blob, redirect: 'follow' }).then(response => response.text());
    }

    findAllObjects(model: any): any[] {

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

    findObjectsOfType(model: any, type: string | string[]): any[] {
        return this.findAllObjects(model).filter(obj => Array.isArray(type) ?
            type.includes(obj.widget) : type === obj.widget);
    }

    groupBy<T>({ collection, key }: { collection: T[]; key: string; }): { [key: string]: T[] } {
        return collection.reduce(function (accumulator, value) {
            (accumulator[value[key]] = accumulator[value[key]] || []).push(value);
            return accumulator;
        }, {});
    }

    toKebabCase(text: string): string {
        return text.split(/(?=[A-Z])/).join('-').toLowerCase();
    }

    resourceURL(resource: string): string {
        let url = resource;
        if (Config.getResourceProxyBackendURL())
            url = Config.getResourceProxyBackendURL() + "?resource=" + url;
        return url;
    }

    isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    checkIfDuplicateValueInObject(values: any[], ...args): boolean {

        const valueArr = values.map(function (item) {

            let count = 0;
            let value = item;
            while (args[count] && value[args[count]]) {
                value = value[args[count]];
                count++;
            }
            return value;
        });
        return valueArr.some(function (item, idx) {
            return valueArr.indexOf(item) != idx
        });
    }
}