/* global $ */
import I18n from './I18n';
import { IApi } from './IApi';
import Author from './modes/Author';

export function init(api: IApi) {
    const i18n = I18n.getInstance();
    // Bind interface action events
    $('#upload-model').on('click', function () {
        $('#upload-file-model').trigger('click');
    });
    $('#upload-file-model').on('change', function () {

        const fileInput = this as HTMLInputElement;
        // Do not upload the model if the user has cancelled the selection
        if (fileInput.files.length === 0)
            return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const model = JSON.parse(event.target.result as string);
            api.load(model, function () {
                $('#main-container').css('width', '').css('height', '');
            });
        }
        reader.readAsText(fileInput.files[0]);
    });

    // Check if units can be translated and show/hide the button
    const translateBtn = document.querySelector('.author-translate') as HTMLElement;
    if (translateBtn) {
        i18n.canTranslateUnits().then((canTranslateUnits) => {
            translateBtn.parentElement.classList.toggle("d-none", !canTranslateUnits);
        });
        $('.author-translate').on('click', () => api.translate()).data('title', i18n.value('header.translate'));
        $('.author-translate').find('.btn-text').text(i18n.value('header.translate'));
    }

    $('.author-publish').on('click', () => api.publish()).data('title', i18n.value('header.publish'));
    $('.author-publish').find('.btn-text').text(i18n.value('header.publish'));
    $('.author-publishToNetlify').on('click', () => api.publishToNetlify()).data('title', i18n.value('header.publishToNetlify'));
    $('.author-publishToNetlify').find('.btn-text').text(i18n.value('header.publishToNetlify'));
    $('.author-scorm').on('click', () => api.scorm()).data('title', i18n.value('header.scorm'));
    $('.author-scorm').find('.btn-text').text(i18n.value('header.scorm'));
    $('.author-preview').on('click', () => api.preview()).data('title', i18n.value('header.preview'));
    $('.author-preview').find('.btn-text').text(i18n.value('header.preview'));
    $('.author-validate').on('click', () => api.validateContent()).data('title', i18n.value('header.validate'));
    $('.author-validate').find('.btn-text').text(i18n.value('header.validate'));
    $('.author-save').on('click', () => api.save()).data('title', i18n.value('header.save'));
    $('.author-save').find('.btn-text').text(i18n.value('header.save'));
    $('.author-upload').data('title', () => i18n.value('header.upload'));
    $('.author-upload').find('.btn-text').text(i18n.value('header.upload'));
    $('.author-download').on('click', () => api.download()).data('title', i18n.value('header.download'));
    $('.author-download').find('.btn-text').text(i18n.value('header.download'));
    $('.author-undo').on('click', () => api.undo()).data('title', i18n.value('header.undo'));
    $('.author-undo').find('.btn-text').text(i18n.value('header.undo'));
    $('.author-redo').on('click', () => api.redo()).data('title', i18n.value('header.redo'));
    $('.author-redo').find('.btn-text').text(i18n.value('header.redo'));
    $('.author-add-section').on('click', () => api.addSection()).data('title', i18n.value('header.addSection'));
    $('.author-add-section').find('.btn-text').text(i18n.value('header.addSection'));
    $('.author-import-section').on('click', () => api.importSection()).data('title', i18n.value('header.importSection'));
    $('.author-import-section').find('.btn-text').text(i18n.value('header.importSection'));
    $('.author-clear').on('click', () => api.clear()).data('title', i18n.value('header.clear'));
    $('.author-clear').find('.btn-text').text(i18n.value('header.clear'));

    $('.navbar-toggler')
        .data('title', i18n.value('common.navbar.options'))
        .attr('aria-label', i18n.value('common.navbar.options'));

    $('body').on('click', '.author-export-section', function () {
        const id = $(this).closest('[data-id]').data('id');
        api.exportSection(id);
    });
    $('body').on('click', '.author-import-element', function () {
        const id = $(this).closest('[data-id]').data('id');
        api.importElement(id);
    });
    $('body').on('click', '.author-copy-section', function () {
        const id = $(this).closest('[data-id]').data('id');
        api.copySection(id);
    });
    $('body').on('click', '.author-swap-up', function () {
        const id = $(this).closest('[data-id]').data('id');
        api.swap(id, 1);
    });
    $('body').on('click', '.author-swap-down', function () {
        const id = $(this).closest('[data-id]').data('id');
        api.swap(id, 0);
    });

    $('body').on('click', '.author-remove-section', function () {
        const id = $(this).closest('[data-id]').data('id');
        api.removeSection(id);
    });

    $('body').on('click', '.author-add-content', function () {
        const $ancestor = $(this).closest('[data-id]');
        api.addContent($ancestor.data('id'), $ancestor.data('widget'));
    });

    $('body').on('click', '.author-edit-element', function () {
        const id = $(this).closest('[data-id]').data('id');
        api.editElement(id);
    });

    $('body').on('click', '.author-copy-element', function () {
        const id = $(this).closest('[data-id]').data('id');
        api.copyElement(id);
    });

    $('body').on('click', '.author-export-element', function () {
        const id = $(this).closest('[data-id]').data('id');
        api.exportElement(id);
    });

    $('body').on('click', '.author-remove-element', function () {
        const id = $(this).closest('[data-id]').data('id');
        api.removeElement(id);
    });

    $('body').on('click', '.author-toggle-category', function () {
        const category = $(this).closest('[data-category-header]').data('category-header');
        api.toggleCategory(category);
    });

    // Enable PWA application support if available in the browser
    window.addEventListener('beforeinstallprompt', (event) => {
        // Prevent the mini-infobar from appearing on mobile.
        event.preventDefault();
        const btn = document.querySelector('.author-install') as HTMLElement;
        btn.parentElement.classList.toggle("d-none", false);
        btn.dataset.title = i18n.value('header.install');
        $(btn).find('.btn-text').text(i18n.value('header.install'));
        btn.addEventListener('click', async () => {
            // BeforeInstallPrompt is (for now) a non-standard event
            const beforeInstallPromptEvent = event as any;
            beforeInstallPromptEvent.prompt();
            await beforeInstallPromptEvent.userChoice;
            btn.parentElement.classList.toggle("d-none", true);
        });
    });

    //$('#editor-footer .alert')[0].innerHTML = i18n.value('footer.content');

    // Needed in order to hide after click in delete button
    $("#main-container").on('click', ".btn", function () {
        $("[data-toggle='tooltip']").tooltip('hide');
    });

    // Tooltips
    $("body").tooltip({ selector: "[data-toggle='tooltip']", trigger: 'hover', placement: 'left' });
    // Activate navbar toggler collapse
    $("body").on('click', '[data-author-toggle="collapse"]', function () { $($(this).data('target')).collapse('toggle') });

    // Change caret-down / caret-up icon
    $('.editor-container').on('click', '[data-toggle="collapse"]', function () {
        let $icon = $(this).find('i');
        let show = $($(this).attr('data-target')).is('.collapse.show');
        $icon.toggleClass('fa-caret-down', !show);
        $icon.toggleClass('fa-caret-up', show);
    });

    // Set default text in edit modals
    $('body').on('click', '.js-set-default-text', function () {
        $(this).closest('form').find('input[name="help"]').val('');
    });

    $(document).ready(function () {
        navigator.sendBeacon("/entrance")
    });

    document.addEventListener('visibilitychange', function (event) {
        navigator.sendBeacon(document.visibilityState === "hidden" ? "/exit" : "/entrance")
    });
}
