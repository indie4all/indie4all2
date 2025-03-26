import { inject, injectable } from "inversify";
import I18nService from "../i18n/i18n.service";
import UtilsService from "../utils/utils.service";
import Action from "./actions/action";

@injectable()
export default class UndoRedoService {

    private static COMMANDS_LIMIT = 10;

    commandArray: Action[] = [];
    currentIndex: number = -1;

    constructor(
        @inject(I18nService) private i18n: I18nService,
        @inject(UtilsService) private utils: UtilsService
    ) { }

    /**
     * Redo last applied command
     */
    redo() {
        // If commands are empty, no action to be redone
        // If index is at the last position, no action to be redone
        if (this.commandArray.length == 0 || this.currentIndex == (this.commandArray.length - 1)) {
            this.utils.notifyWarning(this.i18n.value("messages.noRedo"));
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
            this.utils.notifyWarning(this.i18n.value("messages.noUndo"));
            return;
        }

        // Runs the opposite command of the last command done  
        this.commandArray[this.currentIndex--].undo();
    }

    clearCommandArray = function () {
        this.commandArray = [];
    }

    async pushAndExecuteCommand(actionElement: any) {
        this.pushCommand(actionElement);
        await actionElement.do();
    }

    pushCommand(actionElement: any) {
        // Clear the rest of commands if a new command is applied in the middle of the array 
        if (this.currentIndex < (this.commandArray.length - 1))
            this.commandArray = this.commandArray.slice(0, this.currentIndex + 1);

        // Pushes command and updates the length
        this.commandArray.push(actionElement);

        // When the limit has been reached, the first item will be deleted to make room for new commands
        if (this.commandArray.length >= UndoRedoService.COMMANDS_LIMIT) this.commandArray.shift();

        this.currentIndex = this.commandArray.length - 1;
    }
}
