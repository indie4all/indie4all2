import 'bootstrap/dist/css/bootstrap.css';
import Api from "./Api"
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { 
    faArrowUp, faArrowDown, faBoxOpen, faCaretDown, faCaretUp, faCheck, faCheckCircle, 
    faCloudDownloadAlt, faCloudUploadAlt, faCopy, faDownload, faEdit, faEye, faGlobe, faFileExport, 
    faFileImport, faPlusCircle, faTimes, faTimesCircle, faRedo, faSave, faSpinner, faTrashAlt, faUndo
} from '@fortawesome/free-solid-svg-icons'
import "./styles/overrides.css"
import { init as init_events } from './events'
import I18n from './I18n';

if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
     navigator.serviceWorker.register('/service-worker.js');
   });
}

const start = (options) => {
    // Enable FontAwesome icons
    library.add(faArrowUp, faArrowDown, faBoxOpen, faCaretDown, faCaretUp, faCheck, faCheckCircle, 
        faCloudDownloadAlt, faCloudUploadAlt, faCopy, faDownload, faEdit, faEye, faGlobe, faFileExport, 
        faFileImport, faPlusCircle, faTimes, faTimesCircle, faRedo, faSave, faSpinner, faTrashAlt, faUndo);
    // Watch for changes to replace icons
    dom.watch();

    return I18n.init()
        .then(() => import('bootstrap'))
        .then(() => {
            const domPalette = document.getElementById('palette');
            const domContainer = document.getElementById('main-container');
            // Initialize the IndieAuthor api
            const api = new Api(domPalette, domContainer);
            api.setOptions(options);
            init_events(api);
            return api;
    });
}

export { start };