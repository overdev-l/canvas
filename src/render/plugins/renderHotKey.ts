import { Group, IText, Rect } from "fabric";
import hotkeys from "hotkeys-js";
import { Render } from "../render";
import { Plugin } from "../base/types";

export class HotKey extends Plugin  {
    public __name__ = 'HotKey';
    private _copyElement!: IText | Group | Rect;
    constructor(_render: Render) {
        super(_render);
        this.initHotKey();
    }
    private initHotKey = () => {
        hotkeys('backspace', this._removeElementHandler);
        hotkeys('ctrl+c,command+c', this._copyElementHandler);
        hotkeys('ctrl+v,command+v', this._pasteElementHandler);
        hotkeys('ctrl+z,command+z', this._undo);
        hotkeys('ctrl+y,command+y', this._redo);
    }

    private _removeElementHandler = (_event: KeyboardEvent) => {
        _event.preventDefault();
        const activeObject = this._render._FC.getActiveObject();
        if (activeObject) {
            this._render._FC.remove(activeObject);
        }
    }

    private _copyElementHandler = (_event: KeyboardEvent) => {
        _event.preventDefault();
        this._copyElement = this._render._FC.getActiveObject() as IText | Group | Rect;
        console.log(this._copyElement instanceof IText, this._copyElement instanceof Group, this._copyElement instanceof Rect);
    }

    private _pasteElementHandler = (_event: KeyboardEvent) => {
        _event.preventDefault();
        this._copyElement?.clone().then((el) => {
            el.set({
                left: el.left + 100,
                top: el.top + 100,
            })
            this._render._FC.add(el);
        })
    }
    
    private _undo = (_event: KeyboardEvent) => {
        _event.preventDefault();
    }

    private _redo = (_event: KeyboardEvent) => {
        _event.preventDefault();
    }
    /**
     * 销毁插件
     */
    public __destroy__ = () => {
        hotkeys.unbind('backspace', this._removeElementHandler);
        hotkeys.unbind('ctrl+c,command+c', this._copyElementHandler);
        hotkeys.unbind('ctrl+v,command+v', this._pasteElementHandler);
        hotkeys.unbind('ctrl+z,command+z', this._undo);
        hotkeys.unbind('ctrl+y,command+y', this._redo);
    }
}
