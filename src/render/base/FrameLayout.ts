import { FixedLayout, LayoutContext, LayoutManager } from "fabric";

export class FrameLayout extends LayoutManager {
    constructor() {
        super(new FixedLayout())
    }
    performLayout(context: LayoutContext): void {
        super.performLayout(context)
    }
}