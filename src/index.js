import 'bootstrap/dist/css/bootstrap.css';
import 'toastr/build/toastr.css'; 
import Api from "./Api"
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { 
    faArrowUp, faArrowDown, faBoxOpen, faCaretDown, faCaretUp, faCheck, faCheckCircle, 
    faCloudDownloadAlt, faCloudUploadAlt, faCopy, faEdit, faEye, faGlobe, faFileExport, 
    faFileImport, faPlusCircle, faTimes, faTimesCircle, faRedo, faSpinner, faTrashAlt, faUndo
} from '@fortawesome/free-solid-svg-icons'
import "./styles/overrides.css"
import { init as init_events } from './events'
import I18n from './I18n';

// Enable FontAwesome icons
library.add(faArrowUp, faArrowDown, faBoxOpen, faCaretDown, faCaretUp, faCheck, faCheckCircle, 
    faCloudDownloadAlt, faCloudUploadAlt, faCopy, faEdit, faEye, faGlobe, faFileExport, 
    faFileImport, faPlusCircle, faTimes, faTimesCircle, faRedo, faSpinner, faTrashAlt, faUndo);
// Watch for changes to replace icons
dom.watch();

let api;
I18n.init().then(() => {
    const domPalette = document.getElementById('palette');
    const domContainer = document.getElementById('main-container');
    // Initialize the IndieAuthor api
    api = new Api(domPalette, domContainer);
    init_events(api);
});

export { api };

