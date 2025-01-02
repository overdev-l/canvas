import * as fabric from "fabric";
import './base/ownDefaults'
import { getContainer } from "./utils/dom";
import { Wheel } from "./base/wheel";
import { MouseStyle } from "./base/mouseStyle";
import { Event } from "./base/event";
import { getImageInfo } from "./utils/mediaInfo";
import { Plugin } from "./base/types";
type CoreOptions = {
    container: string;
}

export class Render extends Event {
    private _canvas!: HTMLCanvasElement;
    private _container!: {
        element: HTMLElement;
        width: number;
        height: number;
    };
    private _plugins: Map<string, Plugin> = new Map();
    public _FC!: fabric.Canvas;
    private _ResizeObserver!: ResizeObserver;
    private _Wheel!: Wheel;
    private _MouseStyle!: MouseStyle;
    constructor(private options: CoreOptions) {
        super();
        this.init();
    }
    private init = () => {
        this._canvas = document.createElement('canvas');
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = '0';
        this._canvas.style.left = '0';
        this._container = getContainer(this.options.container);
        this._container.element.style.position = 'relative';
        this._container.element.appendChild(this._canvas);
        this._FC = new fabric.Canvas(this._canvas, {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            interactive: true,
            selection: true,
            isDrawingMode: false,
            preserveObjectStacking: true,
        });
        this.setCanvasSize();
        this.initResizeObserver();
        this._Wheel = new Wheel(this._FC);
        this._MouseStyle = new MouseStyle(this._FC);
    }

    private setCanvasSize = () => {
        this._container = getContainer(this.options.container);
        this._FC.setDimensions({
            width: this._container.width,
            height: this._container.height
        });
    }

    private initResizeObserver = () => {
        this._ResizeObserver = new ResizeObserver(() => {
            this.setCanvasSize();
        });
        this._ResizeObserver.observe(this._container.element);
    }

    public unmount = () => {
        this._plugins.forEach(plugin => {
            plugin.__destroy__();
        });
        this._plugins.clear();
        this._ResizeObserver.disconnect();
        this._FC.dispose();
    }
    
    /**
     * 添加图片
     * @param original 图片的原始数据(url或base64)
     */
    public addImage = async (original: string) => {
        const { width, height, image } = await getImageInfo(original);
        this._FC.add(image);
        image.set({
            width: width,
            height: height,
        });
        this._FC.setActiveObject(image);
        this._FC.centerObject(image);
        this._FC.requestRenderAll();
    }
    /**
     * 使用插件
     * @param plugin 插件
     */
    public use = (plugin: Plugin) => {
        const name = plugin.__name__;
        if (this._plugins.has(name)) {
            this._plugins.get(name)?.__destroy__();
        }
        this._plugins.set(name, plugin);
        return this;
    }
    /**
     * 卸载插件
     * @param name 插件名称
     */
    public unuse = (name: string) => {
        this._plugins.get(name)?.__destroy__();
        this._plugins.delete(name);
    }
}