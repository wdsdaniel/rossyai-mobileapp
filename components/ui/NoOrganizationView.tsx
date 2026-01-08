import React from "react";
import { View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/hooks/ThemeContext";

type Props = {
  title?: string;
  description?: string;
  onCreatePress?: () => void;
};

export default function NoOrganizationView({
  title = "No organizations found",
  description = "Create an organization to continue",
  onCreatePress,
}: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
      }}
    >
      <Ionicons
        name="business-outline"
        size={52}
        color="#B0B0B0"
        style={{ marginBottom: 14 }}
      />

      <AppText size={16} weight="700" style={{ marginBottom: 6 }}>
        {title}
      </AppText>

      <AppText
        size={13}
        color="#777"
        style={{ textAlign: "center", marginBottom: 22 }}
      >
        {description}
      </AppText>

      <TouchableOpacity
        onPress={onCreatePress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: theme.colors.primary,
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderRadius: 10,
        }}
      >
        <Ionicons
          name="add-circle-outline"
          size={18}
          color={theme.colors.primary}
        />
        <AppText
          size={14}
          weight="600"
          color={theme.colors.primary}
          style={{ marginLeft: 8 }}
        >
          Create Organization
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
