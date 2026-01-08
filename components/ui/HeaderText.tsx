import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";

type Props = {
  children: React.ReactNode;
  size?: number;
  weight?: "400" | "500" | "600" | "700";
  color?: string;
  style?: any;
  align?: "left" | "center" | "right";
  height?: number;
  lineHeight?: number;   // only applied when provided
};

export default function HeaderText({
  children,
  size = 24,
  weight = "700",
  color,
  style,
  align = "center",
  height = 40,            // default height (change if needed)
  lineHeight,
}: Props) {
  const { theme } = useTheme();

  const fontMap: Record<string, string> = {
    "400": "PublicSans_400Regular",
    "500": "PublicSans_500Medium",
    "600": "PublicSans_600SemiBold",
    "700": "PublicSans_700Bold",
  };

  return (
    <Text
      style={[
        {
          fontSize: size,
          fontFamily: fontMap[weight],
          color: color ?? theme.colors.textPrimary,
          textAlign: align,
          height,
          ...(lineHeight && { lineHeight }),   // 👈 only when passed
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
