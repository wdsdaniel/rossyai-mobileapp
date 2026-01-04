import { TouchableOpacity, ActivityIndicator } from "react-native";
import AppText from "./AppText";
import { useTheme } from "../../hooks/ThemeContext";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "outline";
};

export default function AppButton({
  title,
  onPress,
  loading,
  variant = "primary",
}: Props) {
  const { theme } = useTheme();

  const bg = variant === "primary" ? theme.colors.primary : "transparent";
  const border = variant === "outline" ? theme.colors.border : "transparent";
  const textColor = variant === "primary" ? "#fff" : theme.colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText weight="600" color={textColor}>
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
}
