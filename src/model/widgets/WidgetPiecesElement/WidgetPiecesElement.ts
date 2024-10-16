/* global $ */
import { PieceElement, WidgetPiecesElementData, WidgetPiecesElementParams } from "../../../types";
import Utils from "../../../Utils";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import CanvasHelper from "./CanvasHelper";

export default abstract class WidgetPiecesElement extends WidgetItemElement {

    params: WidgetPiecesElementParams;
    data: WidgetPiecesElementData;

    protected pieces: PieceElement[];
    protected canvasHandler?: CanvasHelper;

    constructor(values?: any) {
        super(values);
        const constructor = <typeof WidgetPiecesElement>this.constructor;
        this.params = values?.params ? structuredClone(values.params) : {
            name: constructor.widget + "-" + this.id,
            help: ""
        };
        this.data = values?.data ? structuredClone(values.data) : { blob: "", alt: "", pieces: [] };
    }


    getTexts() {
        return {
            "help": this.params.help,
            "name": this.params.name,
            "alt": this.data.alt,
            "pieces": this.data.pieces.map(piece => ({ "altImg": piece.altImg, "altRec": piece.altRec }))
        }
    }

    preview(): string {
        const constructor = <typeof WidgetPiecesElement>this.constructor;
        return this.params?.name ?? this.translate("widgets." + constructor.widget + ".label");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateTexts(texts: any): void {
        this.params.help = texts.help;
        this.params.name = texts.name;
        this.data.alt = texts.alt;
        (texts.pieces as any[]).map((text, idx) => {
            this.data.pieces[idx].altImg = text.altImg;
            this.data.pieces[idx].altRec = text.altRec;
        });
    }

    protected onActionRect(position: number) {
        let rect = this.pieces[position];
        let $group = $('#f-' + this.id).find('.piece').eq(position);
        let $inputs = $group.find('input');
        $inputs.eq(2).val(rect.x);
        $inputs.eq(3).val(rect.y);
        $inputs.eq(4).val(rect.w);
        $inputs.eq(5).val(rect.h);
    }

    protected loadImage(url: string) {
        let tmpImage = new Image;

        tmpImage.onerror = () => {
            const $form = $('#f-' + this.id);
            const $error = $form.find('.preview-error')
            const emptySrc = tmpImage.src === window.location.href;
            $form.find('.pieces-wrapper').addClass('d-none');
            $error.toggleClass('d-none', emptySrc);
        }

        tmpImage.onload = () => {
            const $form = $('#f-' + this.id);
            $form.find('.preview-error').addClass('d-none');
            $form.find('.pieces-wrapper').removeClass('d-none');
            setTimeout(() => {
                this.canvasHandler.load(tmpImage);
                this.canvasHandler.setRects(this.pieces);
            }, 150);
        }
        tmpImage.src = url;
    }

    protected addPiece(e: JQuery.TriggeredEvent<HTMLElement>) {
        let rect = { x: '10', y: '10', w: '100', h: '100' };
        const pos = this.pieces.length;
        this.pieces.push(rect)
        this.canvasHandler.setRects(this.pieces);
        import('./piece.hbs').then(({ default: piece }) =>
            $('#f-' + this.id).find('.pieces').append(piece(
                { ...rect, pos, widget: (this.constructor as typeof WidgetPiecesElement).widget })));
    }

    protected deletePiece(e: JQuery.TriggeredEvent<HTMLElement>) {
        const $form = $('#f-' + this.id);
        const $piece = $(e.target).closest('.piece');
        let position = $form.find('.piece').index($piece);
        $piece.remove();
        this.pieces.splice(position, 1);
        this.canvasHandler.setRects(this.pieces);
        // Update input indexes
        $form.find('.piece input').each(function () {
            let $piece = $(this).closest('.piece');
            let position = $form.find('.piece').index($piece);
            let $label = $(this).parent().find('label');
            const currentName = $(this).attr('name');
            const currentId = $(this).attr('id');
            const currentLabelTarget = $label.attr('for');
            currentName && $(this).attr('name', currentName.replace(/\[\d+\]/, "[" + position + "]"));
            currentId && $(this).attr('id', currentId.replace(/\[\d+\]/, "[" + position + "]"));
            currentLabelTarget && $label.attr('for', currentLabelTarget.replace(/\[\d+\]/, "[" + position + "]"))
        });
        // Update btn delete indexes
        $form.find('.piece .btn-delete').each(function () {
            let $piece = $(this).closest('.piece');
            let position = $form.find('.piece').index($piece);
            let $label = $(this).parent().find('label');
            const currentName = $(this).attr('name');
            const currentId = $(this).attr('id');
            const currentLabelTarget = $label.attr('for');
            currentName && $(this).attr('name', currentName.replace(/\[\d+\]/, "[" + position + "]"));
            currentId && $(this).attr('id', currentId.replace(/-\d+/, "-" + position));
            currentLabelTarget && $label.attr('for', currentLabelTarget.replace(/-\d+/, "-" + position))
        });
    }

    protected changePiece(e: JQuery.TriggeredEvent<HTMLElement>) {
        const $piece = $(e.target).closest('.piece')
        // Change the data of the corresponding rectangle
        let name = $(e.target).attr('name');
        let matched = name.match(/\[([A-Za-z])\]$/);
        // Properties with a single letter (we do not want alt properties)
        if (matched) {
            let position = $('#f-' + this.id).find('.piece').index($piece);
            let rect = this.pieces[position];
            let value = $(e.target).val();
            if (value) {
                rect[<'x' | 'y' | 'w' | 'h'>matched[1]] = value.toString();
                this.canvasHandler.setRects(this.pieces);
            }
        }
    }

    settingsOpened() {
        const self = this;
        const constructor = <typeof WidgetPiecesElement>self.constructor;
        let $form = $('#f-' + self.id);
        let $piecesContainer = $form.find('.pieces');
        self.pieces = structuredClone(self.data?.pieces || []) as PieceElement[];
        self.canvasHandler = new CanvasHelper($form.find('.img-preview').first().get(0) as HTMLCanvasElement);
        self.pieces.forEach((rect, idx) =>
            import('./piece.hbs').then(({ default: piece }) =>
                $piecesContainer.append(piece({ ...rect, pos: idx, widget: constructor.widget }))));

        $(window).on('resize.pieces', () => self.canvasHandler.onResize());
        $form.on('actionRect.pieces', 'canvas', function (_, position) { self.onActionRect(position) });
        $form.on('click.pieces', '.btn-delete', function (e) { self.deletePiece(e) });
        $form.on('click.pieces', '.btn-add-piece', function (e) { self.addPiece(e) });
        $form.on('change.pieces', 'input[name^="piece"]', function (e) { self.changePiece(e); });
    }

    settingsClosed() {
        this.canvasHandler.destroy();
        $(`#f-${this.id}`).off('pieces');
        $(window).off('pieces');
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
        this.data.pieces = form.piece;
    }

    validateModel(): string[] {
        const constructor = <typeof WidgetPiecesElement>this.constructor;
        let errors: string[] = [];
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
            errors.push("common.alt.invalid")
        if (this.data.pieces.length == 0)
            errors.push(constructor.widget + ".piece.empty");
        if (this.data.pieces.length > 1) {
            this.data.pieces.forEach(piece => {
                Utils.isStringEmptyOrWhitespace(<string>piece.altImg) && errors.push(constructor.widget + ".piece.altImg.invalid");
                Utils.isStringEmptyOrWhitespace(<string>piece.altRec) && errors.push(constructor.widget + ".piece.altRec.invalid");
                isNaN(parseFloat(piece['x'].toString())) && errors.push(constructor.widget + ".piece.x.invalid");
                isNaN(parseFloat(piece['y'].toString())) && errors.push(constructor.widget + ".piece.y.invalid");
                isNaN(parseFloat(piece['w'].toString())) && errors.push(constructor.widget + ".piece.w.invalid");
                isNaN(parseFloat(piece['h'].toString())) && errors.push(constructor.widget + ".piece.h.invalid");
            })
        }
        return errors;
    }

    validateForm(form: any): string[] {
        let errors: string[] = [];
        const constructor = <typeof WidgetPiecesElement>this.constructor;
        Utils.isStringEmptyOrWhitespace(form.alt) && errors.push("common.alt.invalid");
        form.instanceName.length == 0 && errors.push("common.name.invalid");
        (!form['piece'] || !Array.isArray(form['piece']) || form['piece'].length == 0) &&
            errors.push(constructor.widget + ".piece.empty");
        if (form['piece'] && Array.isArray(form['piece'])) {
            form['piece'].forEach(piece => {
                Utils.isStringEmptyOrWhitespace(piece.altImg) &&
                    errors.push(constructor.widget + ".piece.altImg.invalid");
                Utils.isStringEmptyOrWhitespace(piece.altRec) &&
                    errors.push(constructor.widget + ".piece.altRec.invalid");
                isNaN(parseFloat(piece['x'])) &&
                    errors.push(constructor.widget + ".piece.x.invalid");
                isNaN(parseFloat(piece['y'])) &&
                    errors.push(constructor.widget + ".piece.y.invalid");
                isNaN(parseFloat(piece['w'])) &&
                    errors.push(constructor.widget + ".piece.w.invalid");
                isNaN(parseFloat(piece['h'])) &&
                    errors.push(constructor.widget + ".piece.h.invalid");
            });
        }
        return errors;
    }

}