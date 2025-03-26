import type { Alert } from "bootstrap";
import UtilsService from "../utils/utils.service";
import BootstrapService from "../bootstrap/bootstrap.service";
import alertTemplate from "./template.hbs";
import { inject, injectable } from "inversify";

@injectable()
export default class AlertService {

    private _alertModule: typeof Alert;

    constructor(@inject(UtilsService) protected utils: UtilsService,
        @inject(BootstrapService) protected bootstrap: BootstrapService) {
    }

    /**
     * Creates an alert message
     * @param type the type of the alert (success, info, warning, danger)
     * @param message the message to display
     * @returns the alert element 
     */
    private show(type: string, placeholder: HTMLElement, message: string) {
        const id = "alert-" + this.utils.generate_uuid();
        const removeAlert = async () => {
            const elem = document.getElementById(id);
            if (!elem) return;
            if (!this._alertModule) this._alertModule = await this.bootstrap.loadAlertModule();
            const instance = this._alertModule.getOrCreateInstance(elem);
            instance?.close();
        }

        // Close alert on click
        document.addEventListener('click', (e) => {
            if (!(e.target instanceof HTMLElement) || !e.target.classList.contains('btn-close'))
                return;
            const alert = e.target.closest('.alert');
            if (alert.id === id) removeAlert();
        });

        // Auto close alert after 6 seconds
        setTimeout(async () => {
            removeAlert();
            document.removeEventListener('click', removeAlert);
        }, 6000);
        placeholder.innerHTML += alertTemplate({ id, type, message });
    }

    public info(placeholder: HTMLElement, message: string) { this.show('alert-info', placeholder, message); }

    public success(placeholder: HTMLElement, message: string) { this.show('alert-success', placeholder, message); }

    public warning(placeholder: HTMLElement, message: string) { this.show('alert-warning', placeholder, message); }

    public danger(placeholder: HTMLElement, message: string) { this.show('alert-danger', placeholder, message); }

}
