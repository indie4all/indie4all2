/* global $ */
import 'bootstrap/dist/css/bootstrap.css';
import 'toastr/build/toastr.css'; 
import icons from "trumbowyg/dist/ui/icons.svg"
$.trumbowyg.svgPath = icons; // './vendor/trumbowyg/ui/icons.svg';
import Api from "./author/Api"
import "./overrides.css"
import "trumbowyg"
import "trumbowyg/dist/ui/trumbowyg.css"
import './vendor/trumbowyg/trumbowyg.template'
import './vendor/trumbowyg/trumbowyg.whitespace'
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

/** Entry point */
$(function () {

    const domPalette = document.getElementById('palette');
    const domContainer = document.getElementById('main-container');
    const api = new Api(domPalette, domContainer, function() {});
    $('#upload-model').on('click', function() {
        $('#upload-file-model').trigger('click');
    });
    $('#upload-file-model').on('change', function() {
        const reader = new FileReader();
        reader.onload = (event) => {
            const model = JSON.parse(event.target.result);
            api.load(model, function() {
                $('#main-container').css('width', '').css('height', '');
            });
        }
        reader.readAsText(this.files[0]);
    });

    // Needed in order to hide after click in delete button
    $(document).on('click', "#main-container .btn", function () {
        $("[data-toggle='tooltip']").tooltip('hide');
    });

    // Tooltips
    $("body").tooltip({ trigger: 'hover', selector: "[data-toggle='tooltip']"});


    // Change caret-down / caret-up icon
    $('.editor-container').on('click', '[data-toggle="collapse"]', function() {
        let $icon = $(this).find('i');
        let show = $($(this).attr('data-target')).is('.collapse.show');
        $icon.toggleClass('fa-caret-down', !show);
        $icon.toggleClass('fa-caret-up', show);
    });

    window.indieauthor = { api };
    console.log("Webpack loaded");
});

