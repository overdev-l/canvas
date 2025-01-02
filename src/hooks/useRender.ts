import { Render, HotKey, MouseAction, Selection } from "@/render";
import { useUiStateStore, useRenderStore } from "@/store";
import { useCallback, useEffect, useState } from "react";

export const useRender = (container: string) => {
  const [ renderHotKey, setRenderHotKey ] = useState<HotKey | null>(null);
  const [ renderMouseAction, setRenderMouseAction ] = useState<MouseAction | null>(null);
  const { setIsCreateFrame, setIsCreateText } = useUiStateStore();
  const { setRender, render, setRenderSelection, renderSelection } = useRenderStore();


  const addFrame = useCallback(() => {
    setIsCreateFrame(false);
  }, [setIsCreateFrame])

  const addText = useCallback(() => {
    setIsCreateText(false);
  }, [setIsCreateText])
  useEffect(() => {
    const render = new Render({
      container: container,
    })
    setRender(render);
    const hotKey = new HotKey(render);
    const mouseAction = new MouseAction(render);
    const selection = new Selection(render);
    setRenderHotKey(hotKey);
    setRenderMouseAction(mouseAction);
    setRenderSelection(selection);
    render.use(hotKey)
          .use(mouseAction)
          .use(selection);
    render.on('frame:create', addFrame);
    render.on('text:create', addText);
    return () => {
      render.unmount()
    }
  }, [container, addFrame, addText, setRender, setRenderSelection])

  return {
    render,
    renderHotKey,
    renderMouseAction,
    renderSelection,
  };
}
