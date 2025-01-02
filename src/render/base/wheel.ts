import { Canvas, Point, TPointerEventInfo } from 'fabric';

export class Wheel {
    constructor(private __FC: Canvas) {
        this.init();
    }

    private init = () => {
        this.__FC.on('mouse:wheel', this._onWheel);
    }
    private _onWheel = (event: TPointerEventInfo<WheelEvent>) => {
        event.e.preventDefault();
        const pointer = this.__FC.getPointer(event.e);
        if (event.e.ctrlKey) {
            const delta = event.e.deltaY;
            let zoom = this.__FC.getZoom();
            zoom *= 0.99 ** delta;
            zoom = Math.min(Math.max(0.1, zoom), 20);
            this.__FC.zoomToPoint(new Point(pointer.x, pointer.y), zoom);
        } else {
            const delta = new Point(event.e.deltaX, event.e.deltaY);
            const vpt = this.__FC.viewportTransform;
            if (vpt) {
                vpt[4] -= delta.x;
                vpt[5] -= delta.y;
                this.__FC.setViewportTransform(vpt);
            }
        }
        this.__FC.requestRenderAll();
    }
}