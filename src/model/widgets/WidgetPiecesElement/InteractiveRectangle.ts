/* global $ */
import { PieceElement, PieceInteractiveAreas } from "../../../types";

export default class InteractiveRectangle {

    private static CORNER_RESIZE_RADIUS = 15;
    private static LINE_RESIZE_MARGIN = 10;

    private x: number;
    private y: number;
    private w: number;
    private h: number;

    private ratio: number;

    static fromPiece(rect: PieceElement, ratio: number) {
        return new InteractiveRectangle(parseFloat(rect.x), parseFloat(rect.y), parseFloat(rect.w), parseFloat(rect.h), ratio);
    }

    static fromRect(rect: InteractiveRectangle, ratio: number) {
        return new InteractiveRectangle(rect.x, rect.y, rect.w, rect.h, ratio);
    }

    constructor(x: number, y: number, w: number, h: number, ratio: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.ratio = ratio;
    }

    getX(): number {
        return this.x;
    }

    private getScaledX(): number {
        return this.x * this.ratio;
    }

    getY(): number {
        return this.y;
    }

    private getScaledY(): number {
        return this.y * this.ratio;
    }

    getW(): number {
        return this.w;
    }

    private getScaledW(): number {
        return this.w * this.ratio;
    }

    getH(): number {
        return this.h;
    }

    private getScaledH(): number {
        return this.h * this.ratio;
    }

    getBackgroundArea(): Path2D {
        const area = new Path2D();
        area.rect(this.getScaledX(), this.getScaledY(), this.getScaledW(), this.getScaledH());
        return area;
    }

    getLeftSide(): Path2D {
        const line = new Path2D();
        line.rect(
            this.getScaledX() - InteractiveRectangle.LINE_RESIZE_MARGIN,
            this.getScaledY() + InteractiveRectangle.CORNER_RESIZE_RADIUS,
            2 * InteractiveRectangle.LINE_RESIZE_MARGIN,
            this.getScaledH() - InteractiveRectangle.CORNER_RESIZE_RADIUS);
        return line;
    }

    getRightSide(): Path2D {
        const line = new Path2D();
        line.rect(
            this.getScaledX() + this.getScaledW() - InteractiveRectangle.LINE_RESIZE_MARGIN,
            this.getScaledY() + InteractiveRectangle.CORNER_RESIZE_RADIUS,
            InteractiveRectangle.LINE_RESIZE_MARGIN * 2,
            this.getScaledH() - InteractiveRectangle.CORNER_RESIZE_RADIUS);
        return line;
    }

    getTopSide(): Path2D {
        const line = new Path2D();
        line.rect(
            this.getScaledX() + InteractiveRectangle.CORNER_RESIZE_RADIUS,
            this.getScaledY() - InteractiveRectangle.LINE_RESIZE_MARGIN,
            this.getScaledW() - InteractiveRectangle.CORNER_RESIZE_RADIUS,
            2 * InteractiveRectangle.LINE_RESIZE_MARGIN);
        return line;
    }

    getBottomSide(): Path2D {
        const line = new Path2D();
        line.rect(
            this.getScaledX() + InteractiveRectangle.CORNER_RESIZE_RADIUS,
            this.getScaledY() + this.getScaledH() - InteractiveRectangle.LINE_RESIZE_MARGIN,
            this.getScaledW() - InteractiveRectangle.CORNER_RESIZE_RADIUS,
            2 * InteractiveRectangle.LINE_RESIZE_MARGIN);
        return line;
    }

    getTopLeftCorner(): Path2D {
        const circle = new Path2D();
        circle.arc(this.getScaledX(), this.getScaledY(), InteractiveRectangle.CORNER_RESIZE_RADIUS, 0, 2 * Math.PI);
        return circle;
    }

    getTopRightCorner(): Path2D {
        const circle = new Path2D();
        circle.arc(this.getScaledX() + this.getScaledW(), this.getScaledY(), InteractiveRectangle.CORNER_RESIZE_RADIUS, 0, 2 * Math.PI);
        return circle;
    }

    getBottomLeftCorner(): Path2D {
        const circle = new Path2D();
        circle.arc(this.getScaledX(), this.getScaledY() + this.getScaledH(), InteractiveRectangle.CORNER_RESIZE_RADIUS, 0, 2 * Math.PI);
        return circle;
    }

    getBottomRightCorner(): Path2D {
        const circle = new Path2D();
        circle.arc(this.getScaledX() + this.getScaledW(), this.getScaledY() + this.getScaledH(), InteractiveRectangle.CORNER_RESIZE_RADIUS, 0, 2 * Math.PI);
        return circle;
    }

    update(action: string, shiftX: number, shiftY: number) {
        let sX = shiftX / this.ratio;
        let sY = shiftY / this.ratio;
        switch (action) {
            case "move": this.x += sX; this.y += sY; break;
            case "e-resize": this.w += sX; break;
            case "w-resize": this.x += sX; this.w -= sX; break;
            case "n-resize": this.y += sY; this.h -= sY; break;
            case "s-resize": this.h += sY; this;
            case "nw-resize": this.x += sX; this.w -= sX; this.y += sY; this.h -= sY; break;
            case "nwse-resize": this.w += sX; this.h += sY; break;
            case "ne-resize": this.w += sX; this.y += sY; this.h -= sY; break;
            case "nesw-resize": this.x += sX; this.w -= sX; this.h += sY; break;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = Math.round(2 / this.ratio);
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.setLineDash([Math.round(5 / this.ratio), Math.round(5 / this.ratio)]);
        ctx.stroke();
    }
}