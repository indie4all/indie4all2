/* global $ */
import I18n from './I18n';

export function init(api) {
    const i18n = I18n.getInstance();
    // Bind interface action events
    $('#upload-model').on('click', function() {
        $('#upload-file-model').trigger('click');
    });
    $('#upload-file-model').on('change', function() {
        
        // Do not upload the model if the user has cancelled the selection
        if (this.files.length === 0)
            return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const model = JSON.parse(event.target.result);
            api.load(model, function() {
                $('#main-container').css('width', '').css('height', '');
            });
        }
        reader.readAsText(this.files[0]);
    });
    $('.author-publish').on('click', () => api.publish()).data('title', i18n.value('header.publish'));
    $('.author-scorm').on('click', () => api.scorm()).data('title', i18n.value('header.scorm'));
    $('.author-preview').on('click', () => api.preview()).data('title', i18n.value('header.preview'));
    $('.author-validate').on('click', () => api.validate()).data('title', i18n.value('header.validate'));
    $('.author-save').on('click', () => api.save()).data('title', i18n.value('header.save'));
    $('.author-upload').data('title', () => i18n.value('header.upload'));
    $('.author-download').on('click', () => api.download()).data('title', i18n.value('header.download'));
    $('.author-undo').on('click', () => api.undo()).data('title', i18n.value('header.undo'));
    $('.author-redo').on('click', () => api.redo()).data('title', i18n.value('header.redo'));
    $('.author-add-section').on('click', () => api.addSection()).data('title', i18n.value('header.addSection'));
    $('.author-import-section').on('click', () => api.importSection()).data('title', i18n.value('header.importSection'));
    $('.author-clear').on('click', () => api.clear()).data('title', i18n.value('header.clear'));
    $('body').on('click', '.author-export-section', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.exportSection(id);
    });
    $('body').on('click', '.author-import-element', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.importElement(id, true);
    });
    $('body').on('click', '.author-copy-section', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.copySection(id);
    });
    $('body').on('click', '.author-swap-up', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.swap(id, 1);
    });
    $('body').on('click', '.author-swap-down', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.swap(id, 0);
    });
    $('body').on('click', '.author-edit-section', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.editSection(id);
    });
    $('body').on('click', '.author-remove-section', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.removeSection(id);
    });

    $('body').on('click', '.author-add-content', function() {
        const $ancestor = $(this).closest('[data-id]');
        api.addContent($ancestor.data('id'), $ancestor.data('widget'));
    });

    $('body').on('click', '.author-edit-element', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.editElement(id);
    });

    $('body').on('click', '.author-copy-element', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.copyElement(id, true);
    });

    $('body').on('click', '.author-export-element', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.exportElement(id);
    });

    $('body').on('click', '.author-remove-element', function() {
        const id = $(this).closest('[data-id]').data('id');
        api.removeElement(id);
    });


    $('body').on('click', '.author-toggle-category', function() {
        const category = $(this).closest('[data-category-header]').data('category-header');
        api.toggleCategory(category);
    });

    $('#editor-footer .alert')[0].innerHTML = i18n.value('footer.content');

    // Needed in order to hide after click in delete button
    $("#main-container").on('click', ".btn", function () {
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
}
