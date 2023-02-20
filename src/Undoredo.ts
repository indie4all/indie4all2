import ActionElement from "./actions/ActionElement";
import I18n from "./I18n";
import Utils from "./Utils";

export default class UndoRedo {

    private static COMMANDS_LIMIT = 10;
    private static INSTANCE: UndoRedo;

    commandArray: ActionElement[];
    currentIndex: number;
    i18n: I18n;

    static getInstance(): UndoRedo {
        if (!this.INSTANCE) {
            this.INSTANCE = new UndoRedo();
        }
        return this.INSTANCE;
    }

    private constructor() {
        this.i18n = I18n.getInstance();
        /** Array of applied commands */
        this.commandArray = [];
        /** Index of the last applied command. Iterates over commandArray */
        this.currentIndex = -1;
    }

    /**
     * Redo last applied command
     */
    redo() {
        // If commands are empty, no action to be redone
        // If index is at the last position, no action to be redone
        if (this.commandArray.length == 0 || this.currentIndex == (this.commandArray.length - 1)) {
            Utils.notifyWarning(this.i18n.value("messages.noRedo"));
            return;
        }

        // Gets the next command and runs the action
        this.commandArray[++this.currentIndex].do();
    }

    /**
     * Undo last applied command
     */
    undo() {
        // If commands are empty, no action to be undo
        // If currentIndex is out of the array, no action to be undo
        if (this.commandArray.length == 0 || this.currentIndex == -1) {
            Utils.notifyWarning(this.i18n.value("messages.noUndo"));
            return;
        }

        // Runs the opposite command of the last command done  
        this.commandArray[this.currentIndex--].undo();
    }

    clearCommandArray = function () {
        this.commandArray = [];
    }

    pushAndExecuteCommand(actionElement: any) {
        this.pushCommand(actionElement);
        actionElement.do();
    }

    pushCommand(actionElement: any) {
        // Clear the rest of commands if a new command is applied in the middle of the array 
        if (this.currentIndex < (this.commandArray.length - 1))
            this.commandArray = this.commandArray.slice(0, this.currentIndex + 1);

        // Pushes command and updates the length
        this.commandArray.push(actionElement);

        // When the limit has been reached, the first item will be deleted to make room for new commands
        if (this.commandArray.length >= UndoRedo.COMMANDS_LIMIT) this.commandArray.shift();

        this.currentIndex = this.commandArray.length - 1;
    }
}
