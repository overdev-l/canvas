import { FabricObject, Group, TPointerEvent, TPointerEventInfo, Rect, CanvasEvents } from "fabric";
import { Plugin } from "../base/types";
import { Render } from "../render";
import { TEventCallback } from "node_modules/fabric/dist/src/Observable";
import Layout from "@/components/layout";
import { FrameLayout } from "../base/FrameLayout";
type SelectionEvent = { selected: Array<{ get: (key: string) => string }> };

export class MouseAction extends Plugin {
  public __name__ = 'MouseAction';
  private state = {
    isMouseDown: false,
    isSelection: false,
    selected: [] as FabricObject[],
    targetGroup: null as Group | null
  };

  constructor(render: Render) {
    super(render);
    this.bindEvents();
  }

  public __destroy__ = () => {
    const events = {
      'mouse:down': [this.handleMouseDown],
      'mouse:move': [this.handleMouseMove], 
      'mouse:up': [this.handleMouseUp],
      'selection:created': [this.handleSelection],
      'selection:updated': [this.handleSelection],
      'selection:cleared': [this.handleSelectionCleared]
    };

    Object.entries(events).forEach(([event, handlers]) => 
      handlers.forEach(handler => this._render._FC.off(event as keyof CanvasEvents, handler))
    );
  }

  private bindEvents(): void {
    const events = {
      'mouse:down': [this.handleMouseDown],
      'mouse:move': [this.handleMouseMove],
      'mouse:up': [this.handleMouseUp],
      'selection:created': [this.handleSelection],
      'selection:updated': [this.handleSelection],
      'selection:cleared': [this.handleSelectionCleared]
    };

    Object.entries(events).forEach(([event, handlers]) => 
      handlers.forEach(handler => this._render._FC.on(event as keyof CanvasEvents, handler as TEventCallback<TPointerEventInfo<TPointerEvent>>))
    );
  }

  public handleMouseDown = (e: TPointerEventInfo<TPointerEvent>): void => {
    this.state.isMouseDown = true;
    
    const target = e.target;
    if (target && target.group) {
        this.state.targetGroup = target.group;
    }
    
    this.state.selected
        .filter(obj => obj.type !== 'group')
        .forEach(obj => obj.set({ opacity: 0.5 }));
  };

  public handleMouseMove = (e: TPointerEventInfo<TPointerEvent>): void => {
    if (!this.state.selected.length) return;
    
    const pointer = this._render._FC.getScenePoint(e.e);
    
    if (this.state.targetGroup) {
        const isInsideGroup = this.state.targetGroup.containsPoint(pointer);
        if (!isInsideGroup) {
            const newTargetGroup = this._render._FC.getObjects()
                .filter(obj => 
                    obj.type === 'group' && 
                    obj !== this.state.targetGroup && 
                    obj.containsPoint(pointer)
                )
                .pop() as Group | null;

            if (newTargetGroup) {
                this.moveObjectsBetweenGroups(this.state.targetGroup, newTargetGroup);
                this.state.targetGroup = newTargetGroup;
            } else {
                const objectsToRemove = this.state.selected.filter(obj => 
                    obj.group === this.state.targetGroup
                );
                
                if (objectsToRemove.length) {
                    objectsToRemove.forEach(obj => {
                        this.state.targetGroup?.remove(obj);
                        this._render._FC.add(obj);
                    });
                    this._render._FC.requestRenderAll();
                }
                this.state.targetGroup = null;
            }
        }
    } else if (this.state.isSelection && this.state.isMouseDown) {
        const potentialGroup = this._render._FC.getObjects()
            .filter(obj => obj.type === 'group' && obj.containsPoint(pointer))
            .pop() as Group | null;
            
        if (potentialGroup) {
            this.state.targetGroup = potentialGroup;
        }
    }
  };

  private moveObjectsBetweenGroups(fromGroup: Group, toGroup: Group): void {
    const objectsToMove = this.state.selected.filter(obj => 
        obj.group === fromGroup
    );
    
    if (!objectsToMove.length) return;
    
    objectsToMove.forEach(obj => {
        fromGroup.remove(obj);
        toGroup.add(obj);
    });
    
    fromGroup.setCoords();
    toGroup.setCoords();
    this._render._FC.requestRenderAll();
  }

  public handleMouseUp = (): void => {
    this.state.selected
        .filter(obj => obj.type !== 'group')
        .forEach(obj => obj.set({ opacity: 1 }));

    if (!this.canProcessMouseUp()) {
        this.resetState();
        return;
    }
    
    if (this.state.isMouseDown && this.state.selected.length && this.state.targetGroup) {
        this.addToFrame();
    }
    
    this.resetState();
  };

  private resetState(): void {
    this.state.isMouseDown = false;
    this.state.targetGroup = null;
  }

  private canProcessMouseUp(): boolean {
    const hasFrame = this.state.selected.some(obj => obj.type === 'group');
    return !hasFrame && 
      !(this.state.selected.length === 1 && this.state.selected[0].type === 'group');
  }

  private handleSelection = (e: SelectionEvent): void => {
    this.state.isSelection = true;
    this.state.selected = e.selected.filter(obj => obj.get('name') !== 'frame') as FabricObject[];
  };

  private handleSelectionCleared = (): void => {
    this.state.isSelection = false;
    this.state.selected = [];
  };

  private addToFrame(): void {
    const group = this.state.targetGroup;
    if (!group) return;
    group.add(...this.state.selected.filter(obj => !group.contains(obj)));
    this._render._FC.remove(...this.state.selected);
    group.setCoords();
    this._render._FC.renderAll()
  }

  private handleGroupSelection = (e: TPointerEventInfo<TPointerEvent>): void => {
    const activeObject = this._render._FC.getActiveObject();
    if (activeObject?.type !== 'group') return;

    const target = e.subTargets?.filter(obj => obj.type !== 'group').pop();
    if (target) {
      (activeObject as Group).set({ interactive: true });
    }
  };
  
}