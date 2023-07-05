export interface IApi {
    addSection(...args : any[]);
    addContent(...args : any[]);
    copyElement(...args : any[]);
    copySection(...args : any[]);
    importElement(...args : any[]);
    importSection(...args : any[]);
    removeElement(...args : any[]);
    removeSection(...args : any[]);
    editElement(...args : any[]);
    exportElement(...args : any[]);
    exportSection(...args : any[]);
    swap(...args : any[]);
    toggleCategory(...args : any[]);
    load(...args : any[]);
    save();
    publish();
    download();
    preview();
    scorm();
    publishToNetlify();
    validateContent();
    undo();
    redo();
    clear();
    translate();

}