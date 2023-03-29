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
import { ConfigOptions } from './types';
import Config from './Config';

const start = async (options?: ConfigOptions) => {
    options && Config.setOptions(options);
    if (Config.isPWAEnabled() && 'serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                await navigator.serviceWorker.register('/service-worker.js');
            } catch (error) {
                console.warn("The ServiceWorker could not be registered")
            }
        });
    }
    // Enable FontAwesome icons
    library.add(faArrowUp, faArrowDown, faBoxOpen, faCaretDown, faCaretUp, faCheck, faCheckCircle,
        faCloudDownloadAlt, faCloudUploadAlt, faCopy, faDownload, faEdit, faEye, faGlobe, faFileExport,
        faFileImport, faPlusCircle, faTimes, faTimesCircle, faRedo, faSave, faSpinner, faTrashAlt, faUndo);
    // Watch for changes to replace icons
    dom.watch();
    await I18n.init();
    await import('bootstrap');
    // Set the tool language
    document.documentElement.lang = I18n.getInstance().getLang();
    const domPalette = document.getElementById('palette');
    const domContainer = document.getElementById('main-container');
    // Initialize the IndieAuthor api
    const api = await Api.create(domPalette, domContainer);
    init_events(api);
    return api;
}

export { start };