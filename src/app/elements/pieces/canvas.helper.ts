/* global $ */
import { PieceElement, PieceInteractiveAreas } from "../../../types";
import InteractiveRectangle from "./interactive-rectangle";

export default class CanvasHelper {

    private canvas: HTMLCanvasElement;
    private img?: HTMLImageElement;
    private pieces?: PieceElement[];
    private rects?: InteractiveRectangle[];
    private paths?: PieceInteractiveAreas;

    private isMouseDown: boolean = false;
    private currentAction: string;
    private currentIndex: number;
    private ratio: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    }

    destroy() {
        this.rects = null;
        this.paths = null;
        this.img = null;
        this.canvas.removeEventListener('mousedown', onmousedown);
        this.canvas.removeEventListener('mousemove', onmousemove);
    }

    setRects(rs: PieceElement[]) {
        if (!this.img) return;
        this.pieces = rs;
        this.rects = rs.map(rect => InteractiveRectangle.fromPiece(rect, this.ratio));
        this.paths = this.getInteractiveAreas();
        this.draw();
    }

    onResize() {
        if (!this.img) return;
        this.ratio = this.canvas.getBoundingClientRect().width / this.img.width;
        this.rects = this.rects.map(rect => InteractiveRectangle.fromRect(rect, this.ratio));
        this.paths = this.getInteractiveAreas();
        this.draw();
    }


    private onMouseDown(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.buttons !== 1) return;
        this.isMouseDown = true;
        let ctx = this.canvas.getContext('2d');
        // Determine the action that the user wants to do based on the mouse coordinates
        for (const [key, path] of Object.entries(this.paths)) {
            let idx = path.findIndex((elem: any) => ctx.isPointInPath(elem, e.offsetX, e.offsetY));
            if (idx !== -1) {
                this.currentIndex = idx;
                this.currentAction = key;
                this.canvas.style.cursor = key;
                return;
            }
        }
        this.currentAction = 'none';
        this.canvas.style.cursor = 'auto';
    }

    private onMouseMove(e: MouseEvent) {
        if (!this.img) return;

        let ctx = this.canvas.getContext('2d');
        e.preventDefault();
        e.stopPropagation();
        // Mouse up
        if (this.isMouseDown && e.buttons !== 1)
            this.paths = this.getInteractiveAreas();

        this.isMouseDown = e.buttons == 1;
        if (this.isMouseDown && this.currentAction !== 'none') {
            const rect = this.rects[this.currentIndex];
            const piece = this.pieces[this.currentIndex];
            piece.x = rect.getX().toString();
            piece.y = rect.getY().toString();
            piece.w = rect.getW().toString();
            piece.h = rect.getH().toString();
            rect.update(this.currentAction, e.movementX, e.movementY);
            this.draw();
            const event = $.Event("actionRect");
            $(this.canvas).trigger(event, [this.currentIndex]);
            return;
        }

        // Set mouse cursor
        for (const [key, path] of Object.entries(this.paths)) {
            if (path.some((elem: any) => ctx.isPointInPath(elem, e.offsetX, e.offsetY))) {
                this.canvas.style.cursor = key;
                return;
            }
        }
        this.canvas.style.cursor = 'auto';
    }

    load(img: HTMLImageElement) {
        this.img = img;
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ratio = this.canvas.getBoundingClientRect().width / this.img.width;
    }

    private getInteractiveAreas(): PieceInteractiveAreas {

        let result: PieceInteractiveAreas = {
            'move': [], 'e-resize': [], 'w-resize': [], 'n-resize': [], 's-resize': [],
            'nw-resize': [], 'nwse-resize': [], 'ne-resize': [], 'nesw-resize': []
        }
        if (!this.img) return result;

        this.rects.forEach(rect => {
            result['move'].push(rect.getBackgroundArea());
            result['w-resize'].push(rect.getLeftSide());
            result['e-resize'].push(rect.getRightSide());
            result['n-resize'].push(rect.getTopSide());
            result['s-resize'].push(rect.getBottomSide());
            result['nw-resize'].push(rect.getTopLeftCorner());
            result['ne-resize'].push(rect.getTopRightCorner());
            result['nwse-resize'].push(rect.getBottomRightCorner());
            result['nesw-resize'].push(rect.getBottomLeftCorner());
        });
        return result;
    }

    private draw() {
        if (!this.img) return;
        let ctx = this.canvas.getContext('2d');
        // Draw a default white background
        ctx.fillStyle = "white";
        // Draw the background image
        ctx.fillRect(0, 0, this.img.width, this.img.width);
        ctx.drawImage(this.img, 0, 0);
        ctx.beginPath();
        // Draw dotted black and white pattern around each rectangle
        this.rects.forEach(rect => rect.draw(ctx));
        ctx.closePath();
    }
}