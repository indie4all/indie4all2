/** GLOBAL INSTANCE FOR THE INDIE AUTHOR PLUGIN */
var indieauthor = indieauthor || {}

/** Version number */
indieauthor.version = "1.12.2";

/** Widget functions. Inside this property, functions associated to the generation of html elements for each widget will be found. The way to access them is indieauthor.widgets[WIDGET_TYPE].function...  */
indieauthor.widgets = {};

/** Functions for handling the json model. Create an item, search an item, delete an item... */
indieauthor.model = {};

/** Functions for undo and redo */
indieauthor.undoredo = {};

/** Functions for transforming the content */
indieauthor.transform = {};

/** Strings for translations */
indieauthor.strings = {};

/** Plugin functions */
indieauthor.plugins = {};

/** API functions. */
indieauthor.api = {};

/** ICONS */
indieauthor.icons = {};

/** Dragula JS Instance */
indieauthor.drake = undefined;

/** Items palette DOM Element */
indieauthor.palette = undefined;

/** Main container DOM Element */
indieauthor.container = undefined;


// PLUGIN
/**
 * Initiates the plugin with the palette and the main container
 * 
 * @param {Element} palette DOM Element for the items palette
 * @param {Element} container DOM Element for the main container
 * @param {Function} initCallBack Function to be run when the init has finished
 */
indieauthor.init = function (palette, container, initCallBack) {
    // Configuration
    indieauthor.plugins.preparePlugins();
    indieauthor.plugins.dependencies(container);
    indieauthor.polyfill.setBrowserCapabilities();

    // Load the widgets
    indieauthor.loadWidgets(palette);

    // Stores palette and container reference
    indieauthor.palette = palette;
    indieauthor.container = container;

    // Init drake instance
    indieauthor.drake = dragula([], {
        isContainer: function (el) {
            return $(el).hasClass('dragula-container');
        },
        copy: function (el, source) {
            return (source == palette);
        },
        accepts: function (el, target) {
            return indieauthor.accept(el, target);
        },
        moves: function (el, subContainer, handle) {
            return $(handle).hasClass('drag-item') || $(el).hasClass('palette-item');
        },
        invalid: function (el) {
            return $(el).hasClass('dragula-anchor');
        },
        removeOnSpill: false
    });

    // Event associated with the drop of the element inside a DOM Container
    indieauthor.drake.on('drop', function (el, target, source, sibling) {
        indieauthor.drop(el, target, source, sibling);
    });

    if (initCallBack) initCallBack();
}

indieauthor.configure = function () {
    indieauthor.plugins.preparePlugins();
    indieauthor.polyfill.setBrowserCapabilities();
}

// FUNCTIONS ASSOCIATED WITH DRAKE EVENTS
/**
 * Function that handles the drop event in dragula.
 * 
 * @param {Element} el DOM Element to be dropped in a target
 * @param {Element} target DOM Element container in which el will be dropped 
 * @param {Element} source DOM Element container where el comes from
 * @param {Element} sibling DOM Element 
 */
indieauthor.drop = function (el, target, source, sibling) {
    if (!target) return;

    var elementType = indieauthor.polyfill.getData(el, 'type'); // Element type (element, container)
    var widget = indieauthor.polyfill.getData(el, 'widget'); // Widget type (TextBlock, Image...etc)
    var parentType = indieauthor.polyfill.getData(target, 'type'); // Parent type
    var parentContainerIndex = -1; // Parent container index (only for layout)
    var parentContainerId = indieauthor.polyfill.getData($(target).closest('[data-id]')[0], 'id');

    if (parentType == 'layout') parentContainerIndex = indieauthor.polyfill.getData(target, 'index');

    if (indieauthor.allowGenerate(source, target)) {
        var dataElementId = indieauthor.utils.generate_uuid();
        var inPositionElementId = sibling != null ? indieauthor.polyfill.getData(sibling.firstChild, 'id') : -1;

        indieauthor.createViewElement(elementType, widget, el, dataElementId, parentType, parentContainerIndex, parentContainerId, inPositionElementId, true);

        // UndoRedo
        indieauthor.undoredo.pushCommand("add", dataElementId, {
            element: jQuery.extend({}, indieauthor.model.findObject(dataElementId)),
            parentType: parentType,
            parentContainerIndex: parentContainerIndex,
            parentContainerId: parentContainerId,
            inPositionElementId: inPositionElementId,
            view: el.outerHTML
        });
    } else if (source != target) {
        // Move one element from a container to another
        indieauthor.handleMoveElementIntoContainer(el, target, sibling);
    } else if (source == target) {
        // Move the element inside the same container
        indieauthor.handleMoveElement(el, target);
    }
}

/**
 *   Only generate the element/container if it is dropped into a section container or a subcontainer inside the section container and the element/containers comes from the palette
 *  
 * @param {Element} source DOM Source
 * @param {Element} target DOM Target
 * 
 * @returns {boolean} True if the element/container is to be generated, otherwise false
 */
indieauthor.allowGenerate = function (source, target) {
    return (source == indieauthor.palette && (indieauthor.polyfill.getData(target, 'type') == 'section-container' || indieauthor.utils.contains(indieauthor.container, target)));
}

/**
 * Event handler associated withe the move of an element inside the same container 
 * 
 * @param {Element} el Element to be moved
 * @param {Element} target Target container (same as source container)
 */
indieauthor.handleMoveElement = function (el, target) {
    var elementId = indieauthor.polyfill.getData(el.firstChild, 'id');
    var containerType = indieauthor.polyfill.getData(target, 'type');

    // New order of the elements inside the target
    var targetChildren = [].slice.call(target.children).map(function (ch) {
        return indieauthor.polyfill.getData(ch.firstChild, 'id');
    });

    var newPosition = targetChildren.indexOf(indieauthor.polyfill.getData(el.firstChild, 'id'), 0);

    if (containerType == 'layout') {
        var containerId = indieauthor.polyfill.getData(target.parentNode.parentNode.parentNode, 'id'); // 3 nesting levels 
        var containerIndex = indieauthor.polyfill.getData(target, 'index');
        var parentContainer = indieauthor.model.findObject(containerId);
        var initialPosition = indieauthor.utils.findIndexObjectInArray(parentContainer.data[containerIndex], 'id', elementId);

        indieauthor.undoredo.pushCommand('move', elementId, {
            containerType: containerType,
            containerIndex: containerIndex,
            containerId: containerId,
            initialPosition: initialPosition,
            finalPosition: newPosition
        });

        indieauthor.model.moveElementWithinContainer(elementId, newPosition, containerId, containerIndex);
    } else {
        var containerId = indieauthor.polyfill.getData(target.parentNode, 'id');
        var parentContainer = indieauthor.model.findObject(containerId);
        var initialPosition = indieauthor.utils.findIndexObjectInArray(parentContainer.data, 'id', elementId);

        indieauthor.undoredo.pushCommand('move', elementId, {
            containerType: containerType,
            containerIndex: -1,
            containerId: containerId,
            initialPosition: initialPosition,
            finalPosition: newPosition
        });

        indieauthor.model.moveElementWithinContainer(elementId, newPosition, containerId);
    }
}

/**
 * Event handler associated with the move of an element to a target container above a sibling.
 * 
 * @param {Element} el Element to be moved
 * @param {Element} target Target container in which the element will be moved 
 * @param {Element} sibling Element should be put above a sibling element (can be null)
 */
