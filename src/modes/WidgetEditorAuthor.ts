import Author from "./Author";
import Section from "../model/section/Section";
import Utils from "../Utils";
import Config from "../Config";
import ModelManager from "../model/ModelManager";
import ActionAddElement from "../actions/ActionAddElement";
import ModelElement from "../model/ModelElement";
import ActionRemoveElement from "../actions/ActionRemoveElement";
import WidgetColumnsLayout from "../model/widgets/WidgetColumnsLayout/WidgetColumnsLayout";
import ActionSwapSections from "../actions/ActionSwapSections";
import { Model } from "./../model/Model";
import GUI from "./../GUI";
import Category from "./../category/Category";



export class WidgetEditorAuthor extends Author {

    private sectionParentId;

    static async create(palette: HTMLElement, container: HTMLElement): Promise<Author> {

        const model = await Model.create({});
        const author = new WidgetEditorAuthor(palette, container, model);
        return author;
    }

    private constructor(palette: HTMLElement, container: HTMLElement, model: Model) {
        super();
        this.model = model;
        this.GUI = GUI.create(this as Author, palette, container, []);
    }

    editElement(id: string) {
        if (id != this.sectionParentId) this.GUI.openSettings(id);
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

    async addSpecificContent(containerId: string, type: string) {
        this.addModelElement(await ModelManager.create(type), containerId);
    }

    addModelElement(modelElement: ModelElement, parentContainerId: string, parentContainerIndex?: number) {
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

    copyModelElement(element: ModelElement, parentId: string) {
        const parent = this.model.findObject(parentId);
        if (parent instanceof WidgetColumnsLayout) {
            const index = parent.data.findIndex((elem) => elem.includes(element));
            this.addModelElement(element.clone(), parentId, index);
        }
        else this.addModelElement(element.clone(), parentId);
    }


    getModelElement(id: string) { return this.model.findObject(id); }

    copySection(id: string) { this.copyModelSection(<Section>this.getModelElement(id)) }

    copyModelSection(section: Section) {
        this.addSection(section.clone());
    }

    async importElement(id: string) {
    }

    async importSection() {
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

    async load(dataObject: any, onLoaded?: Function, onError?: Function) {
        this.GUI.showLoading();
        const section = await ModelManager.create("Section", { data: [dataObject] }) as Section;
        section.bookmark = "WidgetEditorSection";
        ModelManager.get(dataObject.widget).setDeletable(false);
        ModelManager.get(dataObject.widget).setCopyable(false);
        const modelObj = { sections: [section.toJSON()] }
        const model = await Model.create(modelObj);
        const widgetsAvailable = ModelManager.getAllWidgetsAllowedByCategory(dataObject.widget);
        const categories = Object.entries(
            widgetsAvailable).map(
                ([name, widgets]) => new Category(name, widgets));
        ModelManager.addRule("Section", { refuses: ModelManager.getAllWidgetsAllowedIn(dataObject.widget) })
        this.GUI.renderCategories(categories);
        this.sectionParentId = section.id;
        this.model = model;
        this.GUI.load();
    }

}