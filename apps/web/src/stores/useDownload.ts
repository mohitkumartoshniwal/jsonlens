import { create } from "zustand";
import { IMAGE_TYPES } from "../types";
import { Node, getNodesBounds, getViewportForBounds } from "reactflow";
import { toJpeg, toPng, toSvg } from "html-to-image";

export const downloadInitialState = {
  fileName: "jsonlens",
  fileType: IMAGE_TYPES.PNG,
  backgroundColor: "#FFFFFF",
  imageWidth: 1024,
  imageHeight: 768,
};

type Actions = {
  setFileName: (fileName: string) => void;
  setFileType: (fileType: IMAGE_TYPES) => void;
  setBackgroundColor: (backgroundColor: string) => void;
  setImageWidth: (imageWidth: number) => void;
  setImageHeight: (imageHeight: number) => void;
  triggerDownload: (nodes: Node[]) => void;
};

export const useDownload = create<typeof downloadInitialState & Actions>(
  (set, get) => ({
    ...downloadInitialState,
    setFileName: (fileName) => {
      set({ fileName });
    },
    setFileType: (fileType) => {
      set({ fileType });
    },
    setBackgroundColor: (backgroundColor) => {
      set({ backgroundColor });
    },
    setImageWidth: (imageWidth) => {
      set({ imageWidth });
    },
    setImageHeight: (imageHeight) => {
      set({ imageHeight });
    },
    triggerDownload: async (nodes: Node[]) => {
      /**
       * @see https://reactflow.dev/examples/misc/download-image
       */
      /**
       * @see [DEPRECATED] `getRectOfNodes` is deprecated. Instead use `getNodesBounds`
       * @see [DEPRECATED] `getTransformForBounds` is deprecated. Instead use `getViewportForBounds`. Beware that the return value is type Viewport (`{ x: number, y: number, zoom: number }`) instead of Transform (`[number, number, number]`)
       */

      const { fileName, fileType, backgroundColor, imageWidth, imageHeight } =
        get();

      const nodesBounds = getNodesBounds(nodes);
      const transform = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,
        2
      );

      const graphViewport = document.querySelector(
        ".react-flow__viewport"
      ) as HTMLElement;

      const options = {
        backgroundColor,
        width: imageWidth,
        height: imageHeight,
        cacheBust: true,
        style: {
          width: imageWidth.toString(),
          height: imageHeight.toString(),
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
        },
      };

      if (fileType === IMAGE_TYPES.SVG) {
        options.backgroundColor = "transparent";
      }

      let dataUrl = "";
      if (fileType === IMAGE_TYPES.PNG) {
        dataUrl = await toPng(graphViewport, options);
      } else if (fileType === IMAGE_TYPES.JPEG) {
        dataUrl = await toJpeg(graphViewport, options);
      } else if (fileType === IMAGE_TYPES.SVG) {
        dataUrl = await toSvg(graphViewport, options);
      }

      const a = document.createElement("a");

      a.setAttribute("download", `${fileName}.${fileType}`);
      a.setAttribute("href", dataUrl);
      a.click();

      set({ ...downloadInitialState });
    },
  })
);
