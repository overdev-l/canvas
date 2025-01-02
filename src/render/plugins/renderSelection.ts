import { IText, Rect, TPointerEvent, TPointerEventInfo, Group, FabricObject } from "fabric";
import { CoreMouseMode, ObjectType } from "../utils/enum";
import { Plugin } from "../base/types";
import { Render } from "../render";
import { FrameLayout } from "../base/FrameLayout";

/**
 * 表示起始点坐标的类型
 */
type TStartPoint = {
    x: number;
    y: number;
}   

/**
 * 选择工具类,用于处理画布上的选择、创建框架和文本等操作
 */
export class Selection extends Plugin {
    public __name__ = 'MouseSelection';
    private _Mode: CoreMouseMode = CoreMouseMode.SELECTION;
    private _startPoint: TStartPoint = { x: 0, y: 0 };
    private _rect: Rect = new Rect({
        fill: 'rgba(153, 211, 255, 0.5)',
        selectable: false,
    });

    /**
     * 创建Selection实例
     * @param _Core - Core实例
     * @param _FC - Fabric Canvas实例
     */
    constructor(render: Render) {
        super(render);
        this._addEvent();
    }

    /**
     * 设置当前的操作模式
     * @param mode - 要设置的模式
     */
    public setMode = (mode: CoreMouseMode) => {
        this._Mode = mode;
        if (mode === CoreMouseMode.FRAME || mode === CoreMouseMode.TEXT) {
            this._render._FC.selection = false;
        } else {
            this._render._FC.selection = true;
        }
    }
    /**
     * 销毁插件
     */
    public __destroy__ = () => {
        this._render._FC.off('mouse:down', this._mouseDown);
        this._render._FC.off('mouse:move', this._mouseMove);
        this._render._FC.off('mouse:up', this._frameMouseUp);
        this._render._FC.off('mouse:up', this._textMouseUp);
    }

    /**
     * 添加画布事件监听器
     * @private
     */
    private _addEvent = () => {
        this._render._FC.on('mouse:down', this._mouseDown);
        this._render._FC.on('mouse:move', this._mouseMove);
        this._render._FC.on('mouse:up', this._frameMouseUp);
        this._render._FC.on('mouse:up', this._textMouseUp);
        this._render._FC.on('contextmenu', (e) => {
            e.e.preventDefault();
            //@ts-ignore
            const pointer = this._render._FC.getScenePoint(e.e);
            const target = e.target;
            let targets: FabricObject[] = [];
            if (target?.type === ObjectType.ACTIVE_SELECTION) {
                targets = this._render._FC.getActiveObjects()
            } else {
                targets = [target as FabricObject]
            }
            if (targets.length === 0) return;
            // TODO: 处理右键菜单
        });
    }

    /**
     * 处理鼠标按下事件
     * @param e - 鼠标事件信息
     * @private
     */
    private _mouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
        if (this._Mode !== CoreMouseMode.FRAME) return;
        
        this._startPoint = {
            x: e.scenePoint.x,
            y: e.scenePoint.y,
        }
        
        this._render._FC.add(this._rect);
        this._rect.set({
            left: this._startPoint.x,
            top: this._startPoint.y,
            width: 0,
            height: 0
        });
    }

    /**
     * 处理鼠标移动事件
     * @param e - 鼠标事件信息
     * @private
     */
    private _mouseMove = (e: TPointerEventInfo<TPointerEvent>) => {
        if (this._Mode !== CoreMouseMode.FRAME) return;

        const width = e.scenePoint.x - this._startPoint.x;
        const height = e.scenePoint.y - this._startPoint.y;
        
        this._rect.set({
            width: Math.abs(width),
            height: Math.abs(height),
            left: width > 0 ? this._startPoint.x : e.scenePoint.x,
            top: height > 0 ? this._startPoint.y : e.scenePoint.y
        });
        
        this._render._FC.requestRenderAll();
    }

    /**
     * 处理框架创建时的鼠标抬起事件
     * @param e - 鼠标事件信息
     * @private
     */
    private _frameMouseUp = (e: TPointerEventInfo<TPointerEvent>) => {
        if (this._Mode !== CoreMouseMode.FRAME) return;

        const width = e.scenePoint.x - this._startPoint.x;
        const height = e.scenePoint.y - this._startPoint.y;

        this._render._FC.remove(this._rect);
        const frame = new Group([], {
            subTargetCheck: true,
            interactive: true,
            backgroundColor: 'rgba(153, 211, 255, 0.5)',
            width: Math.abs(width),
            height: Math.abs(height),
            left: width > 0 ? this._startPoint.x : e.scenePoint.x,
            top: height > 0 ? this._startPoint.y : e.scenePoint.y,
        })
        this._render._FC.add(frame);
        frame.set({
            layoutManager: new FrameLayout(),
            name: 'frame',
        })
        frame.triggerLayout();
        this._render._FC.setActiveObject(frame);
        this._render._FC.requestRenderAll();
        this.setMode(CoreMouseMode.SELECTION);
        this._render.emit('frame:create', frame);
    }

    /**
     * 处理文本创建时的鼠标抬起事件
     * @param e - 鼠标事件信息
     * @private
     */
    private _textMouseUp = (e: TPointerEventInfo<TPointerEvent>) => {
        if (this._Mode !== CoreMouseMode.TEXT) return;
        const text = new IText('Hello, Infinite Canvas', {
            editable: true,
            fontSize: 20,
            fill: '#000000'
        });
        text.set({
            left: e.scenePoint.x,
            top: e.scenePoint.y
        });
        this._render._FC.add(text);
        this._render._FC.setActiveObject(text);
        // 立即进入编辑模式
        text.enterEditing();
        text.hiddenTextarea?.focus();
        this._render._FC.requestRenderAll();

        this.setMode(CoreMouseMode.SELECTION);
        this._render.emit('text:create', text);
    }
}
