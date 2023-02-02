/* global $ */
import 'bootstrap/dist/css/bootstrap.css';
import 'toastr/build/toastr.css'; 
import icons from "trumbowyg/dist/ui/icons.svg"
$.trumbowyg.svgPath = icons; // './vendor/trumbowyg/ui/icons.svg';
import Api from "./Api"
import "trumbowyg"
import "trumbowyg/dist/ui/trumbowyg.css"
import 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'datatables.net-keytable-dt';
import 'datatables.net-keytable-dt/css/keyTable.dataTables.css';
import 'datatables.net-select-dt';
import 'datatables.net-select-dt/css/select.dataTables.css';
import 'katex/dist/katex.css'
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { 
    faArrowUp, faArrowDown, faBoxOpen, faCaretDown, faCaretUp, faCheck, faCheckCircle, 
    faCloudDownloadAlt, faCloudUploadAlt, faCopy, faEdit, faEye, faGlobe, faFileExport, 
    faFileImport, faPlusCircle, faTimes, faTimesCircle, faRedo, faSpinner, faTrashAlt, faUndo
} from '@fortawesome/free-solid-svg-icons'
import "./styles/overrides.css"
import './vendor/trumbowyg/trumbowyg.template'
import './vendor/trumbowyg/trumbowyg.whitespace'
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

