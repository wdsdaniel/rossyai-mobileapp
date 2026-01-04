import { View, Image, ScrollView } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import AppText from "./AppText";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      keyboardShouldPersistTaps="handled"
      style={{
        backgroundColor: theme.colors.surface,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 22,

          // 👇 center vertically
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* LOGO + TITLE */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Image
            source={require("../../assets/images/AppIcon.png")}
            style={{ width: 90, height: 90 }}
          />

          <AppText size={22} weight="700" style={{ marginTop: 10 }}>
            ROSSY AI
          </AppText>
        </View>

        {/* SCREEN CONTENT */}
        <View style={{ width: "100%" }}>{children}</View>
      </View>
    </ScrollView>
  );
}
