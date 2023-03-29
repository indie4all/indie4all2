import { ConfigOptions } from "./types";

export default class Config {
    // Enable service worker for Progressive Web Applications
    private static enablePWA: boolean = true;
    // Key to encrypt sensitive data. If null, no encryption is done.
    private static encryptionKey: Function | string | null = null;
    // Work with local or remote resources
    private static local: boolean = true;
    // Server URL to preview the current unit. Default value: '/model/preview'.
    private static previewBackendURL: string = '/model/preview';
    // Server URL to publish the current unit. Default value: '/model/publish'.
    private static publishBackendURL: string = '/model/publish';
    // Sets if the API should show a modal asking for additional information when publishing a unit. Default value: true.
    private static requestAdditionalDataOnPopulate: boolean = true;
    // Server URL to store the contents of the unit. Default value: '/model/save'.
    private static saveBackendURL: string = '/model/save';
    // Server URL to generate a scorm package with the contents of the unit. Default value: '/model/scorm'.
    private static scormBackendURL: string = '/model/scorm';

    public static setOptions(options: ConfigOptions) {
        if (typeof options.enablePWA === 'boolean')
            this.setPWAEnabled(options.enablePWA);
        if (options.encryptionKey === null || ['function', 'string'].includes(typeof options.encryptionKey))
            this.setEncryptionKey(options.encryptionKey);
        if (typeof options.local === 'boolean')
            this.setLocal(options.local);
        if (typeof options.previewBackendURL === 'string')
            this.setPreviewBackendURL(options.previewBackendURL);
        if (typeof options.publishBackendURL === 'string')
            this.setPublishBackendURL(options.publishBackendURL);
        if (typeof options.requestAdditionalDataOnPopulate === 'boolean')
            this.setRequestAdditionalDataOnPopulate(options.requestAdditionalDataOnPopulate);
        if (typeof options.saveBackendURL === 'string')
            this.setSaveBackendURL(options.saveBackendURL);
        if (typeof options.scormBackendURL === 'string')
            this.setScormBackendURL(options.scormBackendURL);
    }

    public static setPWAEnabled(value: boolean) {
        this.enablePWA = value;
    }

    public static isPWAEnabled(): boolean {
        return this.enablePWA;
    }

    public static setEncryptionKey(value: Function | string | null) {
        this.encryptionKey = value;
    }

    public static getEncryptionKey(): Function | string | null {
        return this.encryptionKey;
    }

    public static setLocal(value: boolean) {
        this.local = value;
    }

    public static isLocal(): boolean {
        return this.local;
    }

    public static setPreviewBackendURL(value: string) {
        this.previewBackendURL = value;
    }

    public static getPreviewBackendURL(): string {
        return this.previewBackendURL;
    }

    public static setPublishBackendURL(value: string) {
        this.publishBackendURL = value;
    }

    public static getPublishBackendURL(): string {
        return this.publishBackendURL;
    }

    public static setRequestAdditionalDataOnPopulate(value: boolean) {
        this.requestAdditionalDataOnPopulate = value;
    }

    public static isRequestAdditionalDataOnPopulate(): boolean {
        return this.requestAdditionalDataOnPopulate;
    }

    public static setSaveBackendURL(value: string) {
        this.saveBackendURL = value;
    }

    public static getSaveBackendURL(): string {
        return this.saveBackendURL;
    }

    public static setScormBackendURL(value: string) {
        this.scormBackendURL = value;
    }

    public static getScormBackendURL(): string {
        return this.scormBackendURL;
    }

}