indieauthor.handleMoveElementIntoContainer = function (el, target, sibling) {
    // Get the source container and source element position
    var elementId = indieauthor.polyfill.getData(el.firstChild, 'id');
    var element = indieauthor.model.findObject(elementId);
    var parentElement = indieauthor.model.findParentOfObject(elementId);
    var sourceContainerIndex = -1;
    var sourcePosition;

    if (parentElement.type == 'layout') {
        for (var i = 0; i < parentElement.data.length; i++) {
            var sourceelementIndex = indieauthor.utils.findIndexObjectInArray(parentElement.data[i], 'id', elementId);
            if (sourceelementIndex != -1) {
                sourcePosition = sourceelementIndex;
                sourceContainerIndex = i;
            }
        }
    } else {
        sourcePosition = indieauthor.utils.findIndexObjectInArray(parentElement.data, 'id', elementId);
    }

    // Get target
    var inPositionElementId = sibling != null ? indieauthor.polyfill.getData(sibling.firstChild, 'id') : -1;
    var containerType = indieauthor.polyfill.getData(target, 'type');
    var containerId;
    var containerIndex = -1;
    var containerPosition;

    if (containerType == 'layout') {
        containerId = indieauthor.polyfill.getData(target.parentNode.parentNode.parentNode, 'id');
        containerIndex = indieauthor.polyfill.getData(target, 'index');
        var targetContainer = indieauthor.model.findObject(containerId);
        containerPosition = indieauthor.utils.findIndexObjectInArray(targetContainer.data[containerIndex], 'id', inPositionElementId);
    } else {
        containerId = indieauthor.polyfill.getData(target.parentNode, 'id');
        var targetContainer = indieauthor.model.findObject(containerId);
        containerPosition = indieauthor.utils.findIndexObjectInArray(targetContainer.data, 'id', inPositionElementId);
    }

    // For command
    indieauthor.undoredo.pushCommand('moveContainer', elementId, {
        source: {
            id: parentElement.id,
            type: parentElement.type,
            position: sourcePosition,
            index: sourceContainerIndex
        },
        target: {
            id: containerId,
            type: containerType,
            position: containerPosition,
            index: containerIndex
        },
        element: jQuery.extend({}, element),
        view: this.findElementByDataId(elementId).parentNode.outerHTML
    });

    // Move
    indieauthor.model.moveElementFromContainerToAnother(elementId, inPositionElementId, containerId, containerIndex);
}

/**
 * Determines if the element can be dropped in the target. 
 * 
 * @param {Element} element DOM element
 * @param {Element} target DOM target
 * 
 * @returns {boolean} true if element can be dropped, otherwise false
 */
indieauthor.accept = function (element, target) {
    // Depending if the element comes from the palette or from the main container, the info will be inside the element's first child or the element itself
    var originElement = $(element).hasClass('palette-item') ? element : element.firstChild;

    // Extract the info
    var itemType = indieauthor.polyfill.getData(originElement, 'type');
    var itemWidget = indieauthor.polyfill.getData(originElement, 'widget');
    var targetType = indieauthor.polyfill.getData(target, 'type');
    var targetWidget = indieauthor.polyfill.getData(target, 'widget');

    // We ask the widgets if the target is not the palette
    if (target != indieauthor.palette && (!indieauthor.canDrop(itemType, itemWidget, targetType, targetWidget)))
        return false;

    /* We must not accept the movement if
        -- The target container is inside the palette
        -- If the target container is, in fact, the palette 
        -- If the target container is the element itself  
    */
    return (!indieauthor.utils.contains(indieauthor.palette, target) && (target !== indieauthor.palette) && !indieauthor.utils.contains(element, target));
}

/**
 * Determines wether an item can be placed inside a target.
 * 
 * @param {*} itemType  Item type 
 * @param {*} itemWidget Item widget
 * @param {*} targetType Target type
 * @param {*} targetWidget Target widget
 */
indieauthor.canDrop = function (itemType, itemWidget, targetType, targetWidget) {
    // 0 - If the item has the same type as the target, the item won't be dropped   
    if (itemType == targetType)
        return false;

    // 1 - If the item is an element-container it can not be dropped in the main container. 
    if (targetType == 'section-container' && (itemType != 'element-container' && itemType != 'specific-element'))
        return true;

    // 2 - Specific cases
    if (targetType == 'specific-container' || targetType == 'specific-element-container') {
        // 2.1 - specific containers has inside the allow configuration value the widget  
        var containersAllowed = indieauthor.widgets[targetWidget].widgetConfig.allow;
        return (indieauthor.utils.stringIsInArray(itemWidget, containersAllowed));
    } else if (targetType == 'element-container' || targetType == 'layout' || targetType == 'simple-container') {
        // 2.2 - layout or element containers has inside the allow configuration value the types of elements that can be placed inside
        var typesAllowed = indieauthor.widgets[targetWidget].widgetConfig.allow;
        return (indieauthor.utils.stringIsInArray(itemType, typesAllowed));
    }
}

indieauthor.copyModelElement = function (element, section, isCommand) {
    let copy = indieauthor.model.copyElement(element);
    let container = document.getElementById('section-elements-' + section.id);
    indieauthor.loadElement(container, copy, false, false);
    section.data.push(copy);
    if (isCommand) {
        indieauthor.undoredo.pushCommand("add", copy.id, {
            element: copy,
            parentType: 'section-container',
            parentContainerIndex: indieauthor.model.sections.indexOf(section),
            parentContainerId: section.id,
            inPositionElementId: -1, // Change
            view: $(`[data-id=${copy.id}]`).closest('.container-item').prop('outerHTML')
        });
    }
}

indieauthor.importElement = function (sectionId, isCommand) {
	
	try {
        const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
        const encrypted = localStorage.getItem('copied-element');
        const json = CryptoJS.AES.decrypt(encrypted, userCookie.split('=')[1]).toString(CryptoJS.enc.Utf8);
        if (json) {
            const position = indieauthor.utils.findIndexObjectInArray(indieauthor.model.sections, "id", sectionId);
            const section = indieauthor.model.sections[position];
            indieauthor.copyModelElement(JSON.parse(json), section, isCommand);
            indieauthor.utils.notifiySuccess(indieauthor.strings.messages.successMessage, indieauthor.strings.messages.importedElement);
            return;
        }
		localStorage.removeItem('copied-element');
        indieauthor.utils.notifyWarning(indieauthor.strings.messages.warningMessage, indieauthor.strings.messages.noElement);
    
    } catch (err) {
        localStorage.removeItem('copied-element');
        indieauthor.utils.notifyWarning(indieauthor.strings.messages.warningMessage, indieauthor.strings.messages.noElement);    
    }    
}

indieauthor.exportElement = function (elementId) {
    try {
        const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
        const key = userCookie.split('=')[1];
        const original = indieauthor.model.findObject(elementId);
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(original), key).toString();
        localStorage.setItem('copied-element', encrypted);
        indieauthor.utils.notifiySuccess(indieauthor.strings.messages.successMessage, indieauthor.strings.messages.exportedElement);
    } catch (err) {
        indieauthor.utils.notifyWarning(indieauthor.strings.messages.warningMessage, indieauthor.strings.messages.couldNotExportElement);
    }
}

