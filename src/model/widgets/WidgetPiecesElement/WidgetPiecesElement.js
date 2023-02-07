/* global $ */
import Utils from "../../../Utils";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetPiecesElement extends WidgetItemElement {

    canvas = {
        handler: function () {
            const CORNER_RESIZE_RADIUS = 15;
            const LINE_RESIZE_MARGIN = 10;
            let currentAction;
            let currentIndex;
            let isMouseDown = false;
            let canvas = this;
            let ctx = canvas.getContext('2d');
            let img;
            let paths;
            let rects; 

            let getInteractiveAreas = function () {
                let result = {'move': [], 'e-resize': [], 'w-resize': [], 'n-resize': [], 's-resize': [],
                    'nw-resize': [], 'nwse-resize': [], 'ne-resize': [], 'nesw-resize': [] }
                let ratio = $(canvas).width() / img.width;
                for (let i = 0; i < rects.length; i++) {
                    let rect = rects[i];
                    let x = rect.x * ratio;
                    let y = rect.y * ratio;
                    let w = rect.w * ratio;
                    let h = rect.h * ratio;
                    let pathRect = new Path2D();
                    pathRect.rect(x, y, w, h);
                    result['move'].push(pathRect);
                    let pathLine = new Path2D();
                    pathLine.rect(x - LINE_RESIZE_MARGIN, y + CORNER_RESIZE_RADIUS, 2 * LINE_RESIZE_MARGIN, h - CORNER_RESIZE_RADIUS);
                    result['w-resize'].push(pathLine);
                    pathLine = new Path2D();
                    pathLine.rect(x + w - LINE_RESIZE_MARGIN, y + CORNER_RESIZE_RADIUS, LINE_RESIZE_MARGIN * 2, h - CORNER_RESIZE_RADIUS);
                    result['e-resize'].push(pathLine);
                    pathLine = new Path2D();
                    pathLine.rect(x + CORNER_RESIZE_RADIUS, y - LINE_RESIZE_MARGIN, w - CORNER_RESIZE_RADIUS,  2 * LINE_RESIZE_MARGIN);
                    result['n-resize'].push(pathLine);
                    pathLine = new Path2D();
                    pathLine.rect(x + CORNER_RESIZE_RADIUS, y + h - LINE_RESIZE_MARGIN, w - CORNER_RESIZE_RADIUS,  2 * LINE_RESIZE_MARGIN);
                    result['s-resize'].push(pathLine);
                    let pathCircles = new Path2D();
                    pathCircles.arc(x, y, CORNER_RESIZE_RADIUS, 0, 2 * Math.PI);
                    result['nw-resize'].push(pathCircles);
                    pathCircles = new Path2D();
                    pathCircles.arc(x + w, y + h, CORNER_RESIZE_RADIUS, 0, 2 * Math.PI);
                    result['nwse-resize'].push(pathCircles);
                    pathCircles = new Path2D();
                    pathCircles.arc(x + w, y, CORNER_RESIZE_RADIUS, 0, 2 * Math.PI);
                    result['ne-resize'].push(pathCircles);
                    pathCircles = new Path2D();
                    pathCircles.arc(x, y + h, CORNER_RESIZE_RADIUS, 0, 2 * Math.PI);
                    result['nesw-resize'].push(pathCircles);
                }
                return result;
            }

            let draw = function () {
                let ratio = $(canvas).width() / img.width;
                let lineWidth = Math.round(2/ratio);
				ctx.fillStyle = "white";
                ctx.fillRect(0, 0, img.width, img.width);
                ctx.drawImage(img, 0, 0);
                ctx.lineWidth = lineWidth.toString();
                ctx.beginPath();
                for (let i = 0; i < rects.length; i++) {
                    let rect = rects[i];
                    ctx.rect(rect.x, rect.y, rect.w, rect.h);
                    ctx.strokeStyle = "rgba(0,0,0,1)";
                    ctx.setLineDash([]);
                    ctx.stroke();
                    ctx.strokeStyle = "rgba(255,255,255,1)";
                    ctx.setLineDash([Math.round(5/ratio), Math.round(5/ratio)]);
                    ctx.stroke();
                }                
                ctx.closePath();
            }

            let onmousedown = function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.buttons == 1) {
                    isMouseDown = true;
                    let x = e.offsetX;
                    let y = e.offsetY;
                    // Determine de action that the user wants to do based on the mouse coordinates
                    for (const [key, path] of Object.entries(paths)) {
                        let idx = path.findIndex(elem => ctx.isPointInPath(elem, x, y));
                        if (idx !== -1) {
                            currentIndex = idx;
                            currentAction = key;
                            canvas.style.cursor = key;
                            return;
                        }
                    }
                    currentAction = 'none';
                    canvas.style.cursor = 'auto';
                }
            }

            let onmousemove = function (e) {
                e.preventDefault();
                e.stopPropagation();
                // Mouse up
                if (isMouseDown && e.buttons !== 1)
                    paths = getInteractiveAreas();
                isMouseDown = e.buttons == 1;
                if (isMouseDown && currentAction !== 'none') {
                    let ratio = $(canvas).width() / img.width;
                    let rect = rects[currentIndex];
                    let sX = e.movementX / ratio;
                    let sY = e.movementY / ratio;
                    switch (currentAction) {
                        case "move":        rect['x'] += sX; rect['y'] += sY; break;
                        case "e-resize":    rect['w'] += sX; break;
                        case "w-resize":    rect['x'] += sX; rect['w'] -= sX; break;
                        case "n-resize":    rect['y'] += sY; rect['h'] -= sY; break;
                        case "s-resize":    rect['h'] += sY; break;
                        case "nw-resize":   rect['x'] += sX; rect['w'] -= sX; rect['y'] += sY; rect['h'] -= sY; break;
                        case "nwse-resize": rect['w'] += sX; rect['h'] += sY; break;
                        case "ne-resize":   rect['w'] += sX; rect['y'] += sY; rect['h'] -= sY; break;
                        case "nesw-resize": rect['x'] += sX; rect['w'] -= sX; rect['h'] += sY; break;
                    }
                    draw();
                    
                    const event = $.Event("actionRect");
                    $(canvas).trigger(event, [currentIndex]);
                    return;
                }
                for (const [key, path] of Object.entries(paths)) {
                    if (path.some(elem => ctx.isPointInPath(elem, e.offsetX, e.offsetY))) {
                        canvas.style.cursor = key;
                        return;
                    }
                }
                canvas.style.cursor = 'auto';
            };

            let destroy = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                rects = null;
                img = null;
                canvas.removeEventListener('mousedown', onmousedown);
                canvas.removeEventListener('mousemove', onmousemove);
            };

            let refreshPieces = function (rs) {
                rects = rs;
                paths = getInteractiveAreas(img, rects);
                draw();
            }

            let init = function (im, rs) {
                destroy();
                img = im;
                canvas.width = im.width;
                canvas.height = im.height;
                canvas.addEventListener('mousemove', onmousemove);
                canvas.addEventListener('mousedown', onmousedown);
                refreshPieces(rs);
            }
            return { init, destroy, refreshPieces }
        }
    }

    constructor(values) { 
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: this.constructor.widget + "-" + Utils.generate_uuid(),
        };
        this.data = values?.data ? structuredClone(values.data) : { blob: "", alt: "", pieces: [] };
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                blob: this.data.blob,
                pieces: this.data.pieces,
                instanceName: this.params.name,
                help: this.params.help,
                alt: this.data.alt,
                widget: this.widget
            };
            return {
                inputs: form(data),
                title: this.translate("widgets." + this.constructor.widget + ".label")
            }
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets." + this.constructor.widget + ".label");
    }

    settingsOpened() {
        const self = this;
        let $form = $('#f-' + this.id);
        let $piecesContainer = $form.find('.pieces');
        const $iImg = $('input[name=image]');
        const $iBlob = $('input[name=blob]');
        $iImg.prop('required', !this.data.blob);
        let rects = $.extend(true, [], this.data.pieces);
        for (let chr of ['x', 'y', 'w', 'h'])
            rects.forEach(rect => rect[chr] = parseFloat(rect[chr]))
        let canvas = $form.find('.img-preview').first().get(0);
        let onActionRect = function (e, position) {
            let rect = rects[position];
            let $group = $form.find('.piece').eq(position);
            let $inputs = $group.find('input');
            $inputs.eq(2).val(rect.x);
            $inputs.eq(3).val(rect.y);
            $inputs.eq(4).val(rect.w);
            $inputs.eq(5).val(rect.h);
        }

        const loadImageIntoCanvas = function(dataUrl) {
            let tmpImage = new Image;
            tmpImage.onload = function () {
                $form.find('.pieces-wrapper').removeClass('d-none');
                let img = this;
                setTimeout(function () { canvasHandler.init(img, rects); }, 150);
            }
            tmpImage.src = dataUrl;
        }

        let canvasHandler = this.canvas.handler.apply(canvas, [this]);
        rects.forEach((rect, idx) => 
            import('./piece.hbs').then(({default: piece}) => 
                $piecesContainer.append(piece({ ...rect, pos: idx, widget: self.widget }))));

        $(window).on('resize.pieces', function () {
            canvasHandler.refreshPieces(rects); 
        });

        $form.on('destroyCanvas.pieces', function () { canvasHandler.destroy(); })
        $form.on('actionRect.pieces', 'canvas', onActionRect); 
        $form.on('click.pieces', '.btn-delete', function () {
            let $piece = $(this).closest('.piece');
            let position = $form.find('.piece').index($piece);
            rects.splice(position, 1);
            canvasHandler.refreshPieces(rects);
            $(this).closest('.piece').remove();
            $form.find('.piece input').each(function () {
                let $piece = $(this).closest('.piece');
                let position = $form.find('.piece').index($piece);
                let $label = $(this).parent().find('label');
                $(this).attr('name', $(this).attr('name').replace(/\[\d+\]/, "[" + position + "]"));
                $(this).attr('id', $(this).attr('id').replace(/\[\d+\]/, "[" + position + "]"));
                $label.attr('for', $label.attr('for').replace(/\[\d+\]/, "[" + position + "]"))
            })
            $form.find('.piece .btn-delete').each(function () {
                let $piece = $(this).closest('.piece');
                let position = $form.find('.piece').index($piece);
                let $label = $(this).parent().find('label');
                $(this).attr('id', $(this).attr('id').replace(/-\d+/, "-" + position));
                $label.attr('for', $label.attr('for').replace(/-\d+/, "-" + position))
            });
        });
        $form.on('click.pieces', '.btn-add-piece', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let idx = rects.length;
            let rect = { x: 10, y: 10, w: 100, h: 100 };
            rects.push(rect)
            import('./piece.hbs').then(({default: piece}) =>
                $form.find('.pieces').append(piece({...rect, pos: idx, widget: self.widget })));
            canvasHandler.refreshPieces(rects);
        });
        $form.on('change.pieces', 'input[name="image"]', function () {
            $form.find('.pieces-wrapper').addClass('d-none');
            $iBlob.val('');
            $iImg.prop('required', true);
            if (this.files[0]) {
                Utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    loadImageIntoCanvas(value);
                    $iImg.prop('required', false);
                    $iBlob.val(value);
                });
            }
        });

        $form.on('change.pieces', 'input[name^="piece"]', function () {
            let name = $(this).attr('name');
            let matched = name.match(/\[([A-Za-z])\]$/);
            // Properties with a single letter (we do not want alt properties)
            if (matched) {
                let $piece = $(this).closest('.piece');
                let position = $form.find('.piece').index($piece);
                let rect = rects[position];
                let value = $(this).val();
                rect[matched[1]] = parseFloat(value);
                canvasHandler.refreshPieces(rects);
            }
        });

        this.data.blob && loadImageIntoCanvas(this.data.blob);
    }

    settingsClosed() {
        $(`#f-${this.id}`).trigger('destroyCanvas.pieces');
        $(`#f-${this.id}`).off('pieces');
        $(window).off('pieces');
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.blob = form.blob;
        this.data.alt = form.alt;
        this.data.pieces = form.piece;
    }
    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = this.constructor.widget + "-" + this.id;
    }  

    validateModel() {
        let errors = [];
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
             errors.push("common.alt.invalid")
        if (!Utils.isValidBase64DataUrl(this.data.blob))
            errors.push("common.imageblob.invalid");
        if (this.data.pieces.length == 0)
            errors.push(this.constructor.widget + ".piece.empty");
        if (this.data.pieces.length > 1) {
            this.data.pieces.forEach(piece => {
                Utils.isStringEmptyOrWhitespace(piece.altImg) && errors.push(this.constructor.widget + ".piece.altImg.invalid");
                Utils.isStringEmptyOrWhitespace(piece.altRec) && errors.push(this.constructor.widget + ".piece.altRec.invalid");
                isNaN(parseFloat(piece['x'])) && errors.push(this.constructor.widget + ".piece.x.invalid");
                isNaN(parseFloat(piece['y'])) && errors.push(this.constructor.widget + ".piece.y.invalid");
                isNaN(parseFloat(piece['w'])) && errors.push(this.constructor.widget + ".piece.w.invalid");
                isNaN(parseFloat(piece['h'])) && errors.push(this.constructor.widget + ".piece.h.invalid");
            })
        }
        return errors;
    }

    validateForm(form) {
        let errors = [];
        Utils.isStringEmptyOrWhitespace(form.alt) && errors.push("common.alt.invalid");
        !Utils.isValidBase64DataUrl(form.blob) && errors.push("common.imageblob.invalid");
        form.instanceName.length == 0 && errors.push("common.name.invalid");
        (!form['piece'] || !Array.isArray(form['piece']) || form['piece'].length == 0) && 
            errors.push(this.constructor.widget + ".piece.empty");
        if (form['piece'] && Array.isArray(form['piece'])) {
            form['piece'].forEach(piece => {
                Utils.isStringEmptyOrWhitespace(piece.altImg) && 
                    errors.push(this.constructor.widget + ".piece.altImg.invalid");
                Utils.isStringEmptyOrWhitespace(piece.altRec) && 
                    errors.push(this.constructor.widget + ".piece.altRec.invalid");
                isNaN(parseFloat(piece['x'])) && 
                    errors.push(this.constructor.widget + ".piece.x.invalid");
                isNaN(parseFloat(piece['y'])) && 
                    errors.push(this.constructor.widget + ".piece.y.invalid");
                isNaN(parseFloat(piece['w'])) && 
                    errors.push(this.constructor.widget + ".piece.w.invalid");
                isNaN(parseFloat(piece['h'])) && 
                    errors.push(this.constructor.widget + ".piece.h.invalid");
            });
        }
        return errors;
    }

}