import { useTheme } from "next-themes";
import { THEMES } from "../constants";

type UseThemeReturn = ReturnType<typeof useTheme>;

type UseCustomThemeReturn = UseThemeReturn & {
  theme: THEMES;
  isDarkMode: boolean;
};

export const useCustomTheme = (): UseCustomThemeReturn => {
  const useThemeReturn = useTheme();

  const isDarkMode = useThemeReturn.theme === THEMES.DARK;

  return {
    ...useThemeReturn,
    theme: isDarkMode ? THEMES.DARK : THEMES.LIGHT,
    isDarkMode,
  };
};