indieauthor.copyElement = function (elementId, isCommand) {
    let sectionId = $(`[data-id=${elementId}]`).closest('.section-elements').attr('id').split('-').at(-1);
    let position = indieauthor.utils.findIndexObjectInArray(indieauthor.model.sections, "id", sectionId);
    let section = indieauthor.model.sections[position];
    indieauthor.copyModelElement(indieauthor.model.findObject(elementId), section, isCommand);
}

indieauthor.copyModelSection = function (section, isCommand) {
    let copy = indieauthor.model.copyElement(section);
    indieauthor.model.sections.push(copy);
    indieauthor.loadElement(indieauthor.container, copy, true, false);
	if (isCommand) {
        indieauthor.undoredo.pushCommand('addSection', copy.id, {
            element: copy,
            parentType: "section-container",
            view: $('#sec-' + copy.id).closest('.section-container').prop('outerHTML'),
            position: (indieauthor.model.sections.length - 1)
        });
    }
}

indieauthor.importSection = function (isCommand) {
    try {
        const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
        const encrypted = localStorage.getItem('copied-section');
        const json = CryptoJS.AES.decrypt(encrypted, userCookie.split('=')[1]).toString(CryptoJS.enc.Utf8);
        if (json) {
            indieauthor.copyModelSection(JSON.parse(json), isCommand);
            indieauthor.utils.notifiySuccess(indieauthor.strings.messages.successMessage, indieauthor.strings.messages.importedSection);
			return;
        }
        localStorage.removeItem('copied-section');
        indieauthor.utils.notifyWarning(indieauthor.strings.messages.warningMessage, indieauthor.strings.messages.noSection);
    } catch (err) {
        localStorage.removeItem('copied-section');
        indieauthor.utils.notifyWarning(indieauthor.strings.messages.warningMessage, indieauthor.strings.messages.noSection);
    } 
}

indieauthor.exportSection = function (elementId) {
    try {
        const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
        const key = userCookie.split('=')[1];
        const original = indieauthor.model.findObject(elementId);
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(original), key).toString();
        localStorage.setItem('copied-section', encrypted);
        indieauthor.utils.notifiySuccess(indieauthor.strings.messages.successMessage, indieauthor.strings.messages.exportedSection);
    } catch (err) {
        indieauthor.utils.notifyWarning(indieauthor.strings.messages.warningMessage, indieauthor.strings.messages.couldNotExportSection);
    }    
}

indieauthor.copySection = function (sectionId, isCommand) {
    let position = indieauthor.utils.findIndexObjectInArray(indieauthor.model.sections, "id", sectionId);
    indieauthor.copyModelSection(indieauthor.model.sections[position], isCommand);
}

/**
 * Adds a section into the current editor instance. 
 * 
 * If sectionId is set, the section already existed in the model. If not set, a new section in the model is created.
 * 
 * @param {string} sectionId ID of the section to be added. Optional, can be undefined. 
 */
indieauthor.addSection = function (sectionId, isCommand) {
    var sectionIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA5CAYAAACS0bM2AAAACXBIWXMAAAsSAAALEgHS3X78AAAGIklEQVRoBe2aXUhcRxTHz/WjirpRaIOxKa5SYoOQuqQV7IO19iUhFWJLoA1d6GrBB180lIIWipE2XV9KVigWROKWWtpQqQZS20BLTEUakNQVQYK+uNJg0jRldU3qNlHLuTszOzuZ+7l3oZT7h2XvvTszzs8zZ+bMmQuuXLly5crV/1hKNtASHn8VALQCQB0A4PUrkmLTALAKAAsAMFkQH1t1uh+OwSU8/jIC1AUAPhtNRABgkIDGnOiTI3AJj/8sgSpzoDkEGyyIj53NtKGM4BIeP1poVGYp5YgXclpegJzGwwCV+0GpfIr9trf2J8DaXdiduQm7l2/A3mJU1jxasq0gPhax2z/bcAmPP0DAUiotgtzO45DzdmMajJEQdverGdgZ+hFg44FYGgHDdvpoCy7h8SNUgH+W23kMcnvfUAFta+MB7AS/g52hK2IL4YL4WFvW4UQwtFDe193qMHRKOEwfnQ4lh28GgDkWwQJpYEe8kD97zlEwnXYDsy+/P6pd63Hlmi1IJo8f0jow9UFmw1BPhfmQe6oBdn9aBPhjQy349O0t37P+01WX5n++ZKYJK5Zj/zUcilkFoyotSv6dsmK27r36SzTQExwOGNY1C0fWMTbdo49ZBft9/S6ERsbVb0sqLQpB7H4zrXLgzhY0z0RHe4LDhoGCIRyJPLroPc6KdnzsvY+G4PzIt+q3BUUURTlD1roQrdYwdwuK/n5o6H9mLNfKIg9cx3C6t6jrvy2pHxCuTYgPw/rpfeH2I6hZ+cvXExzWjWLMwHFWO27Lz9Bievc6YuEciTcH6f1Lc7fUvvUEhzVDPl04Et2zsY2Rh1XJLGXBeqJfsUgFfa9sY5sG69bh+IroZ1ZCKiotK1mwHhPZFrFY8/DyPeBHligjuDp6gUGwGW1u3VetMv79NegPfaFpIXyOv2M5vMZ6Mu3t7Yl7QbbGVdzZwi/0vSpZ3TyD/rJKanSvoQsXp+DKtTlYWonCZlzeSZkufDOV9nSfpxhqD3nhWFM9tL95QqsabnL78KJsI0GftfKzqVm41H+tcr9mofMj45agtIRtUH/k4HwEiIrt2KuibDKtkzVpOkLR87e+7nds4sj16Yed/PO02VAjHSEdlpYCZy2deq1J7JBtYTvYnkXJcjTOwIFDgDbBNGUaTthbSZUJoFkwsvaakhFcypHXzAW82MH2tzRnOqmwvA7YtHDP4Fa9+vkoIzjmvJjM+Y+I+VestCAjuAUGd/mGabSlZWv5VYPyYvbrJL1YLy+hl6J1VRnBTdILzGuY8TsULuZWpFdeURS2mImx7s2aJ+ml9L+jCyfGcph+MxKGUVoLesPRWulzLK8RfomdZjvw2+UlECstpLcLIJGZ2ZJtMzTyimlaWn7cCgg1O/EZXBzqU79lkLJ6PJy4af61/iBfblKsCCbhJtmmkeQV9cRbACEQCD/PVCTDN/ymz7QsKYODZDypTo/bhXn8kIwM9HZIh6WpvCXJofTR+/zZjzVTDQiHkX7toSoznVfjyKWVVXUp2FdSzP8UwhQDpDJv8/SH6UYvXG1kf79toLdDmpE2nZRNePzz1JnV7NfsuWxlv3CUnFEUJQyp4ThP1zf0tc/fPcqXrR7o7ZCeClkJv1i2F2fNhyc+MfQ/G8JONgtgV/mFe6Klhm91UAvMEhzJQKUAF6NJwHvxiNZUbFHYTrWiKBEBjE39Ey3PqZYjQl/TTRAZ7edEwHDC42+iUzIC/lPdiZ14/YnNL2OkI/jxCtsQn8HZXZgMxRikfGyCbyPyfLn64WR4buDYKQ/ZCfdncipKrIUTVzf/HKHQapw0JxFets/n8FDixfl1EZCm38JWzrhJ5BGQnc4ilGCx8EBvh6nTnoxOVkfbg6OYuz+QTNSIipBkjnqwz8MSGPoiwEnZySz6Fk4enI9ZAssYDoWHEpi7xxQ3ZoIzFS7Q1+sP8usYlamh6CgcAfRh7h5T3JgJ1rCkrtBCGFJh5IGAnCIEzPLZuKPvoZDcfRdmgjFhWqFmhRN8looJN5q4H8NtCwJxQTBVjKxjtt9qcPwlG5K7d+R9FL0F2oyy8gYRFckEW3qTSCsIduXKlStXWREA/Av6G2wpB37XkAAAAABJRU5ErkJggg==";

    var section = sectionId ? indieauthor.model.findObject(sectionId) : indieauthor.model.createSection();
    var sectionTemplate = `
    <div class="section-container">
        <div id="sec-{{id}}" data-id="{{id}}">
            <div class="section-header">
                <div class="b1">
                    <img src="${sectionIcon}" class="section-icon" />
                </div>
                <div class="b2" data-prev>{{name}}</div>
                <div class="b3" data-toolbar>
					<button onClick="indieauthor.exportSection('{{id}}')" class="btn btn-sm btn-info" type="button" title="{{translate "sections.export"}}">
                        <i class="fa fa-file-export"></i>
                    </button>
                    <button onClick="indieauthor.importElement('{{id}}', true)" class="btn btn-sm btn-info" type="button" title="{{translate "sections.import"}}">
                        <i class="fa fa-file-import"></i>
                    </button>
                    <button class="btn btn-sm btn-info" type="button" data-toggle="collapse" data-target="#section-elements-{{id}}" title="{{translate "sections.expandContract"}}" aria-expanded="true" aria-controls="section-elements-{{id}}">
                        <i class="fa fa-caret-down"></i>
                    </button>
                    <button onClick="indieauthor.copySection('{{id}}', true)" class="btn btn-sm btn-info" type="button" title="{{translate "sections.duplicate"}}">
                        <i class="fa fa-copy"></i>
                    </button>
                    <button onClick="indieauthor.swap('{{id}}', 1)" class="btn btn-sm btn-info" title="{{translate "sections.moveUp"}}">
                        <i class="fa fa-arrow-up"></i>
                    </button>
                    <button onClick="indieauthor.swap('{{id}}', 0)" class="btn btn-sm btn-info" title="{{translate "sections.moveDown"}}">
                        <i class="fa fa-arrow-down"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onClick="indieauthor.openSectionSettings('{{id}}')" data-toggle="tooltip"  title="{{translate "sections.edit"}}">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="indieauthor.removeSection('{{id}}')" data-toggle="tooltip"  title="{{translate "sections.deleteSection"}}">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </div>
            <div id="section-elements-{{id}}" class="section-elements dragula-container collapse show" data-type="{{type}}" data-role="container"></div>
        </div>
    </div>`;
    var rendered = indieauthor.renderTemplate(sectionTemplate, {
        type: "section-container",
        id: section.id,
        name: section.name
    });

    $(indieauthor.container).append(rendered);

    if (isCommand) {
        indieauthor.undoredo.pushCommand('addSection', section.id, {
            element: section,
            parentType: "section-container",
            view: rendered,
            position: (indieauthor.model.sections.length - 1)
        })
    }
}

