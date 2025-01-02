import { Render, Selection } from "@/render";
import { create } from "zustand";

export const useRenderStore = create<{
    render: Render | null;
    setRender: (render: Render) => void;
    renderSelection: Selection | null;
    setRenderSelection: (renderSelection: Selection) => void;
}>((set) => ({
    render: null,
    setRender: (render: Render) => set({ render: render }),
    renderSelection: null,
    setRenderSelection: (renderSelection: Selection) => set({ renderSelection: renderSelection }),
}))