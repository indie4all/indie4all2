

/** API configuration options. **/
export interface ConfigOptions {
    // Enable service worker for Progressive Web Applications
    enablePWA?: boolean 
    // Key to encrypt sensitive data. If null, no encryption is done.
    encryptionKey ?: Function | string | null,
    // Server URL to preview the current unit. Default value: '/model/preview'.
    previewBackendURL?: string,
    // Server URL to publish the current unit. Default value: '/model/publish'.
    publishBackendURL?: string,
    // Sets if the API should show a modal asking for additional information when publishing a unit. Default value: true.
    requestAdditionalDataOnPopulate?: boolean,
    // Server URL to store the contents of the unit. Default value: '/model/save'.
    saveBackendURL?: string,
    // Server URL to generate a scorm package with the contents of the unit. Default value: '/model/scorm'.
    scormBackendURL?: string
}
