import { create } from "zustand";

const initialState = {
  isLoading: false,
  isEditorVisible: true,
};

type Actions = {
  toggleEditorVisibilty: () => void;
  setIsLoading: (isLoading: boolean) => void;
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
}));