/**
 * Removes a section from the editor and from the model.
 * 
 * @param {string} sectionId ID of the section to be added.
 */
indieauthor.removeSection = function (sectionId) {

    indieauthor.undoredo.pushCommand('removeSection', sectionId, {
        element: jQuery.extend({}, indieauthor.model.findObject(sectionId)),
        parentType: "section-container",
        position: indieauthor.utils.findIndexObjectInArray(indieauthor.model.sections, "id", sectionId),
        view: this.findElementByDataId(sectionId).parentNode.outerHTML
    });

    indieauthor.deleteToolTipError(document.getElementById("sec-" + sectionId).querySelector('[data-prev]'));
    indieauthor.model.removeElement(sectionId);
    $(document.getElementById("sec-" + sectionId).parentNode).fadeOut(400, function () {
        $(this).remove();
    });

    indieauthor.utils.notifiySuccess(indieauthor.strings.messages.successMessage, indieauthor.strings.messages.deletedSection);
}

/**
 * Swaps sections in the editor and in the model.
 * 
 * @param {string} sectionOriginId ID of the section to be swapped.
 * @param {number} direction 1 if the section is swapped with the previous section, other if the section is swapped with the next section
 */
indieauthor.swap = function (sectionOriginId, direction) {
    var positionQuery = (direction == 1) ? $(document.getElementById("sec-" + sectionOriginId).parentNode).prev() : $(document.getElementById("sec-" + sectionOriginId).parentNode).next();

    if (positionQuery.length == 1) {
        var targetOrigin = indieauthor.polyfill.getData(positionQuery[0].firstElementChild, 'id');
        indieauthor.utils.swap(document.getElementById("sec-" + sectionOriginId).parentNode, document.getElementById("sec-" + targetOrigin).parentNode);
        indieauthor.model.swap(sectionOriginId, targetOrigin);
    }

    indieauthor.undoredo.pushCommand('swapSection', {
        sectionOriginId: sectionOriginId,
        direction: direction
    });
}

/**
 * Will populate the settings modal with the inputs for a section with the data set in the json model
 *
 * @param {string} id Section Id
 */
indieauthor.openSectionSettings = function (id) {
    // 0 Clear older values
    document.getElementById('modal-settings-body').innerHTML = ''; // clear the body
    $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event 

    // 1  get model from object
    var modelObject = indieauthor.model.findObject(id);
    if (!modelObject) throw new Error('modelObject cannot be null');

    // 2 Creates the form
    var inputs = '<form id="f-{{id}}"> <div class="form-group"> <label for="name">{{translate "sections.form.name.label"}}</label> <input type="text" name="name" class="form-control" value="{{name}}" placeholder="{{translate "sections.form.name.placeholder"}}" autocomplete="off" required/> <small class="form-text text-muted" >{{translate "sections.form.name.help"}}</small > </div><div class="form-group"> <label for="bookmark">{{translate "sections.form.bookmark.label"}}</label> <input type="text" name="bookmark" class="form-control" value="{{bookmark}}" placeholder="{{translate "sections.form.bookmark.placeholder"}}" maxLength="40" autocomplete="off" required/> <small class="form-text text-muted" >{{translate "sections.form.bookmark.help"}}</small > </div></form>';

    document.getElementById('modal-settings-body').innerHTML = indieauthor.renderTemplate(inputs, {
        id: id,
        name: modelObject.name,
        bookmark: modelObject.bookmark
    });

    document.getElementById('modal-settings-tittle').innerHTML = "Section: " + modelObject.name;

    $("#modal-settings").modal({
        show: true,
        keyboard: false,
        focus: true,
        backdrop: 'static'
    });

    // 3 Associate functions to the modal
    var form = document.getElementById('f-' + id);
    var input = document.createElement('input');
    input.type = 'submit';
    input.classList.add('hide');
    form.appendChild(input);

    $(form).on('submit', function (e) {
        e.preventDefault();
        var formData = indieauthor.utils.toJSON(form);
        var errors = [];

        if (formData.bookmark.length > 40) {
            var errorText = indieauthor.strings.errors.section.invalidBookmark;
            errors.push(errorText);
        }

        if (errors.length > 0) {
            $("#modal-settings").animate({
                scrollTop: 0
            }, "slow");

            var errText = "";

            errors.map(function (text) {
                errText += " " + text;
            });

            if ($("#modal-settings-body .errors").length == 0) {
                $("#modal-settings-body").prepend('<div class="errors">' + indieauthor.generateAlertError(errText) + '</div>');
            } else {
                $("#modal-settings-body .errors").html(indieauthor.generateAlertError(errText));
            }

        } else {
            modelObject.name = formData.name;
            modelObject.bookmark = formData.bookmark;

            $("#modal-settings").modal('hide');
            $("#modal-settings [name='type']").off('change');
            var preview = indieauthor.renderTemplate('<div class="prev-container"><span>{{name}}</span></div>', modelObject);

            document.querySelector("[data-id='" + id + "']").querySelector(".b2").innerHTML = preview;
            $(form).remove();
        }
    });

    $("#modal-settings .btn-submit").on('click', function (e) {
        input.click();
    });
}

