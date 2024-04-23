import sharedConfig from "@jsonlens/tailwind-config/tailwind.config";

const config = {
  ...sharedConfig,
  content: [
    ...sharedConfig.content,
    "../../packages/json-parts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
