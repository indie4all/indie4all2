import { ConfigOptions } from "./types";

export default class Config {
    // Base path for analytics queries
    private static analyticsBasePath: string = '';
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
    // Server URL to publish the current unit in Netlify. Default value: '/model/publishToNetlify'.
    private static publishToNetlifyBackendURL: string = '/model/publishToNetlify';
    // Sets if the API should show a modal asking for additional information when publishing a unit. Default value: true.
    private static requestAdditionalDataOnPopulate: boolean = true;
    // Server URL to store the contents of the unit. Default value: '/model/save'.
    private static saveBackendURL: string = '/model/save';
    // Server URL to generate a scorm package with the contents of the unit. Default value: '/model/scorm'.
    private static scormBackendURL: string = '/model/scorm';
    // Server URL to translate models
    private static translationBackendURL: string = '/translation'
    // Server URL to retrieve a remote resource
    private static resourceProxyBackendURL: string = '/resource';
    // Server URL to create a remote resource and get its URL
    private static resourceBackendURL: string = '/resource';
    // Server URL to get the list of widgets available in the bank of widgets
    private static bankOfWidgetsURL: string = null;
    // Server URL to get the list of user media files
    private static mediaResourcesURL: string = null;
    // Server URL to migrate media files to the new file system
    private static mediaMigrationURL: string = null;
    // List of allowed origins for media data
    private static allowedResourceOrigins: string[] = ["http://localhost:8000", "https://indiemedia.upct.es", "http://indieopen.upct.es", "https://multimediarepository.blob.core.windows.net"];
    // Additional rules to check if a video URL is allowed
    private static additionalVideoResourceRules: ((url: string) => boolean)[] = [];
    //Enable mode of Widget Editor
    private static enableWidgetEditor: boolean = false;
    // Action to perform is the user is unauthorized
    private static unauthorizedMessage: string = null;
    // List of widgets to allow in the editor -> if null all widgets are allowed
    private static widgetsWhitelist: string[] = null;
    // List of widgets to block in the editor -> if null no widgets are blocked
    private static widgetsBlacklist: string[] = null;

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
        if (typeof options.translationBackendURL === 'string')
            this.setTranslationBackendURL(options.translationBackendURL);
        if (typeof options.resourceBackendURL === 'string' || options.resourceBackendURL === null)
            this.setResourceBackendURL(options.resourceBackendURL);
        if (typeof options.resourceProxyBackendURL === 'string' || options.resourceProxyBackendURL === null)
            this.setResourceProxyBackendURL(options.resourceProxyBackendURL);
        if (Array.isArray(options.allowedResourceOrigins))
            this.setAllowedResourceOrigins(options.allowedResourceOrigins);
        if (typeof options.bankOfWidgetsURL === 'string')
            this.setBankOfWidgetsURL(options.bankOfWidgetsURL);
        if (Array.isArray(options.additionalVideoResourceRules))
            this.setAdditionalVideoResourceRules(options.additionalVideoResourceRules);
        if (typeof options.enableWidgetEditor === 'boolean')
            this.setWidgetEditorEnabled(options.enableWidgetEditor)
        if (typeof options.analyticsBasePath === 'string')
            this.setAnalyticsBasePath(options.analyticsBasePath)
        if (typeof options.mediaResourcesURL === 'string')
            this.setMediaResourcesURL(options.mediaResourcesURL)
        if (typeof options.unauthorizedMessage === 'string')
            this.setUnauthorizedMessage(options.unauthorizedMessage)
        if (typeof options.mediaMigrationURL === 'string')
            this.setMediaMigrationURL(options.mediaMigrationURL)
        if (Array.isArray(options.widgetsWhitelist))
            this.setWidgetsWhitelist(options.widgetsWhitelist)
        if (Array.isArray(options.widgetsBlacklist))
            this.setWidgetsBlacklist(options.widgetsBlacklist)
    }

    public static setAnalyticsBasePath(value: string) {
        this.analyticsBasePath = value;
    }

    public static getAnalyticsBasePath(): string {
        return this.analyticsBasePath;
    }

    public static setWidgetEditorEnabled(value: boolean) {
        this.enableWidgetEditor = value;
    }

    public static isWidgetEditorEnabled(): boolean {
        return this.enableWidgetEditor;
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

    public static getLocal() {
        return this.local;
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

    public static getBankOfWidgetsURL(): string {
        return this.bankOfWidgetsURL;
    }

    public static setBankOfWidgetsURL(value: string) {
        this.bankOfWidgetsURL = value;
    }

    public static getPublishBackendURL(): string {
        return this.publishBackendURL;
    }

    public static setPublishToNetlifyBackendURL(value: string) {
        this.publishToNetlifyBackendURL = value;
    }

    public static getPublishToNetlifyBackendURL(): string {
        return this.publishToNetlifyBackendURL;
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

    public static setResourceBackendURL(value: string) {
        this.resourceBackendURL = value;
    }

    public static getResourceBackendURL() {
        return this.resourceBackendURL;
    }

    public static setResourceProxyBackendURL(value: string) {
        this.resourceProxyBackendURL = value;
    }

    public static getResourceProxyBackendURL() {
        return this.resourceProxyBackendURL;
    }

    public static getTranslationBackendURL(): string {
        return this.translationBackendURL;
    }

    public static setTranslationBackendURL(value: string) {
        this.translationBackendURL = value;
    }

    public static setAllowedResourceOrigins(value: string[]) {
        this.allowedResourceOrigins = value;
    }

    public static getAllowedResourceOrigins(): string[] {
        return this.allowedResourceOrigins;
    }

    public static setAdditionalVideoResourceRules(value: ((url: string) => boolean)[]) {
        this.additionalVideoResourceRules = value;
    }

    public static getAdditionalVideoResourceRules(): ((url: string) => boolean)[] {
        return this.additionalVideoResourceRules;
    }

    public static getMediaResourcesURL(): string {
        return this.mediaResourcesURL;
    }

    public static setMediaResourcesURL(value: string) {
        this.mediaResourcesURL = value;
    }

    public static getMediaMigrationURL(): string {
        return this.mediaMigrationURL;
    }

    public static setMediaMigrationURL(value: string) {
        this.mediaMigrationURL = value;
    }

    public static setUnauthorizedMessage(value: string) {
        this.unauthorizedMessage = value;
    }

    public static getUnauthorizedMessage(): string {
        return this.unauthorizedMessage;
    }

    public static setWidgetsWhitelist(value: string[]) {
        this.widgetsWhitelist = value;
    }

    public static getWidgetsWhitelist(): string[] {
        return this.widgetsWhitelist;
    }

    public static setWidgetsBlacklist(value: string[]) {
        this.widgetsBlacklist = value;
    }

    public static getWidgetsBlacklist(): string[] {
        return this.widgetsBlacklist;
    }

}