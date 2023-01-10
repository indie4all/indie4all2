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
import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";
import "./styles/overrides.css"
import './vendor/trumbowyg/trumbowyg.template'
import './vendor/trumbowyg/trumbowyg.whitespace'
import { init as init_events } from './events'

const domPalette = document.getElementById('palette');
const domContainer = document.getElementById('main-container');
// Initialize the IndieAuthor api
const api = new Api(domPalette, domContainer);
init_events(api);
export { api };

