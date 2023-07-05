import Author from "./Author";
import Section from "../model/section/Section";
import Utils from "../Utils";
import Config from "../Config";
import ModelManager from "../model/ModelManager";
import ActionAddSection from "../actions/ActionAddSection";
import ActionAddElement from "../actions/ActionAddElement";
import ModelElement from "../model/ModelElement";
import ActionRemoveElement from "../actions/ActionRemoveElement";
import WidgetColumnsLayout from "../model/widgets/WidgetColumnsLayout/WidgetColumnsLayout";
import ActionRemoveSection from "../actions/ActionRemoveSection";
import ActionSwapSections from "../actions/ActionSwapSections";
import { Model } from "./../model/Model";
import GUI from "./../GUI";
import Category from "./../category/Category";

export class BasicAuthor extends Author {
    
    static async create(palette: HTMLElement, container: HTMLElement): Promise<Author> {
        const model = await Model.create({});
        const author = new BasicAuthor(palette,container,model);
        return author;
    }

    private constructor(palette: HTMLElement, container: HTMLElement, model: Model) {
        super();
        this.model = model;
        const categories = Object.entries(
            ModelManager.getAllWidgetsByCategory()).map(
                ([name, widgets]) => new Category(name, widgets));
        this.GUI = GUI.create(this as Author,palette,container, categories);
    }

    editElement(id: string) {
        this.GUI.openSettings(id);
    }
    clear() {
        this.GUI.clear();
    }

    async resetModel() {
        this.model = await Model.create({});
    }

    async loadModelIntoPlugin(model: any) {
        this.model = await Model.create(model);
    }

    clearModelSections() {
        this.model.sections = [];
    }

    getModelErrors(...args: any[]) {
        const currentErrors = this.model.currentErrors;
        const newErrors = this.model.validate();
        return { currentErrors, newErrors };
    }

    validateContent() {

        let { newErrors } = this.getModelErrors();

        // Paint errors in the view
        if (this.model.sections.length == 0) {
            return false;
        }
        if (newErrors.length > 0) {
            return false;
        }

        return true;
    }

    async addSpecificContent(containerId: string, type: string) {
        this.addModelElement(await ModelManager.create(type), containerId);
    }

    addModelElement(modelElement: ModelElement, parentContainerId: string, parentContainerIndex ?: number) {
        const action = new ActionAddElement(this.model, {
            element: modelElement,
            // Only important for columns, and we cannot add items in columns without dragging
            parentContainerIndex,
            parentContainerId,
            // Add the element at the end of its container
            inPositionElementId: null
        });
        this.undoredo.pushAndExecuteCommand(action);
    }

    private async decrypt(encrypted: string): Promise<string> {
        const encOption = Config.getEncryptionKey();
        if (encOption === null)
            return new Promise(resolve => resolve(encrypted));

        const { default: CryptoJS } = await import('crypto-js');
        const key = typeof encOption === 'function' ? encOption() : encOption;
        return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
    }

    private async encrypt(text: string): Promise<string> {
        const encOption = Config.getEncryptionKey();
        if (encOption === null)
            return new Promise(resolve => resolve(text));

        const { default: CryptoJS } = await import('crypto-js');
        const key = typeof encOption === 'function' ? encOption() : encOption;
        return CryptoJS.AES.encrypt(text, key).toString();
    }

    async addSection(modelSection?: Section) {  
        const index = this.model.sections.length + 1;
        const section = modelSection ?? await ModelManager.create("Section", { index });
        const action = new ActionAddSection(this.model, {
            element: section,
            position: this.model.sections.length,
            container: this.GUI.getContainer()
        });
        this.undoredo.pushAndExecuteCommand(action); 
    }

    addContent(containerId: string, widget: string) { 
        const self = this;
        const allowed = ModelManager.allowed(widget);
        if (allowed.length === 0)
            throw new Error('Cannot create content for non-specific container');

        if (allowed.length === 1) {
            self.addSpecificContent(containerId, allowed[0].widget);
            return;
        }

        const options = allowed.map(proto => ({
            text: this.I18n.value(`widgets.${proto.widget}.label`),
            value: proto.widget
        }));

        import('bootprompt').then(bootprompt => {
            bootprompt.prompt({
                title: this.I18n.value("common.selectType"),
                inputType: 'select',
                inputOptions: options,
                value: allowed[0].widget, // Default option
                closeButton: false,
                callback: function (result) {
                    result && self.addSpecificContent(containerId, result);
                }
            });
        });
    }
    
    copyElement(id: string) {    
        let parentId = <string>$(`[data-id=${id}]`).parents('[type=container]').first().attr('data-id'); 
        this.copyModelElement(this.getModelElement(id), parentId);
    }

