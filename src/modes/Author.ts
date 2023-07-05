import UndoRedo from "../Undoredo";
import { Model } from "../model/Model";
import Category from "../category/Category";
import GUI from "./../GUI";
import I18n from "./../I18n";
import DragDropHandler from "./../DragDropHandler";
import { IApi } from "./../IApi";

export default abstract class Author implements IApi {

    protected undoredo : UndoRedo = UndoRedo.getInstance();
    protected I18n : I18n =  I18n.getInstance();
    protected model : Model;
    protected GUI: GUI;

    abstract addSection();
    abstract addContent(...args : any[]);
    abstract copyElement(...args : any[]);
    abstract copySection(...args : any[]);
    abstract importElement(...args : any[]);
    abstract importSection();
    abstract removeElement(...args : any[]);
    abstract removeSection(...args : any[]);
    abstract exportElement(...args : any[]);
    abstract exportSection(...args : any[]);
    abstract swap(...args : any[]);
    abstract toggleCategory(...args : any[]);
    abstract addSpecificContent(...args : any[]);
    abstract addModelElement(...args : any[]);
    abstract getModelElement(...args: any[]);
    abstract copyModelElement(...args: any[]);
    abstract validateContent(...args: any[]);
    abstract clearModelSections(...args: any[]);
    abstract getModelErrors(...args: any[]);
    abstract loadModelIntoPlugin(...args: any[]);
    abstract resetModel();
    abstract editElement(...args: any[]);
    abstract clear();

    abstract load(...args : any[]);

    save() {  this.GUI.save();}

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

    getModel() : Model {
        return this.model;
    }

    undo() { this.undoredo.undo(); }

    redo() { this.undoredo.redo(); }


}