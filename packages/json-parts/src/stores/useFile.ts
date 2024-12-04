import { create } from "zustand";
import { convertJsonTree } from "../helpers/json.helper";
import { JsonTree } from "../types";
import { FileFormat } from "../constants/json.constants";
import { contentToJson } from "../utils/json.utils";

type State = {
  contents: string;
  json: object;
  isValidJson: boolean;
  jsonTree: JsonTree;
  format: FileFormat;
};

type Actions = {
  setContents: (contents: string) => void;
  setJsonTree: (jsonTree: JsonTree) => void;
  setIsValidJson: (value: boolean) => void;
};

const initialState: State = {
  format: FileFormat.JSON,
  contents: "",
  json: {},
  isValidJson: false,
  jsonTree: {
    nodes: [],
    edges: [],
  },
};

export const useFile = create<State & Actions>((set, get) => ({
  ...initialState,
  setContents: async (contents: string) => {
    try {
      set({ contents });
      const json = await contentToJson(contents, get().format);
      set({ jsonTree: convertJsonTree(json), isValidJson: true, json });
    } catch (error) {
      set({ isValidJson: false });
    }
  },
  setJsonTree: (jsonTree: JsonTree) => set({ jsonTree }),
  setIsValidJson: (isValidJson: boolean) => set({ isValidJson }),
}));
