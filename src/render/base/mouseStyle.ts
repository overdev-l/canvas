import { Canvas } from 'fabric';

export class MouseStyle {
    constructor(private __FC: Canvas) {
        this.init();
    }

    private init = () => {
        this.__FC.defaultCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 100 100'><path d='m2.85 10.61 29.03 82.81c1.94 5.55 9.85 5.36 11.54-.27l10.52-35.14a6.063 6.063 0 0 1 4.07-4.07L93.17 43.4c5.63-1.69 5.81-9.6.26-11.54L10.58 2.87c-4.8-1.67-9.41 2.94-7.73 7.74z' fill='black'/></svg>") 4 4, auto`;
        this.__FC.hoverCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 100 100'><path d='m2.85 10.61 29.03 82.81c1.94 5.55 9.85 5.36 11.54-.27l10.52-35.14a6.063 6.063 0 0 1 4.07-4.07L93.17 43.4c5.63-1.69 5.81-9.6.26-11.54L10.58 2.87c-4.8-1.67-9.41 2.94-7.73 7.74z' fill='black'/></svg>") 4 4, auto`;
        this.__FC.moveCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 100 100'><path d='m2.85 10.61 29.03 82.81c1.94 5.55 9.85 5.36 11.54-.27l10.52-35.14a6.063 6.063 0 0 1 4.07-4.07L93.17 43.4c5.63-1.69 5.81-9.6.26-11.54L10.58 2.87c-4.8-1.67-9.41 2.94-7.73 7.74z' fill='black'/></svg>") 4 4, auto`;
    }
}
