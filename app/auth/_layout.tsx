import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../hooks/ThemeContext";
import { getToken, getLoginResponse } from "@/api/storage";
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
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [emailVerify, setEmailVerify] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      const e = await getLoginResponse();

      if (e) {
        setEmailVerify(e.userData.email_verified);
      }

      setToken(t);
      setChecking(false);
    })();
  }, []);

  // 👉 handle redirects AFTER data is loaded
  useEffect(() => {
    if (checking) return;

    if (token) {
      console.log(
        "token available and email is verified? => ",
        emailVerify
      );

      if (!emailVerify) {
        router.replace("/auth/verification");
      } else {
        router.replace("/main/dashboard");
      }
    }
  }, [checking, token, emailVerify, router]);

  // ⏳ loading state
  if (checking) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 🚪 no token → show auth stack
  return <LayoutContent />;
}
