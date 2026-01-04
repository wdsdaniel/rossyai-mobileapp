import { View } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";

export default function Divider() {
  const { theme } = useTheme();

  return (
    <View
      style={{
        width: "100%",
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 18,
      }}
    />
  );
}
