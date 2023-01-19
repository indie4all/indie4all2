import ActionAddElement from "./ActionAddElement";
import ActionElement from "./ActionElement";
import ActionRemoveElement from "./ActionRemoveElement";

export default class ActionMoveContainer extends ActionElement {
    
    do() {
        // Remove element from current location
        (new ActionRemoveElement(this.container, this.model, this.data)).do();

        // Add element to the target location   
        var targetParent = this.model.findObject(this.data.target.id);
        var inPosition;
        var elementsArray = (targetParent.type == 'layout') ? targetParent.data[this.data.target.index] : targetParent.data;

        if (this.data.target.position == -1 || elementsArray.length == 0 || 
            this.data.target.position >= elementsArray.length)
            inPosition = -1;
        else
            inPosition = elementsArray[this.data.target.position].id;
        
        (new ActionAddElement(this.container,this.model, 
            { element: this.data.element,
              parentContainerId: this.data.target.id,
              parentContainerIndex: this.data.target.index,
              inPositionElementId: inPosition})).do()
    }

    undo() {
        
        // Remove element from current location
        (new ActionRemoveElement(this.container, this.model, this.data)).do();

        // Add element to the original location  
        var sourceParent = this.model.findObject(this.data.source.id);
        var inPosition;
        var elementsArray = (sourceParent.type == 'layout') ? sourceParent.data[this.data.source.index] : sourceParent.data;

        if (this.data.source.position == -1 || elementsArray.length == 0 ||
            this.data.source.position >= elementsArray.length)
            inPosition = -1;
        else
            inPosition = elementsArray[this.data.source.position].id;

        (new ActionAddElement(this.container, this.model, 
            {element: this.data.element, 
             parentContainerId: this.data.source.id,
             parentContainerIndex: this.data.source.index,
             inPositionElementId: inPosition
            })).do();
    }
}