/**
 * Unit settings modal to fill out before downloading XText
 *
 * @param {string} id Section Id
 */
indieauthor.openUnitSettings = function (mode = "download") {

    // Check if the model is valid before trying to download
    if (!indieauthor.api.validateContent(true)) {
        console.error(indieauthor.strings.messages.contentErrors);
        return;
    }

    $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event 
    // Create the form
    const inputs = `
    <form id="f-unit-settings">
        <div class="form-group">
            <label for="unit-title">{{translate "units.form.title.label"}}</label>
            <input type="text" id="unit-title" name="title" class="form-control" value="{{title}}" placeholder="{{translate "units.form.title.placeholder"}}" autocomplete="off" required/>
            <small class="form-text text-muted" >{{translate "units.form.title.help"}}</small >
        </div>
        <div class="form-group">
            <label for="unit-type">{{translate "units.form.type.label"}}</label>
            <select id="unit-type" name="mode" class="form-control" required>
                <option value="Open" {{#ifeq mode "Open"}} selected {{/ifeq}}>{{translate "units.form.type.open"}}</option>
                <option value="Interoperability" {{#ifeq mode "Interoperability"}} selected {{/ifeq}}>{{translate "units.form.type.interoperability"}}</option>
            </select>
            <small class="form-text text-muted" >{{translate "units.form.type.help"}}</small>
        </div>
        <div class="form-group">
            <label for="unit-language">{{translate "units.form.language.label"}}</label>
            <select id="unit-language" name="language" class="form-control" required>
            {{#each languages}}
                <option value="{{this}}" {{#ifeq this ../language}} selected {{/ifeq}}>{{translate (concat "units.form.language." this) }}</option>
            {{/each}}
            </select>
            <small class="form-text text-muted" >{{translate "units.form.language.help"}}</small>
        </div>
        <div class="form-group">
            <label for="unit-license">{{translate "units.form.license.label"}}</label>
            <select id="unit-license" name="license" class="form-control" required>
            {{#each licenses}}
                <option value="{{this}}" {{#ifeq this ../license}} selected {{/ifeq}}>{{translate (concat "units.form.license." this) }}</option>
            {{/each}}
            </select>
            <small class="form-text text-muted" >{{translate "units.form.license.help"}}</small>
        </div>
        <div class="form-group">
            <label for="unit-theme">{{translate "units.form.theme.label"}}</label>
            <select id="unit-theme" name="theme" class="form-control" required>
            {{#each themes}}
                <option value="{{this}}" {{#ifeq this ../theme}} selected {{/ifeq}}>{{this}}</option>
            {{/each}} 
            </select>
            <small class="form-text text-muted">{{translate "units.form.theme.help"}}</small>
        </div>
        <div class="form-group">
            <label for="unit-author">{{translate "units.form.author.label"}}</label>
            <input type="text" id="unit-author" name="user" class="form-control" value="{{user}}" placeholder="{{translate "units.form.author.placeholder"}}" autocomplete="off" required/>
            <small class="form-text text-muted" >{{translate "units.form.author.help"}}</small >
        </div>
        <div class="form-group">
            <label for="unit-email">{{translate "units.form.email.label"}}</label>
            <input type="email" id="unit-email" name="email" class="form-control" value="{{email}}" placeholder="{{translate "units.form.email.placeholder"}}" autocomplete="off" required/>
            <small class="form-text text-muted" >{{translate "units.form.email.help"}}</small >
        </div>
        <div class="form-group">
            <label for="unit-institution">{{translate "units.form.institution.label"}}</label>
            <input type="text" id="unit-institution" name="institution" class="form-control" value="{{institution}}" placeholder="{{translate "units.form.institution.placeholder"}}" autocomplete="off" required/>
            <small class="form-text text-muted" >{{translate "units.form.institution.help"}}</small >
        </div>
        <div class="form-group">
            <label for="unit-resource">{{translate "units.form.resource.label"}}</label>
            <input type="text" id="unit-resource" name="resourceId" class="form-control" value="{{resourceId}}" placeholder="{{translate "units.form.resource.placeholder"}}" autocomplete="off" required/>
            <small class="form-text text-muted" >{{translate "units.form.resource.help"}}</small >
        </div>
        <fieldset class="form-group">
            <div class="row">
              <legend class="col-form-label col-12 pt-0">{{translate "units.form.analytics.label"}}</legend>
              <div class="col-12">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="analytics" id="analytics-yes" value="1" required {{#ifeq "1" analytics}} checked {{/ifeq}}>
                  <label class="form-check-label" for="analytics-yes">
                  {{translate "units.form.analytics.yes"}}
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="analytics" id="analytics-no" value="0" required {{#ifeq "0" analytics}} checked {{/ifeq}}>
                  <label class="form-check-label" for="analytics-no">
                  {{translate "units.form.analytics.no"}}
                  </label>
                </div>
                <small class="form-text text-muted" >{{translate "units.form.analytics.help"}}</small >
              </div>
            </div>
        </fieldset>
        <input type="submit" class="hide" />
    </form>`;

    const themes = ["GeneralTheme1", "GeneralTheme2", "GeneralTheme3", "GeneralTheme4", "GeneralTheme5",
    "GeneralTheme6", "GeneralTheme7", "GeneralTheme8", "GeneralTheme9", "GeneralTheme10", "GeneralTheme11",
    "GeneralTheme12", "GeneralTheme13", "GeneralTheme14", "GeneralTheme15", "GeneralTheme16", "GeneralTheme17",
    "GeneralTheme18"];
    const languages = ["EN", "ES", "FR", "EL", "LT"];
    const licenses = ["PRIVATE", "BY", "BYSA", "BYND", "BYNC", "BYNCSA", "BYNCND"];

    const data = {
        themes, 
        languages, 
        licenses, 
        title: indieauthor.model.title ?? '',
        user: indieauthor.model.user ?? '',
        email: indieauthor.model.email ?? '',
        institution: indieauthor.model.institution ?? '',
        resourceId: indieauthor.model.resourceId ?? '',
        mode: indieauthor.model.mode ?? '',
        language: indieauthor.model.language ?? '',
        theme: indieauthor.model.theme ?? '',
        license: indieauthor.model.license ?? '',
        analytics: indieauthor.model.analytics ?? '0'
    };
    document.getElementById('modal-settings-body').innerHTML = indieauthor.renderTemplate(inputs, data);

    $("#modal-settings").modal({
        show: true,
        keyboard: false,
        focus: true,
        backdrop: 'static'
    });

    let form = document.getElementById('f-unit-settings');

    $(form).on('submit', function (e) {
        e.preventDefault();
        if (!indieauthor.api.validateContent(false)) {
            console.error(indieauthor.strings.messages.contentErrors);
            return;
        }
        const formData = indieauthor.utils.toJSON(form);
        // Overwrite indieauthor.model with the specified data
        const model = $.extend(indieauthor.model, formData);
        if (mode === 'download')
            indieauthor.api.download(model);
        else if (mode === 'publish')
            indieauthor.api.publish(model);
        else if (mode === 'preview')
            indieauthor.api.preview(model);
            
        $("#modal-settings").modal('hide');
    });

    $("#modal-settings .btn-submit").on('click', function (e) {
        $("#modal-settings input[type='submit']").trigger('click');
    });
}

