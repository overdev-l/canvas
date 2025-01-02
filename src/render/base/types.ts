import { Render } from "../render";

export abstract class Plugin {
    public _render: Render;
    public _options?: Record<string, any>;
    constructor(_render: Render, _options?: Record<string, any>) {
        this._render = _render;
        this._options = _options;
    }
    public abstract __name__: string;
    public abstract __destroy__: () => void;
}