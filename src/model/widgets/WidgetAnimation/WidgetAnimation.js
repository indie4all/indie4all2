/* global $ */
import Utils from "../../../Utils"

import form from './form.hbs'
import piece from './piece.hbs'
import './styles.scss';
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement"

export default class WidgetAnimation extends WidgetItemElement {
    
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

    config = {
        widget: "Animation",
        type: "element",
        label: "Animation",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAz1BMVEUAAAB4h5oeN1YeN1Z4h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///94h5oeN1a7w8xhc4n5DVxWaIDu8PLHzdXV2d/x8vT3+Pnh5OjM0dn7+/zl6Oz+4evQ1dy/x8+Om6oqQl/a3uT9wtaqtL/8hq1ygpVHXHXz9Pbq7O/9pMKcp7X7Z5n6SYT6KnA5T2v4ts38dqNPY3snP13/8PXKwc38lbeAjqCebo/7WI7tPHr5G2bsD1zRFVt+JVmaH1lHL1e+6C3CAAAAEXRSTlMAQECAMPfg0GAQuqagl4BwMDhYLxIAAAF3SURBVEjHzdTZcoIwFIDhiFvtDokISUBEEMR9q93393+mhohgK5C0V/0vYJj55nAROCBOKe8aZFXrUFD9ZG/P/BlRS7MeYKIViFRhXr3FcXWkiiNQ2eFO+jbkFuojPHYnEjgvOpbGjouQ6XTLcNeyLQbooI94fUxT3G5cZtgwLMwFttFBeLzHmnaeYlSUnWKtxrE4jiv/DpOOj+Qne22LXe+nQpw11J9u2Q0TGTzV9eV6toJ+hEsxjiJTDXTWB4wbhfmYmuZsFIPVox739sn5KiQ52INpOu/1HfL88BgTM01Per7jj7j0UJZ7/bIWn+CCuV4QDDeL5UYGz6W/jSEbLI/ZYCEeIJwcYU+MjWRtBPNffM+9eDClApw1cRGynRLM14bzbW0MaD42DAdz8GNt0BxsoKJwzmRiFPXnv1ty8ydYgaYYe9uIY3Dqh0Qw14M32g6DCyhqyy3HoKWwrtrFccpxUk0TlmHQFNkGyKo1BbYGDquUxsAXPhWNRXY4UVUAAAAASUVORK5CYII=",
        cssClass: "widget-animation"
    }

    emptyData() {
        return {
            params: { name: this.config.label + "-" + Utils.generate_uuid() },
            data: { blob: "", alt: "", pieces: [] }
        };
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            blob: model.data.blob,
            pieces: model.data.pieces,
            instanceName: model.params.name,
            help: model.params.help,
            alt: model.data.alt
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.Animation.label")
        }
    }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.innerHTML = model.params.name ? model.params.name : this.translate("widgets.Animation.label");
        return element;
    }

    settingsClosed(model) {
        $(`#f-${model.id}`).trigger('destroyCanvas.animation');
        $(`#f-${model.id}`).off('animation');
        $(window).off('animation');
    }

    settingsOpened(model) {
        
        let $form = $('#f-' + model.id);
        let $piecesContainer = $form.find('.pieces');
        const $iImg = $('input[name=image]');
        const $iBlob = $('input[name=blob]');
        $iImg.prop('required', !model.data.blob);
        let rects = $.extend(true, [], model.data.pieces);
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
        rects.forEach((rect, idx) => $piecesContainer.append(piece({ ...rect, pos: idx })));

        $(window).on('resize.animation', function () {
            canvasHandler.refreshPieces(rects); 
        });

        $form.on('destroyCanvas.animation', function () { canvasHandler.destroy(); })
        $form.on('actionRect.animation', 'canvas', onActionRect); 
        $form.on('click.animation', '.btn-delete', function () {
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

        $form.on('click.animation', '.btn-add-piece', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let idx = rects.length;
            let rect = { x: 10, y: 10, w: 100, h: 100 };
            rects.push(rect)
            $form.find('.pieces').append(piece({...rect, pos: idx }));
            canvasHandler.refreshPieces(rects);
        });

        $form.on('change.animation', 'input[name="image"]', function () {
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

        $form.on('change.animation', 'input[name^="piece"]', function () {
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

        model.data.blob && loadImageIntoCanvas(model.data.blob);
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
        model.data.blob = form.blob;
        model.data.alt = form.alt;
        model.data.pieces = form.piece;  
    }

    validateModel(widget) {
        let errors = [];
        if (!Utils.hasNameInParams(widget))
            errors.push("common.name.invalid");
        
        if (Utils.isStringEmptyOrWhitespace(widget.data.alt))
             errors.push("common.alt.invalid");

        if (!Utils.isValidBase64DataUrl(widget.data.blob))
            errors.push("common.imageblob.invalid");
        
        if (widget.data.pieces.length == 0)
            errors.push("Animation.piece.empty");
        
        if (widget.data.pieces.length > 1) {
            widget.data.pieces.forEach(piece => {
                Utils.isStringEmptyOrWhitespace(piece.altImg) && errors.push("Animation.piece.altImg.invalid");
                Utils.isStringEmptyOrWhitespace(piece.altRec) && errors.push("Animation.piece.altRec.invalid");
                isNaN(parseFloat(piece['x'])) && errors.push("Animation.piece.x.invalid");
                isNaN(parseFloat(piece['y'])) && errors.push("Animation.piece.y.invalid");
                isNaN(parseFloat(piece['w'])) && errors.push("Animation.piece.w.invalid");
                isNaN(parseFloat(piece['h'])) && errors.push("Animation.piece.h.invalid");
            })
        } 
        return errors;
    }

    validateForm(form) {
        let errors = [];
        Utils.isStringEmptyOrWhitespace(form.alt) && errors.push("common.alt.invalid");
        !Utils.isValidBase64DataUrl(form.blob) && errors.push("common.imageblob.invalid");
        form.instanceName.length == 0 && errors.push("common.name.invalid");
        (!form['piece'] || !Array.isArray(form['piece']) || form['piece'].length == 0) && errors.push("Animation.piece.empty");
        if (form['piece'] && Array.isArray(form['piece'])) {
            form['piece'].forEach(piece => {
                Utils.isStringEmptyOrWhitespace(piece.altImg) && errors.push("Animation.piece.altImg.invalid");
                Utils.isStringEmptyOrWhitespace(piece.altRec) && errors.push("Animation.piece.altRec.invalid");
                isNaN(parseFloat(piece['x'])) && errors.push("Animation.piece.x.invalid");
                isNaN(parseFloat(piece['y'])) && errors.push("Animation.piece.y.invalid");
                isNaN(parseFloat(piece['w'])) && errors.push("Animation.piece.w.invalid");
                isNaN(parseFloat(piece['h'])) && errors.push("Animation.piece.h.invalid");
            });
        }
        return errors;
    }

}