/**
 * 
 * Creates the view element for an element placed inside the main container or containers inside the main container and pushes into the model.
 * 
 * @param {string} elementType Element type (element, layout...)
 * @param {string} widget Widget name (TextBlock, ColumLayout, Blockquote...)
 * @param {Element} viewElement DOM element 
 * @param {string} dataElementId ID of the model element
 * @param {string} parentType Parent type
 * @param {number} parentContainerIndex Parent container index
 * @param {string} parentContainerId Parent container id
 * @param {string} inPositionElementId Element ID which has to be below the new view element. If its null, it will be at the las position
 * @param {boolean} modelCreation If a model element is to be created and appended into the model or if it is already created
 */
indieauthor.createViewElement = function (elementType, widget, viewElement, dataElementId, parentType, parentContainerIndex, parentContainerId, inPositionElementId, modelCreation) {
    // Element setup
    viewElement.innerHTML = '';
    $(viewElement).removeClass('palette-item');
    $(viewElement).addClass('container-item');

    var elementToBeAppended;
    var widgetInfo = {
        id: dataElementId
    };

    if (elementType == 'layout') widgetInfo.columns = indieauthor.polyfill.getData(viewElement, 'columns');
    indieauthor.utils.clearDataAttributes(viewElement);

    // MODEL CREATION
    if (modelCreation) {
        var modelObject = indieauthor.model.createObject(elementType, widget, dataElementId, widgetInfo);

        if (parentType == 'layout')
            indieauthor.model.appendObject(modelObject, inPositionElementId, parentContainerId, parentContainerIndex);
        else
            indieauthor.model.appendObject(modelObject, inPositionElementId, parentContainerId);
    }

    elementToBeAppended = indieauthor.generateHTMLElement(widget, widgetInfo);
    $(viewElement).append(elementToBeAppended);
    indieauthor.generateToolbars(elementType, widget, widgetInfo);
}

/**
 * Generates a toolbar with edit, delete or addContent buttons for each widget type and appends it to the toolbar container
 * 
 * @param {string} type Widget type
 * @param {string} widget Widget name
 * @param {*} widgetInfo Widget instance
 */
indieauthor.generateToolbars = function (type, widget, widgetInfo) {
    var toolbar = $("[data-id='" + widgetInfo.id + "'] [data-toolbar]")[0];
    var buttons = "";

    var toolBarModel = {
        id: widgetInfo.id,
        widget: widget,
        type: type
    };

    // Add Content button
    if (type == 'specific-container' || type == 'specific-element-container')
        buttons += indieauthor.renderTemplate('<button class="btn btn-sm btn-success" onclick="indieauthor.addContent(\'{{id}}\', \'{{widget}}\', \'{{type}}\')" data-toggle="tooltip"  title="{{translate "items.add"}}"><i class="fa fa-plus-circle"></i></button>', toolBarModel);

    // Settings or data button
    if (indieauthor.widgets[widget].widgetConfig.toolbar.edit)
        buttons += indieauthor.renderTemplate('<button class="btn btn-sm btn-success" onclick="indieauthor.openSettings(\'{{id}}\')" data-toggle="tooltip"  title="{{translate "items.edit"}}"><i class="fa fa-edit"></i></button>', toolBarModel);
	
    // Do not allow specific items to be copied/duplicated
    if (type !== 'specific-element') {
        // Add copy element button
        buttons += indieauthor.renderTemplate(`
            <button class="btn btn-sm btn-success"
                    onclick="indieauthor.copyElement('{{id}}', true)"
                    data-toggle="tooltip"  title="{{translate "items.duplicate"}}">
                <i class="fa fa-copy"></i>
            </button>`, toolBarModel);
        
        // Add export element button
        buttons += indieauthor.renderTemplate(`
        <button class="btn btn-sm btn-success"
                onclick="indieauthor.exportElement('{{id}}')"
                data-toggle="tooltip"  title="{{translate "items.export"}}">
            <i class="fa fa-file-export"></i>
        </button>`, toolBarModel);
    }

    // Delete/remove element button (common for all)
    buttons += indieauthor.renderTemplate('<button class="btn btn-sm btn-danger" onclick="indieauthor.removeElement(\'{{id}}\')" data-toggle="tooltip"  title="{{translate "items.delete"}}"><i class="fa fa-times"></i></button>', toolBarModel);

    $(toolbar).append(buttons);
}

/**
 * Will populate the settings modal with the inputs for the widgets with the data set in the json model
 *
 * @param {string} dataElementId Element Id
 */
indieauthor.openSettings = function (dataElementId) {
    // 0 Clear older values
    document.getElementById('modal-settings-body').innerHTML = ''; // clear the body
    $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event 

    // 1  get model from object
    var modelObject = indieauthor.model.findObject(dataElementId);
    if (!modelObject) throw new Error('modelObject cannot be null');

    // 2 Populate the modal with the inputs of the widget
    var widgetModal = indieauthor.widgets[modelObject.widget].getInputs(modelObject);

    // 3 Open the modal with values put
    document.getElementById('modal-settings-body').innerHTML = widgetModal.inputs;
    document.getElementById('modal-settings-tittle').innerHTML = widgetModal.title;
    $("#modal-settings").modal({
        show: true,
        keyboard: false,
        focus: true,
        backdrop: 'static'
    });
    // 4 Associate functions to the modal
    var form = document.getElementById('f-' + dataElementId);
    var input = document.createElement('input');
    input.type = 'submit';
    input.classList.add('hide');
    form.appendChild(input);

    $(form).on('submit', function (e) {
        e.preventDefault();

        var formData = indieauthor.utils.toJSON(form);
        var errors = indieauthor.widgets[modelObject.widget].validateForm(formData, dataElementId);
        if (errors.length > 0) {

            $("#modal-settings").animate({
                scrollTop: 0
            }, "slow");

            var errorText = "";
            $.map(errors, function (item) {
                errorText += jsonpath.query(indieauthor.strings, "$.errors." + item) + ". ";
            });

            if ($("#modal-settings-body .errors").length == 0) {
                $("#modal-settings-body").prepend('<div class="errors">' + indieauthor.generateAlertError(errorText) + '</div>');
            } else {
                $("#modal-settings-body .errors").html(indieauthor.generateAlertError(errorText));
            }

        } else {
            indieauthor.widgets[modelObject.widget].settingsClosed(modelObject);
            $("#modal-settings").modal('hide');
            indieauthor.confirmSettings(modelObject, formData);
            $(form).remove();
        }
    });

    $("#modal-settings .btn-submit").on('click', function () {
        input.click();
    });

    // 5 Run when settings are opened
    indieauthor.widgets[modelObject.widget].settingsOpened(modelObject);
}

