indieauthor.widgets.Puzzle = {
    widgetConfig: {
        widget: "Puzzle",
        type: "element",
        label: "Puzzle",
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function () {
        var itemTemplate = '<div class="palette-item" data-category="{{category}}" data-type="{{type}}" data-widget="{{widget}}"> <img src="' + this.icon + '" class="img-fluid"/> <br/> <span> {{translate "widgets.Puzzle.label"}}</span></div>';
        var item = {};
        item.content = indieauthor.renderTemplate(itemTemplate, this.widgetConfig);
        item.numItems = 1;
        return item;
    },
    createElement: function (widgetInfo) {
        return indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
    },
    template: function () {
        return '<div class="widget widget-puzzle" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"> <div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"></div><div class="b2" data-prev><span>{{translate "widgets.Puzzle.prev"}}</span></div><div class="b3" data-toolbar></div></div>';
    },
    getInputs: function (modelValues) {
        var templateValues = {
            instanceId: modelValues.id,
            image: modelValues.data.image,
            blob: modelValues.data.blob,
            pieces: modelValues.data.pieces,
            instanceName: modelValues.params.name,
            help: modelValues.params.help,
            alt: modelValues.data.alt
        };

        var template = `
            <form id="f-{{instanceId}}">
                <div class="form-group">
                    <label for="instanceName">{{translate "common.name.label"}}</label>
                    <input type="text" name="instanceName" class="form-control" value="{{instanceName}}" placeholder="{{translate "common.name.placeholder"}}" autocomplete="off" required/> 
                    <small class="form-text text-muted">{{translate "common.name.help"}}</small>
                </div>
                <div class="form-group">
                    <label for="help">{{translate "common.help.label"}}</label>
                    <div class="input-group mb-3"> 
                        <input name="help" type="text" class="form-control" placeholder="{{translate "common.help.placeholder"}}" value="{{help}}">
                        <div class="input-group-append">
                            <button class="btn btn-indie" type="button" onclick="$(\'input[name=help]\').val(\'\')">{{translate "common.help.button"}}</button> 
                        </div>
                    </div>
                    <small class="form-text text-muted">{{translate "common.help.help"}}</small>
                </div>
                <div class="form-group">
                    <label for="image">{{translate "widgets.Puzzle.form.image.label"}}</label>
                    <input type="url" class="form-control" name="image" required autocomplete="off" placeholder="{{translate "widgets.Puzzle.form.image.placeholder"}}" value="{{image}}"/>
                    <small class="form-text text-muted">{{translate "widgets.Puzzle.form.image.help"}}</small>
                    <input type="hidden" name="blob" value="{{blob}}" />
                </div>
                <div class="form-group">
                    <label for="alt">{{translate "common.alt.label"}}</label>
                    <input type="text" class="form-control" name="alt" required autocomplete="off" placeholder="{{translate "common.alt.placeholder"}}" value="{{alt}}"/>
                    <small class="form-text text-muted">{{translate "common.alt.help"}}</small>
                </div>
                <div class="pieces-wrapper d-none">
                    <div class="form-group"> 
                        <p>{{translate "widgets.Puzzle.form.image.preview"}}</p>
                        <canvas class="img-preview img-fluid"></canvas>
                    </div>
                    <div class="form-group"> 
                        <button class="btn btn-block btn-indie btn-add-piece" type="button">{{translate "widgets.Puzzle.form.pieces.new"}}</button> 
                    </div>
                    <div class="pieces"></div>
                </div>
            </form>
            `;
        var rendered = indieauthor.renderTemplate(template, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.Puzzle.label
        }
    },
    formPieceTemplate: function (values) {
        let template = `
        <div class="form-row piece">
            <div class="form-group col-12 col-md-4">
                <label for="piece[{{pos}}][altImg]">{{translate "widgets.Puzzle.form.pieces.altImg"}}</label>
                <input type="text" class="form-control" id="piece[{{pos}}][altImg]" name="piece[{{pos}}][altImg]" value="{{altImg}}" step="any" required />
            </div>
            <div class="form-group col-12 col-md-4">
                <label for="piece[{{pos}}][altRec]">{{translate "widgets.Puzzle.form.pieces.altRec"}}</label>
                <input type="text" class="form-control" id="piece[{{pos}}][altRec]" name="piece[{{pos}}][altRec]" value="{{altRec}}" step="any" required />
            </div>
            <div class="form-group col-6 col-md-2">
                <label for="piece[{{pos}}][x]">{{translate "widgets.Puzzle.form.pieces.x"}}</label>
                <input type="number" class="form-control" id="piece[{{pos}}][x]" name="piece[{{pos}}][x]" value="{{x}}" min="0" step="any" required />
            </div>
            <div class="form-group col-6 col-md-2">
                <label for="piece[{{pos}}][y]">{{translate "widgets.Puzzle.form.pieces.y"}}</label>
                <input type="number" class="form-control" id="piece[{{pos}}][y]" name="piece[{{pos}}][y]" value="{{y}}" min="0" step="any" required />
            </div>
            <div class="form-group col-6 col-md-2">
                <label for="piece[{{pos}}][w]">{{translate "widgets.Puzzle.form.pieces.w"}}</label>
                <input type="number" class="form-control" id="piece[{{pos}}][w]" name="piece[{{pos}}][w]" value="{{w}}" min="0" step="any" required />
            </div>
            <div class="form-group col-6 col-md-2">
                <label for="piece[{{pos}}][h]">{{translate "widgets.Puzzle.form.pieces.h"}}</label>
                <input type="number" class="form-control" id="piece[{{pos}}][h]" name="piece[{{pos}}][h]" value="{{h}}" min="0" step="any" required />
            </div>
            <div class="form-group col-12 col-md-auto">
                <label for="delete-piece-{{pos}}">{{translate "widgets.Puzzle.form.pieces.delete"}} &nbsp;</label>
                <button class="btn btn-block btn-danger btn-delete" id="delete-piece-{{pos}}"><i class="fa fa-times"></i></button>
            </div>
        </div>`
        return indieauthor.renderTemplate(template, values)
    },

    settingsClosed: function (modelObject) {
        $(`#f-${modelObject.id}`).trigger('destroyCanvas.puzzle');
        $(`#f-${modelObject.id}`).off('puzzle');
        $(window).off('puzzle');
    },
    settingsOpened: function (modelObject) {
        
        let $form = $('#f-' + modelObject.id);
        let $piecesContainer = $form.find('.pieces');
        let rects = $.extend(true, [], modelObject.data.pieces);
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

        let canvasHandler = indieauthor.widgets.Puzzle.canvas.handler.apply(canvas, [this]);
        rects.forEach((rect, idx) => $piecesContainer.append(indieauthor.widgets.Puzzle.formPieceTemplate({ ...rect, pos: idx })));

        $(window).on('resize.puzzle', function () {
            canvasHandler.refreshPieces(rects); 
        });

        $form.on('destroyCanvas.puzzle', function () { canvasHandler.destroy(); })
        $form.on('actionRect.puzzle', 'canvas', onActionRect); 
        $form.on('click.puzzle', '.btn-delete', function (e) {
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
                $(this).attr('id', $(this).attr('id').replace(/\-\d+/, "-" + position));
                $label.attr('for', $label.attr('for').replace(/\-\d+/, "-" + position))
            });
        });
        $form.on('click.puzzle', '.btn-add-piece', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let idx = rects.length;
            let rect = { x: 10, y: 10, w: 100, h: 100 };
            rects.push(rect)
            $form.find('.pieces').append(indieauthor.widgets.Puzzle.formPieceTemplate({...rect, pos: idx }));
            canvasHandler.refreshPieces(rects);
        });
        $form.on('change.puzzle', 'input[name="image"]', function (e) {
            let tmpImage = new Image;
            tmpImage.onload = function () {
                $form.find('.pieces-wrapper').removeClass('d-none');
                let img = this;
                setTimeout(function () { canvasHandler.init(img, rects); }, 150);
                
            }
            $form.find('.pieces-wrapper').addClass('d-none');
            if (indieauthor.utils.isIndieResource(e.target.value))
                tmpImage.src = e.target.value;

            indieauthor.utils.encodeAsBase64DataURL(e.target.value).then(value => 
                $('input[name="blob"]').val(value));

        });

        $form.on('change.puzzle', 'input[name^="piece"]', function (e) {
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

        modelObject.data.image && $form.find('input[name="image"]').trigger('change.puzzle');
    },
    preview: function (modelObject) {
        let element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = modelObject.params.name ? modelObject.params.name : indieauthor.strings.widgets.Puzzle.label;
    },
    emptyData: function () {
        return {
            params: {
                name: this.widgetConfig.label + "-" + indieauthor.utils.generate_uuid(),
            },
            data: {
                image: "",
                blob: "",
                alt: "",
                pieces: []
            }
        };
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.params.name = formJson.instanceName;
        modelObject.params.help = formJson.help;
        modelObject.data.image = formJson.image;
        modelObject.data.blob = formJson.blob;
        modelObject.data.alt = formJson.alt;
        modelObject.data.pieces = formJson.piece;
        
    },
    validateModel: function (widgetInstance) {
        let errors = [];
        if (!indieauthor.utils.hasNameInParams(widgetInstance))
            errors.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(widgetInstance.params.name, widgetInstance.id))
            errors.push("common.name.notUniqueName");
        
        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.alt))
             errors.push("common.alt.invalid")

        if (!indieauthor.utils.isIndieResource(widgetInstance.data.image))
            errors.push("Puzzle.image.invalid");
        
        if (widgetInstance.data.pieces.length == 0)
            errors.push("Puzzle.piece.empty");
        
        if (widgetInstance.data.pieces.length > 1) {
            widgetInstance.data.pieces.forEach(piece => {
                indieauthor.utils.isStringEmptyOrWhitespace(piece.altImg) && errors.push("Puzzle.piece.altImg.invalid");
                indieauthor.utils.isStringEmptyOrWhitespace(piece.altRec) && errors.push("Puzzle.piece.altRec.invalid");
                isNaN(parseFloat(piece['x'])) && errors.push("Puzzle.piece.x.invalid");
                isNaN(parseFloat(piece['y'])) && errors.push("Puzzle.piece.y.invalid");
                isNaN(parseFloat(piece['w'])) && errors.push("Puzzle.piece.w.invalid");
                isNaN(parseFloat(piece['h'])) && errors.push("Puzzle.piece.h.invalid");
            })
        }      

        if (errors.length > 0) {
            return {
                element: widgetInstance.id,
                keys: errors
            }
        }

    },
    validateForm: function (formData, instanceId) {
        let errors = [];
        indieauthor.utils.isStringEmptyOrWhitespace(formData.alt) && errors.push("common.alt.invalid");
        !indieauthor.utils.isIndieResource(formData.image) && errors.push("Puzzle.image.invalid");
        formData.instanceName.length == 0 && errors.push("common.name.invalid");
        !indieauthor.model.isUniqueName(formData.instanceName, instanceId) && errors.push("common.name.notUniqueName");
        (!formData['piece'] || !Array.isArray(formData['piece']) || formData['piece'].length == 0) && errors.push("Puzzle.piece.empty");
        if (formData['piece'] && Array.isArray(formData['piece'])) {
            formData['piece'].forEach(piece => {
                indieauthor.utils.isStringEmptyOrWhitespace(piece.altImg) && errors.push("Puzzle.piece.altImg.invalid");
                indieauthor.utils.isStringEmptyOrWhitespace(piece.altRec) && errors.push("Puzzle.piece.altRec.invalid");
                isNaN(parseFloat(piece['x'])) && errors.push("Puzzle.piece.x.invalid");
                isNaN(parseFloat(piece['y'])) && errors.push("Puzzle.piece.y.invalid");
                isNaN(parseFloat(piece['w'])) && errors.push("Puzzle.piece.w.invalid");
                isNaN(parseFloat(piece['h'])) && errors.push("Puzzle.piece.h.invalid");
            });
        }
        return errors;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAMAAABADLOjAAABAlBMVEUAAAAeN1YeN1Z4h5oeN1YeN1Z4h5oeN1YeN1Z4h5oeN1Z4h5pOYXl4h5p4h5olPVseN1YeN1YeN1Z4h5oeN1Z4h5p4h5p4h5r////WBUt4h5oeN1aPm6vHzdVWaYA1S2f40t77X5P8+fr9tc79ob/XBUvx8/T57/L46u/35Or8lbf8j7T8faj7Z5n5GWTiBk/gBk79/Pz79/j69Pb45uz9q8b8h677TohIXXb6LnM6UGv5EV/dBU3ZBUz43+f32eO5wcr9rsmdqLX7bZ1CV3L6KG76JWzqBlL42OL6ydmrtMD8mbr8ibD8c6GAj6BygpX7WI9ic4lcboX6P336Nnf1BlbkOH6qAAAAGHRSTlMAQIC/v+9AMBDv35cg38/Pn49wYGBQMBBrtB48AAABj0lEQVRIx+3SV3eCMBgGYGrd2r2Q1CooIhS1de+67d79/3+lJJ8UQg+J3vWi7wXnPeQxhiSClUiAk+Oo8JMD1L1gB8UjNg6gkchJoR2yZw9NmBJ49xDwFiqI/DwHbS2ukfO/o/fCZxvojBQ7onUxi3ODqwbVrSUpTOleiqRu1bJK6pDSCUrLRNySvymTrlF6m9ImBo/QDaJFhs5j0IR+iXuPpRtkviyu+heuMkvniFZL+fxTiqTko4emoRDtBHRuOr72at0aalWbXt1THqydNLzaJINL/Lhy8+UAPxWP/rTeVQDYmryBFD1adljfts4Pa7SG7zPmFZjQTr/f/FBhHx0Nh7HI4tOhsxAVWX2t0RoHb9PvHYQBr4aMCSk3tJpuprhnCSupO/ekw9Ag5tB17h2cYjCoum5YlaE7RLQUq94N4FwYWiaigxfegg/WfLRP/jVfJ1F6Dd2egRaC7QIX36O3lY6EupM0M6MXNJNWWojuxxE7mXcJtBOJE1rvcnXCpcM8HEsKrpzssNdxKmyYb5RBwWFBnx50AAAAAElFTkSuQmCC",
    canvas: {
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
}