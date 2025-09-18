import { inject, injectable } from "inversify";
import { Model } from "../../elements/model";
import UtilsService from "../../services/utils/utils.service";
import ThemeManagerService from "../../services/theme-manager/theme-manager.service";
import ColorPickerService from "../../services/color-picker/color-picker.service";
import CoverPickerService from "../../services/cover-picker/cover-picker.service";
import BootstrapService from "../../services/bootstrap/bootstrap.service";

@injectable()
export default class ModalUnitSettings {

    private themes: string[] = [];
    private licenses: string[] = ["PRIVATE", "BY", "BYSA", "BYND", "BYNC", "BYNCSA", "BYNCND"];
    private langs: string[] = ["AR", "BG", "CA", "CS", "DA", "DE", "EL", "EN", "ES", "ET", "EU", "FI",
        "FR", "GA", "GL", "HR", "HU", "IT", "JA", "LT", "LV", "MT", "NB", "NL",
        "PL", "PT", "RO", "SK", "SL", "SV", "UK", "YUE"];

    constructor(@inject(UtilsService) private utils: UtilsService,
        @inject(ThemeManagerService) private themeManager: ThemeManagerService,
        @inject(ColorPickerService) private colorPicker: ColorPickerService,
        @inject(CoverPickerService) private coverPicker: CoverPickerService,
        @inject(BootstrapService) private bootstrap: BootstrapService) {
        this.themes = this.themeManager.themes;
        this.themes.unshift("Custom");
    }


    async init() {
        await this.colorPicker.init();
    }

    public async show(model: Model, title: string, onSubmit?: (model: Model) => void) {
        const data = {
            themes: this.themes,
            languages: this.langs,
            licenses: this.licenses,
            title: model.title ?? '',
            user: model.user ?? '',
            email: model.email ?? '',
            institution: model.institution ?? '',
            language: model.language?.toUpperCase() ?? '',
            theme: model.theme ?? '',
            license: model.license ?? ''
        };
        const { default: settingsTemplate } = await import('./template.hbs');
        document.body.insertAdjacentHTML('beforeend', settingsTemplate(data));
        const settingsElem = document.getElementById('modal-settings');
        settingsElem.querySelector(".modal-title").textContent = title;

        const colorElem = this.colorPicker.create(
            { el: '#custom-theme-color-picker', parent: '#modal-settings-body', alpha: false, formatToggle: false });
        const coverPickerElem = document.getElementById('custom-theme-background') as HTMLInputElement;
        const coverPickerPreview = document.getElementById('img-cover-blob') as HTMLInputElement;
        const previewElem = document.getElementById('img-cover-preview') as HTMLImageElement;
        const coverElem = this.coverPicker.create(coverPickerElem, coverPickerPreview, previewElem);
        const themeManager = this.themeManager;

        const updateThemeOptions = async function (e) {
            const input = this as HTMLInputElement;
            const theme: string = input.value;
            const isCustom = theme === 'Custom';
            if (isCustom) {
                colorElem.enable();
                coverElem.enable();
                colorElem.color = model.color ?? '';
                coverElem.cover = model.cover ?? '';
                coverElem.togglePreview(!!model.cover);
                return;
            }

            colorElem.disable();
            coverElem.disable();

            const info = await themeManager.load(theme);
            colorElem.color = info.color;
            coverElem.cover = info.cover as string;
            coverElem.show();
        }

        coverElem.changed.subscribe(async file => {
            coverElem.cover = URL.createObjectURL(file);
            if (!file) {
                coverElem.hide();
                coverElem.cover = '';
                return;
            }
            const value = await this.utils.encodeBlobAsBase64DataURL(file);
            coverElem.cover = value as string;
            coverElem.show();
        });

        const themeSelector = document.getElementById('unit-theme') as HTMLSelectElement;
        themeSelector.addEventListener('change', updateThemeOptions);
        const modalElem = document.getElementById('modal-settings');
        modalElem.addEventListener('show.bs.modal', updateThemeOptions.bind(themeSelector));
        const modalModule = await this.bootstrap.loadModalModule();
        const modal = modalModule.getOrCreateInstance(modalElem, { keyboard: false, backdrop: 'static' });
        modal.show();

        const form = document.getElementById('f-unit-settings') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            model.update(this.utils.toJSON(form));
            modal.hide();
            onSubmit && onSubmit(model);
        });
        modalElem.querySelector('.btn-submit').addEventListener('click', () => form.requestSubmit());

        // [Fix] https://github.com/twbs/bootstrap/issues/41005
        modalElem.addEventListener('hide.bs.modal', () => document.activeElement instanceof HTMLElement && document.activeElement.blur());
        modalElem.addEventListener('hidden.bs.modal', () => {
            modal.dispose();
            modalElem.remove();
        });
    }
}