indieauthor.generateAlertError = function (error) {
    var errorTemplate = '<div class="alert alert-danger alert-dismissible fade show" role="alert">{{errortext}}<button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>';

    return indieauthor.renderTemplate(errorTemplate, {
        errortext: error
    });
}

/**
 * Confirm settings/params from the modal of data from a model instance
 * 
 * @param {*} modelObject Model object 
 * @param {*} formData Form data
 */
indieauthor.confirmSettings = function (modelObject, formData) {
    $("#modal-settings-body .errors").remove();

    indieauthor.model.updateObject(modelObject, formData);
    indieauthor.widgets[modelObject.widget].preview(modelObject);

    // Clear modal values
    document.getElementById('modal-settings-body').innerHTML = '';
    document.getElementById('modal-settings-tittle').innerHTML = '';

    // Clean errors
    var previewElement = document.querySelector("[data-id='" + modelObject.id + "']").querySelector('[data-prev]');
    indieauthor.deleteToolTipError(previewElement);
    $(document.querySelector("[data-id='" + modelObject.id + "']").parentNode).removeClass('editor-error', 200);
}

/**
 * Removes an element from the view and from the model given its id
 * 
 * @param {string} id Element id
 */
indieauthor.removeElement = function (id) {
    var elementToBeRemoved = indieauthor.model.findObject(id);
    var parent = indieauthor.model.findParentOfObject(id);

    var parentContainerId = parent.id;
    var parentContainerIndex = -1;
    var inPositionElementId = -1;

    if (parent.type == 'layout') {
        for (var i = 0; i < parent.data.length; i++) {
            var elementArray = parent.data[i];
            var objectIndex = indieauthor.utils.findIndexObjectInArray(elementArray, "id", id);
            if (objectIndex != -1) {
                var positionIndex = objectIndex + 1;
                if (positionIndex < elementArray.length) inPositionElementId = elementArray[positionIndex].id;
                parentContainerIndex = i;
            }
        }
    } else {
        var objectIndex = indieauthor.utils.findIndexObjectInArray(parent.data, "id", id);
        var positionIndex = objectIndex + 1;
        if (positionIndex < parent.data.length) inPositionElementId = parent.data[positionIndex].id;
    }

    indieauthor.undoredo.pushCommand('remove', id, {
        element: jQuery.extend({}, elementToBeRemoved),
        parentType: parent.type,
        parentContainerIndex: parentContainerIndex,
        parentContainerId: parentContainerId,
        inPositionElementId: inPositionElementId,
        view: this.findElementByDataId(id).parentNode.outerHTML
    });

    indieauthor.deleteToolTipError(document.querySelector("[data-id='" + id + "']").querySelector('[data-prev]'));
    indieauthor.model.removeElement(id);
    $(document.querySelector("[data-id='" + id + "']")).fadeOut(400, function () {
        $(this.parentNode).remove();
    });
}

/**
 * Adds content to a specific-container instance given by id described by its type and its widget name. 
 * 
 * @param {string} containerId Container ID in which the content will be added as a child 
 * @param {string} widget Widget type of the specific-container (TabsContainer, AcordionContainer...) 
 * @param {string} type Container type. Only specific-container is allowed
 */
indieauthor.addContent = function (containerId, widget, type) {
    if (type != 'specific-container' && type != 'specific-element-container')
        throw new Error('Cannot create content for non-specific container');

    var widgetTypeToCreate;

    if (indieauthor.widgets[widget].widgetConfig.allow.length > 1) {
        var options = [];

        for (var i = 0; i < indieauthor.widgets[widget].widgetConfig.allow.length; i++) {
            var widgetAllowed = indieauthor.widgets[widget].widgetConfig.allow[i];
            options.push({
                text: indieauthor.strings.widgets[widgetAllowed].label,
                value: widgetAllowed
            });
        }

        bootprompt.prompt({
            title: indieauthor.strings.common.selectType,
            inputType: 'select',
            inputOptions: options,
            value: indieauthor.widgets[widget].widgetConfig.allow[0], // Default option
            closeButton: false,
            callback: function (result) {
                if (result) {
                    widgetTypeToCreate = result;
                    indieauthor.addSpecificContent(containerId, widgetTypeToCreate);
                }
            }
        });
    } else {
        widgetTypeToCreate = indieauthor.widgets[widget].widgetConfig.allow[0];
        indieauthor.addSpecificContent(containerId, widgetTypeToCreate);
    }
}

indieauthor.addSpecificContent = function (containerId, widgetTypeToCreate) {
    var elementTypeToCreate = indieauthor.widgets[widgetTypeToCreate].widgetConfig.type;
    var target = document.querySelector('[data-id="' + containerId + '"]');

    var newElement = document.createElement("div");
    target.querySelector('[data-content]').appendChild(newElement);
    var dataElementId = indieauthor.utils.generate_uuid();

    var parentType = indieauthor.polyfill.getData(target, 'type'); // Parent type
    var parentContainerIndex = -1; // Parent container index (only for layout)
    var parentContainerId = indieauthor.polyfill.getData($(target).closest('[data-id]')[0], 'id');
    var inPositionElementId = -1;

    indieauthor.createViewElement(elementTypeToCreate, widgetTypeToCreate, newElement, dataElementId, parentType, parentContainerIndex, parentContainerId, inPositionElementId, true);

    indieauthor.undoredo.pushCommand("add", dataElementId, {
        element: jQuery.extend({}, indieauthor.model.findObject(dataElementId)),
        parentType: parentType,
        parentContainerIndex: parentContainerIndex,
        parentContainerId: parentContainerId,
        inPositionElementId: inPositionElementId,
        view: newElement.outerHTML
    });
}


/**
 * Shows/hides one item category
 *  
 * @param {string} category Item category
 */
indieauthor.toggleCategory = function (category) {
    var divCategory = document.querySelector("[data-category-header='" + category + "']");
    var icon = divCategory.querySelector("[data-icon]");
    var isHidden = indieauthor.utils.parseBoolean(indieauthor.polyfill.getData(divCategory, 'hidden'));

    if (isHidden == true) {
        $("[data-category=" + category + "]").show(300);
        indieauthor.polyfill.setData(divCategory, 'hidden', false);
        $(icon).removeClass("fa-caret-down");
        $(icon).addClass("fa-caret-up");
    } else if (isHidden == false) {
        $("[data-category=" + category + "]").hide(300);
        indieauthor.polyfill.setData(divCategory, 'hidden', true);
        $(icon).addClass("fa-caret-down");
        $(icon).removeClass("fa-caret-up");
    }
}

/**
 * Short function that helps in the creation of an item given a widget type
 * 
 * @param {*} widgetType Widget Type
 * @returns HTML content for the widget
 */
indieauthor.generateHTMLElement = function (widgetType, widgetInfo) {
    return indieauthor.widgets[widgetType].createElement(widgetInfo);
}

/**
 * Load the widgets into the palette
 * 
 * @param {Element} palette DOM Element corresponding to the palette of items
 */
