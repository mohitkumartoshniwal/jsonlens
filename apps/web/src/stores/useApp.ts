import { create } from "zustand";
import { VIEW_TYPES } from "../types";

const initialState = {
  isLoading: false,
  isEditorVisible: true,
  viewType: VIEW_TYPES.GRAPH,
};

type Actions = {
  toggleEditorVisibilty: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setViewType: (viewType: VIEW_TYPES) => void;
};

export const useApp = create<typeof initialState & Actions>((set, get) => ({
  ...initialState,
  toggleEditorVisibilty: () => {
    const isEditorVisible = get().isEditorVisible;
    set({ isEditorVisible: !isEditorVisible });
  },
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
  setViewType: (viewType: VIEW_TYPES) => {
    set({ viewType });
  },
}));
