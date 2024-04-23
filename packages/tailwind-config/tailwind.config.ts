const SIZES = {
  nodeMaxWidth: 440,
  valueMaxWidth: 200,
  arrayNodeSize: 64,
  nodeGap: 100, //5,
  nodeContentHeight: 40,
  nodePadding: 12,
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        darkBackground: "rgb(38, 38, 38)",
        containerBackground: "rgb(185, 187, 190)",

        lightBackground: "rgb(236, 236, 236)",
      },
      textColor: {
        darkText: "rgb(185, 187, 190)",
        lightText: "rgb(79, 86, 96)",
      },
      colors: {
        dark_shade_1: "#242424",
        node: "#2b2c3e",
      },
      padding: {
        nodePadding: SIZES.nodePadding,
      },
      height: {
        nodeContentHeight: SIZES.nodeContentHeight,
      },
      minWidth: {
        arrayNodeSize: SIZES.arrayNodeSize,
      },
      maxWidth: {
        arrayNodeSize: SIZES.arrayNodeSize,
        nodeMaxWidth: SIZES.nodeMaxWidth,
        valueMaxWidth: SIZES.valueMaxWidth,
      },
      minHeight: {
        arrayNodeSize: SIZES.arrayNodeSize,
      },
      maxHeight: {
        arrayNodeSize: SIZES.arrayNodeSize,
      },
    },
  },
  plugins: [],
};