indieauthor.loadWidgets = function (palette) {
    try {
        for (var i = 0; i < widgetsJson.length; i++) {
            var widgetCategory = widgetsJson[i];
            var widgetList = [];
            var numWidgets = 0;

            var categoryWidgets = widgetCategory.widgets;
            for (var j = 0; j < categoryWidgets.length; j++) {
                var widget = categoryWidgets[j];
				// Some widgets could be deprecated and won't be shown in the palete altough
                // they can still be edited
                if (!indieauthor.widgets[widget.widget].paleteHidden) {
                    var widgetView = indieauthor.createWidgetView(widget.widget);
                    widgetList.push(widgetView.content);
                    numWidgets += widgetView.numItems;
                }
            }

            var categoryView = indieauthor.createCategoryView(widgetCategory.category, numWidgets);

            $(palette).append(categoryView);
            $(palette).append(widgetList);

        }
    } catch (err) {
        console.error(err);
    }
}

/**
 * Creates the palette separator for the widget category
 * 
 * @param {*} category Category name
 * @param {*} numWidgets Number of widgets inside the category
 * @returns String containing the html for the category view
 */
indieauthor.createCategoryView = function (category, numWidgets) {
    var categoryTemplate = '<div class="dragula-anchor palette-section-header align-self-center" data-category-header="{{category}}" data-hidden="false"><div class="row wrap"><div class="col-9 first-block"><span class="header-label">{{translate title}} <i>({{numWidgets}} items)</i></span></div><div class="col-3 second-block vcenter"><button onclick=\'indieauthor.toggleCategory("{{category}}")\' class="float-right btn btn-outline btn-indie btn-sm btn-no-border" data-toggle="tooltip"  title="{{translate "buttons.toggleCategories"}}"><i data-icon class="fa fa-caret-up"></i></button></div></div></div>';

    var rendered = indieauthor.renderTemplate(categoryTemplate, {
        title: "palette." + category,
        category: category,
        numWidgets: numWidgets
    });

    return rendered;
}

/**
 * Creates the palette item for the specified widget type
 * 
 * @param {*} widget Widget type
 * @returns String containing the html for the widget palette item view
 */
indieauthor.createWidgetView = function (widget) {
    return indieauthor.widgets[widget].createPaletteItem();
}

/**
 * Recursive function that loads an element and draws it in the editor
 * 
 * @param {Element} target DOM element where the element will be appended
 * @param {Element} element Element that will be loaded
 * @param {boolean} isSection If the element is, in fact, a section
 * @param {boolean} modelCreation If the model has to be created when it is loaded into the model
 */
indieauthor.loadElement = function (target, element, isSection, modelCreation = false) {

    if (isSection) {
        indieauthor.addSection(element.id, false);
        var preview = indieauthor.renderTemplate('<div class="prev-container"><span>{{name}}</span></div>', element);

        document.querySelector("[data-id='" + element.id + "']").querySelector(".b2").innerHTML = preview;
    } else {
        var el = document.createElement("div");
        $(target).append(el);

        if (element.type == 'layout') indieauthor.polyfill.setData(el, 'columns', element.data.length);

        var parentType = indieauthor.polyfill.getData(target, 'type'); // Parent type
        var parentContainerIndex = -1; // Parent container index (only for layout)
        var parentContainerId = indieauthor.polyfill.getData($(target).closest('[data-id]')[0], 'id');

        if (parentType == 'layout') {
            parentContainerIndex = indieauthor.polyfill.getData(target, 'index');
        }

        var inPositionElementId = -1;

        indieauthor.createViewElement(element.type, element.widget, el, element.id, parentType, parentContainerIndex, parentContainerId, inPositionElementId, modelCreation);
        indieauthor.widgets[element.widget].preview(element);
    }

    if (indieauthor.hasChildren(element.type)) {
        if (element.type == 'layout') {
            for (var i = 0; i < element.data.length; i++) {
                var arrayOfElements = element.data[i];
                var subContainerTarget = document.querySelector('[data-id="' + element.id + '"]').querySelector('[data-index="' + i + '"');
                for (var j = 0; j < arrayOfElements.length; j++) {
                    indieauthor.loadElement(subContainerTarget, arrayOfElements[j]);
                }
            }
        } else {
            var subContainerTarget = (element.type == 'specific-container' || element.type == 'simple-container' || element.type == 'specific-element-container') ? document.querySelector('[data-id="' + element.id + '"]').querySelector('[data-content]') : document.querySelector('[data-id="' + element.id + '"]').querySelector('[data-role="container"]');
            for (var i = 0; i < element.data.length; i++) {
                var subElement = element.data[i];
                indieauthor.loadElement(subContainerTarget, subElement);
            }
        }
    }
}

/**
 * Indicates if an element type has children in its data attribute 
 * 
 * @param {string} elementType Element type (specific-container, element-container...)
 * 
 * @returns {boolean} true if has children, false if not
 */
indieauthor.hasChildren = function (elementType) {
    return (elementType == 'specific-container' || elementType == 'simple-container' || elementType == 'specific-element-container' || elementType == 'element-container' || elementType == 'layout' || elementType == 'section-container');
}

/**
 * Renders the template using the template engine with the model values
 * 
 * @param {string} template String containing the template 
 * @param {*} model Model to be rendered
 * 
 * @returns {string} the view rendered
 */
indieauthor.renderTemplate = function (template, model) {
    var templateInstance = Handlebars.compile(template);
    var html = templateInstance(model);
    return html;
}


indieauthor.showErrors = function (currentErrors, newErrors) {
    for (var i = 0; i < currentErrors.length; i++) {
        var currentError = currentErrors[i];

        var element = document.querySelector("[data-id='" + currentError.element + "']");
        if (!element) continue;

        var previewElement = element.querySelector('[data-prev]');
        indieauthor.deleteToolTipError(previewElement);

        if (!indieauthor.utils.findObjectInArray(newErrors, 'element', currentError.element)) {
            $(element.parentNode).removeClass('editor-error', 200);
        }
    }

    for (var i = 0; i < newErrors.length; i++) {
        var error = newErrors[i];
        var element = document.querySelector("[data-id='" + error.element + "']");
        var previewElement = element.querySelector('[data-prev]');

        if (!$(element.parentNode).hasClass('editor-error')) $(element.parentNode).addClass('editor-error', 200);

        indieauthor.creatToolTipError(error, previewElement);
    }
}


/**
 * Creates a tooltip with a model error inside a DOM element
 * 
 * @param {*} error Model error to be shown
 * @param {*} previewElement DOM Element as tooltip reference
 */
indieauthor.creatToolTipError = function (error, previewElement) {
    var errorText = $.map(error.keys, function (item) {
        return jsonpath.query(indieauthor.strings, "$.errors." + item);
    });

    indieauthor.polyfill.setData(previewElement, 'title', errorText.join(" "));
    indieauthor.polyfill.setData(previewElement, 'original-title', errorText.join(" "));
    previewElement.addEventListener('mouseenter', $(previewElement).tooltip('show'));
    previewElement.addEventListener('mouseleave', $(previewElement).tooltip('hide'));
}

/**
 * Removes a model error tooltip.
 * 
 * @param {*} previewElement DOM Element as tooltip reference
 */
indieauthor.deleteToolTipError = function (previewElement) {
    indieauthor.polyfill.deleteData(previewElement, 'title');
    indieauthor.polyfill.deleteData(previewElement, 'original-title');
    previewElement.removeEventListener('mouseenter', $(previewElement).tooltip('show'));
    previewElement.removeEventListener('mouseout', $(previewElement).tooltip('hide'));
    $(previewElement).tooltip('dispose');
}

indieauthor.findElementByDataId = function (dataId) {
    return document.querySelector("[data-id='" + dataId + "']");
}