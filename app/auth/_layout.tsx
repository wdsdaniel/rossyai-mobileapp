import { Stack, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../hooks/ThemeContext";
import { getToken } from "@/api/storage";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

function LayoutContent() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        style={theme.mode === "light" ? "dark" : "light"}
        backgroundColor={theme.colors.background}
        translucent={false}
      />

      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  const [checking, setChecking] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
      setChecking(false);
    })();
  }, []);

  // ⏳ still loading → show loader
  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 🔐 token exists → go to dashboard
  if (token) {
    console.log("token available");
    return <Redirect href="/main/dashboard" />;
  } else {
    console.log("token not available");
  }

  // 🚪 no token → show login stack
  return <LayoutContent />;
}
