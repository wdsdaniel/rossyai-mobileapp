import { Text } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import React from "react";

type Props = {
  children: React.ReactNode;
  size?: number;
  weight?: "normal" | "bold" | "600" | "700";
  color?: string;
  style?: any;
};

export default function AppText({
  children,
  size = 14,
  weight = "normal",
  color,
  style,
}: Props) {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        {
          fontSize: size,
          fontWeight: weight,
          color: color ?? theme.colors.textPrimary,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
