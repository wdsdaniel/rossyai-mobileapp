import { Text } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import React from "react";

type Props = {
  children: React.ReactNode;
  size?: number;
  weight?: "400" | "500" | "600" | "700";
  color?: string;
  style?: any;
};

export default function AppText({
  children,
  size = 14,
  weight = "400",     // 👈 default = 400
  color,
  style,
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
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
