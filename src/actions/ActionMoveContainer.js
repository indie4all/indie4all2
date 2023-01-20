import ActionAddElement from "./ActionAddElement";
import ActionElement from "./ActionElement";
import ActionRemoveElement from "./ActionRemoveElement";

export default class ActionMoveContainer extends ActionElement {
    
    #move(target) {
        // Remove element from current location
        (new ActionRemoveElement(this.model, this.data)).do();
        // Add element to the target location   
        const targetParent = this.model.findObject(target.id);    
        const siblings = (targetParent.type == 'layout') ? targetParent.data[target.index] : targetParent.data;
        const inPosition = (target.position == -1 || siblings.length == 0 || target.position >= siblings.length) ?
            -1 : siblings[target.position].id;
        
        (new ActionAddElement(this.model, 
            { element: this.data.element,
              parentContainerId: target.id,
              parentContainerIndex: target.index,
              inPositionElementId: inPosition})).do()
    }

    do() { this.#move(this.data.target); }

    undo() { this.#move(this.data.source); }
}