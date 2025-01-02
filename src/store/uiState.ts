import { create } from "zustand";

export const useUiStateStore = create<{
    isCreateFrame: boolean;
    isCreateText: boolean;
    setIsCreateFrame: (isCreateFrame: boolean) => void;
    setIsCreateText: (isCreateText: boolean) => void;
}>((set) => ({
    isCreateFrame: false,
    isCreateText: false,
    setIsCreateFrame: (isCreateFrame: boolean) => set({ isCreateFrame }),
    setIsCreateText: (isCreateText: boolean) => set({ isCreateText }),
}))