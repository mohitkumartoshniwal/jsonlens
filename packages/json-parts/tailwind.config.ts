import sharedConfig from "@jsonlens/tailwind-config/tailwind.config";

const config = {
  ...sharedConfig,
  content: [...sharedConfig.content],
};

export default config;
