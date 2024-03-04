import UndoRedo from "../Undoredo";
import { Model } from "../model/Model";
import GUI from "./../GUI";
import I18n from "./../I18n";
import { IApi } from "./../IApi";
import Utils from "../Utils";

export default abstract class Author implements IApi {

    protected undoredo: UndoRedo = UndoRedo.getInstance();
    protected I18n: I18n = I18n.getInstance();
    protected model: Model;
    protected GUI: GUI;

    abstract addSection();
    abstract addContent(...args: any[]);
    abstract copyElement(...args: any[]);
    abstract copySection(...args: any[]);
    abstract importElement(...args: any[]);
    abstract importSection();
    abstract removeElement(...args: any[]);
    abstract removeSection(...args: any[]);
    abstract exportElement(...args: any[]);
    abstract exportSection(...args: any[]);
    abstract swap(...args: any[]);
    abstract toggleCategory(...args: any[]);
    abstract addSpecificContent(...args: any[]);
    abstract addModelElement(...args: any[]);
    abstract getModelElement(...args: any[]);
    abstract copyModelElement(...args: any[]);
    abstract clearModelSections(...args: any[]);
    abstract getModelErrors(...args: any[]);
    abstract loadModelIntoPlugin(...args: any[]);
    abstract resetModel();
    abstract editElement(...args: any[]);
    abstract clear();
    abstract load(...args: any[]);

    validateContent(print: boolean = false) {
        let { currentErrors, newErrors } = this.getModelErrors();
        this.GUI.showErrors(currentErrors, newErrors);

        // Paint errors in the view

        // No sections
        if (this.model.sections.length == 0) {
            if (print) this.GUI.showGeneralError("messages.emptyContent");
            return false;
        }

        // Only hidden sections
        if (this.model.sections.filter(section => !section.hidden).length == 0) {
            if (print) this.GUI.showGeneralError("messages.hiddenContent");
            return false;
        }

        if (newErrors.length > 0) {
            if (print) this.GUI.showGeneralError("messages.contentErrors");
            return false;
        }
        if (print) this.GUI.showSuccess("messages.noErrors");
        return true;
    }

    save() { this.GUI.save(); }

    publish() { this.GUI.publish(); }

    download() { this.GUI.download(); }

    preview() { this.GUI.preview(); }

    scorm() { this.GUI.scorm(); }

    publishToNetlify() { this.GUI.publishToNetlify(); }

    translate() {
        if (!this.validateContent()) {
            console.error(this.I18n.translate("messages.contentErrors"));
            return;
        }
        else this.GUI.translate(this.model);
    }

    getModel(): Model {
        return this.model;
    }

    undo() { this.undoredo.undo(); }

    redo() { this.undoredo.redo(); }

    async openQuestionsBank(id: string) {
        this.GUI.openModalQuestionsBank(id);
    }

}