    copyModelElement(element: ModelElement, sectionId: string) {
        const parent = this.model.findObject(sectionId);
        if(parent instanceof WidgetColumnsLayout){
            const index = parent.data.findIndex((elem) => elem.includes(element));
            this.addModelElement(element.clone(), sectionId,index);
        } 
        else  this.addModelElement(element.clone(), sectionId);
    }


    getModelElement(id : string) { return this.model.findObject(id); }

    copySection(id: string) { this.copyModelSection(<Section>this.getModelElement(id)) }
    
    copyModelSection(section: Section) {
        this.addSection(section.clone());
    }

    async importElement(id: string) {
        try {
            const encrypted: string | null = localStorage.getItem('copied-element');
            if (!encrypted) {
                localStorage.removeItem('copied-element');
                Utils.notifyWarning(this.I18n.value("messages.noElement"));
                return;
            }

            const decrypted = await this.decrypt(encrypted);
            const elementJSON = JSON.parse(decrypted);
            const modelElement = await ModelManager.create(elementJSON.widget, elementJSON);
            this.copyModelElement(modelElement, id);
            Utils.notifySuccess(this.I18n.value("messages.importedElement"));

        } catch (err) {
            localStorage.removeItem('copied-element');
            Utils.notifyWarning(this.I18n.value("messages.noElement"));
        }
    }

    async importSection() {
        try {
            const encrypted: string | null = localStorage.getItem('copied-section');
            if (!encrypted) {
                localStorage.removeItem('copied-section');
                Utils.notifyWarning(this.I18n.value("messages.noSection"));
                return;
            }
            const decrypted = await this.decrypt(encrypted);
            const sectionJSON = JSON.parse(decrypted);
            const sectionElement = await ModelManager.create(sectionJSON.widget, sectionJSON);
            this.copyModelSection(<Section>sectionElement);
            Utils.notifySuccess(this.I18n.value("messages.importedSection"));
        } catch (err) {
            localStorage.removeItem('copied-section');
            Utils.notifyWarning(this.I18n.value("messages.noSection"));
        }
    }

    removeElement(id: string) { 
        var elementToBeRemoved = this.model.findObject(id);
        var parent = this.model.findParentOfObject(id);
        var parentContainerId = parent.id;
        var parentContainerIndex = -1;
        var inPositionElementId = null;
        let container: any[];
        if (parent instanceof WidgetColumnsLayout) {
            parentContainerIndex = (<WidgetColumnsLayout>parent)
                .data.findIndex(elemArr => elemArr.findIndex(elem => elem.id === id) !== -1);
            container = parent.data[parentContainerIndex];
        } else {
            container = parent.data;
        }

        const positionIndex = container.findIndex(elem => elem.id === id);
        if (positionIndex < container.length - 1)
            inPositionElementId = container[positionIndex + 1].id;

        const action = new ActionRemoveElement(this.model, {
            element: elementToBeRemoved,
            parentContainerIndex,
            parentContainerId,
            inPositionElementId
        });
        this.undoredo.pushAndExecuteCommand(action); 
    }

    removeSection(sectionId: string) { 
        const action = new ActionRemoveSection(this.model, {
            element: this.model.findObject(sectionId),
            position: Utils.findIndexObjectInArray(this.model.sections, "id", sectionId),
            container: this.GUI.getContainer()
        });
        this.undoredo.pushAndExecuteCommand(action);
        Utils.notifySuccess(this.I18n.value("messages.deletedSection"));
    }

    exportElement(id: string) {
        try {
            const original = this.getModelElement(id);
            this.encrypt(JSON.stringify(original)).then(encrypted => {
                localStorage.setItem('copied-element', encrypted);
                Utils.notifySuccess(this.I18n.value("messages.exportedElement"));
            });
        } catch (err) {
            Utils.notifyWarning(this.I18n.value("messages.couldNotExportElement"));
        }
    }

    exportSection(id: string) {
        try {
            const original = this.getModelElement(id);
            this.encrypt(JSON.stringify(original)).then(encrypted => {
                localStorage.setItem('copied-section', encrypted);
                Utils.notifySuccess(this.I18n.value("messages.exportedSection"));
            });
        } catch (err) {
            Utils.notifyWarning(this.I18n.value("messages.couldNotExportSection"));
        }
    }

    swap(sectionOriginId: string, direction: number) { 
        const action = new ActionSwapSections(this.model, {
        sectionOriginId: sectionOriginId,
        direction: direction
        });
        this.undoredo.pushAndExecuteCommand(action); 
    }

    toggleCategory(category: string) { 
        this.GUI.toggleCategory(category);
    }

    async load(model: object, onLoaded?: Function, onError?: Function) {
        await this.loadModelIntoPlugin(model);
        this.GUI.load(onLoaded, onError);
    }

}