import { useState } from "react";
import { View } from "react-native";
import AuthLayout from "@/components/ui/AuthLayout";
import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import AppButton from "@/components/ui/AppButton";
import { router } from "expo-router";
import { useTheme } from "../../hooks/ThemeContext";
import { forgotPassword } from "@/api/auth/auth.api";
import { TEXTS } from "@/constants/texts";
import { isEmail } from "@/utils/validation";
import CustomDialog from "@/components/modal/CustomDialog";

export default function ForgotPassword() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };
  const handleReset = async () => {
    setLoading(true)
    if (!email.trim()) {
      showDialog(TEXTS.App.rossyAI, TEXTS.Auth.emailRequiredPlaceHolder);
      setLoading(false);
      return;
    }

    if (!isEmail(email)) {
      showDialog(TEXTS.App.rossyAI, TEXTS.Auth.emailNotValidPlaceHolder);
      setLoading(false);
      return;
    }

    const res = await forgotPassword(email);

    if (res) {
      showDialog(TEXTS.App.rossyAI, res.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <CustomDialog
        visible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        showCancel={false}
        showConfirm={true}
        confirmText={TEXTS.Dialog.okay}
        onConfirm={() => setDialogVisible(false)}
      />
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
        <AppButton title="SEND RESET LINK" onPress={handleReset} loading = {loading} />
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
