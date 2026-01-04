import { useState } from "react";
import { View } from "react-native";
import AuthLayout from "@/components/ui/AuthLayout";
import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import AppButton from "@/components/ui/AppButton";
import { router } from "expo-router";
import { useTheme } from "../../hooks/ThemeContext";

export default function ForgotPassword() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    // later: call API
    alert("Reset link sent!");
  };

  return (
    <AuthLayout>
      <View style={{ alignItems: "center", marginBottom: 18 }}>
        <AppText
          size={18}
          weight="700"
          color={theme.colors.primary}
          style={{ textAlign: "center" }}
        >
          Forgot Password?
        </AppText>

        <AppText
          size={13}
          color={theme.colors.textMuted}
          style={{ textAlign: "center", marginTop: 8 }}
        >
          Enter your email, and we&apos;ll send you instructions to reset your
          password.
        </AppText>
      </View>

      <AppInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        returnKeyType="done"
      />

      <View style={{ marginTop: 16 }}>
        <AppButton title="SEND RESET LINK" onPress={handleReset} />
      </View>

      <View style={{ marginTop: 12 }}>
        <AppButton
          title="BACK"
          variant="outline"
          onPress={() => router.back()}
        />
      </View>
    </AuthLayout>
  );
}
