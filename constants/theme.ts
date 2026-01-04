/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
export const BaseColors = {
  primary: "#7367F0",
  primaryDark: "#5b52c4",

  background: "#FFFFFF",
  surface: "#F7F7FA",

  textPrimary: "#333333",
  textMuted: "#6E6E6E",

  border: "#E5E7EB",
  error: "#E53935",
};

export const LightTheme = {
  mode: "light",
  colors: {
    ...BaseColors,
    background: "#FFFFFF",
  },
};

export const DarkTheme = {
  mode: "dark",
  colors: {
    ...BaseColors,
    background: "#0F0F14",
    surface: "#1A1A24",
    textPrimary: "#F5F5F5",
  },
};


export const Fonts = {
  regular: "PublicSans_400Regular",
  medium: "PublicSans_500Medium",
  semibold: "PublicSans_600SemiBold",
  bold: "PublicSans_700Bold",
};
