import { dom, library } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowUp, faArrowDown, faBan, faBoxOpen, faBrain, faCaretDown, faCaretUp, faCheck, faCheckCircle,
    faCloudDownloadAlt, faCloudUploadAlt, faCopy, faDownload, faEdit, faEye, faFile, faFileAudio, faFolder, faGlobe, faFileExport,
    faFileImport, faLanguage, faCirclePlay, faPlusCircle, faTimes, faTimesCircle, faRedo, faSave, faSpinner, faN, faTag, faTrashAlt, faUndo
} from '@fortawesome/free-solid-svg-icons';
import { injectable } from 'inversify';

@injectable()
export default class FontAwesomeService {
    constructor() { }
    async init() {
        library.add(faArrowUp, faArrowDown, faBan, faBoxOpen, faBrain, faCaretDown, faCaretUp, faCheck, faCheckCircle,
            faCloudDownloadAlt, faCloudUploadAlt, faCopy, faDownload, faEdit, faEye, faFile, faFileAudio, faFolder, faGlobe, faFileExport,
            faFileImport, faLanguage, faCirclePlay, faPlusCircle, faTimes, faTimesCircle, faRedo, faSave, faSpinner, faN, faTag, faTrashAlt, faUndo);
        // Watch for changes to replace icons
        dom.watch();
    }
}