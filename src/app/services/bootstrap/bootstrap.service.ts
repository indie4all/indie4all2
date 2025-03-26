import type { Alert, Collapse, Dropdown, Offcanvas, Tab, Modal, Popover, Tooltip } from "bootstrap";
import { injectable } from "inversify";

@injectable()
export default class BootstrapService {

    private alertModule: typeof Alert;
    private collapseModule: typeof Collapse;
    private dropdownModule: typeof Dropdown;
    private modalModule: typeof Modal;
    private offCanvasModule: typeof Offcanvas;
    private tabModule: typeof Tab;
    private popoverModule: typeof Popover;
    private tooltipModule: typeof Tooltip;

    constructor() { }

    public isAlertModuleLoaded(): boolean { return !!this.alertModule; }

    public async loadAlertModule(): Promise<typeof Alert> {
        if (this.alertModule) return new Promise((resolve) => resolve(this.alertModule));
        const { default: module } = await import('bootstrap/js/dist/alert');
        this.alertModule = module;
        return this.alertModule;
    }

    public isCollapseModuleLoaded(): boolean { return !!this.collapseModule; }

    public async loadCollapseModule(): Promise<typeof Collapse> {
        if (this.collapseModule) return new Promise((resolve) => resolve(this.collapseModule));
        const { default: module } = await import('bootstrap/js/dist/collapse');
        this.collapseModule = module;
        return this.collapseModule;
    }

    public isDropdownModuleLoaded(): boolean { return !!this.dropdownModule; }

    public async loadDropdownModule(): Promise<typeof Dropdown> {
        if (this.dropdownModule) return new Promise((resolve) => resolve(this.dropdownModule));
        const { default: module } = await import('bootstrap/js/dist/dropdown');
        this.dropdownModule = module;
        return this.dropdownModule;
    }

    public isModalModuleLoaded(): boolean { return !!this.modalModule; }

    public async loadModalModule(): Promise<typeof Modal> {
        if (this.modalModule) return new Promise((resolve) => resolve(this.modalModule));
        const { default: module } = await import('bootstrap/js/dist/modal');
        this.modalModule = module;
        return this.modalModule;
    }

    public isOffCanvasModuleLoaded(): boolean { return !!this.offCanvasModule; }

    public async loadOffCanvasModule(): Promise<typeof Offcanvas> {
        if (this.offCanvasModule) return new Promise((resolve) => resolve(this.offCanvasModule));
        const { default: module } = await import('bootstrap/js/dist/offcanvas');
        this.offCanvasModule = module;
        return this.offCanvasModule;
    }

    public isTabModuleLoaded(): boolean { return !!this.tabModule; }

    public async loadTabModule(): Promise<typeof Tab> {
        if (this.tabModule) return new Promise((resolve) => resolve(this.tabModule));
        const { default: module } = await import('bootstrap/js/dist/tab');
        this.tabModule = module;
        return this.tabModule;
    }

    public isPopoverModuleLoaded(): boolean { return !!this.popoverModule; }

    public async loadPopoverModule(): Promise<typeof Popover> {
        if (this.popoverModule) return new Promise((resolve) => resolve(this.popoverModule));
        const { default: module } = await import('bootstrap/js/dist/popover');
        this.popoverModule = module;
        return this.popoverModule;
    }

    public isTooltipModuleLoaded(): boolean { return !!this.tooltipModule; }

    public async loadTooltipModule(): Promise<typeof Tooltip> {
        if (this.popoverModule) return new Promise((resolve) => resolve(this.tooltipModule));
        const { default: module } = await import('bootstrap/js/dist/tooltip');
        this.tooltipModule = module;
        return this.tooltipModule;
    }
}