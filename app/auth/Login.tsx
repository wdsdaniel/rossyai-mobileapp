import { Modal, View, TouchableOpacity, TextInput } from "react-native";
import AuthLayout from "@/components/ui/AuthLayout";
import AppText from "@/components/ui/AppText";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import Divider from "@/components/ui/Divider";
import { useState, useRef } from "react";
import { useTheme } from "../../hooks/ThemeContext";
import { router } from "expo-router";
import { isEmail, validatePassword } from "@/utils/validation";
import { loginApi } from "../../api/auth/auth.api";
import { checkConnection } from "@/utils/network";
import { TEXTS } from "@/constants/texts";
import  CustomDialog from "../../components/modal/CustomDialog"
import * as Linking from "expo-linking";

export default function Login() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const passwordRef = useRef<TextInput>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // dialog state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  // const [serverError, setServerError] = useState("");

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const handleLogin = async () => {
    const net = await checkConnection();

    if (!net.isConnected) {
      showDialog(
        TEXTS.Network.noInternetTitle,
        TEXTS.Network.noInternetMessage
      );
      return;
    }

    if (!net.isInternetReachable) {
      showDialog(
        TEXTS.Network.noInternetTitle,
        TEXTS.Network.noInternetMessage
      );
      return;
    }

    let valid = true;
    if (!email.trim()) {
      setEmailError(TEXTS.Auth.emailRequiredPlaceHolder);
      valid = false;
    } else if (!isEmail(email)) {
      setEmailError(TEXTS.Auth.emailNotValidPlaceHolder);
      valid = false;
    }

    const passwordMsg = validatePassword(password);
    if (passwordMsg) {
      setPasswordError(passwordMsg);
      valid = false;
    }
    if (!valid) return;

    await doLogin();
  };

  async function doLogin() {
    try {
      setLoading(true);

      const loginResponse = await loginApi({
        email,
        password,
        portal: "ADMIN",
        rememberMe: true,
      });

      if (loginResponse != null) {
        if (loginResponse.userData.email_verified) {
          router.replace("/main/dashboard");
        } else {
          
          router.replace("/auth/verification");
        }
      }
    } catch (e: any) {
      console.log("LOGIN ERROR:", e);

      showDialog(
        TEXTS.Auth.loginFailedTitle,
        e?.message || TEXTS.Auth.somethingWentWrong
      );
    } finally {
      setLoading(false);
    }
  }

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
      <AppText size={16} weight="600" style={{ textAlign: "center" }}>
        Please Sign In to your account
      </AppText>

      <View style={{ marginTop: 20 }}>
        <AppInput
          placeholder={TEXTS.Auth.email}
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            setEmailError("");
          }}
          secureTextEntry={false}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        {emailError ? (
          <AppText size={11} color="red" style={{ marginTop: 4 }}>
            {emailError}
          </AppText>
        ) : null}

        <AppInput
          ref={passwordRef}
          placeholder={TEXTS.Auth.password}
          secureTextEntry
          value={password}
          returnKeyType="done"
          onChangeText={(password) => {
            setPassword(password);
            setPasswordError("");
          }}
          onSubmitEditing={handleLogin}
        />

        {passwordError ? (
          <AppText size={11} color="red" style={{ marginTop: 4 }}>
            {passwordError}
          </AppText>
        ) : null}

        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginTop: 6 }}
          onPress={() => router.push("/auth/forgot-password")}
        >
          <AppText size={12} weight="600" color={theme.colors.textPrimary}>
            Forgot Password?
          </AppText>
        </TouchableOpacity>

        <View style={{ marginTop: 16 }}>
          <AppButton
            title={TEXTS.Auth.signIn}
            onPress={() => {
              handleLogin();
            }}
            loading={loading}
          />
        </View>
        <Divider />

        <AppButton
          title={TEXTS.Auth.signInWithGoogle}
          onPress={() => {}}
          variant="outline"
        />

        <View style={{ alignItems: "center", marginTop: 24 }}>
          <AppText size={12} color={theme.colors.textMuted}>
            New to the platform?
          </AppText>

          <TouchableOpacity onPress={() => setShowCreateModal(true)}>
            <AppText size={13} weight="600" color={theme.colors.primary}>
              Create an account
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              borderRadius: 18,
              backgroundColor: "#fff",
              padding: 20,
            }}
          >
            <AppText
              size={24}
              weight="700"
              style={{ textAlign: "center", marginBottom: 10 }}
              color={theme.colors.primary}
            >
              Create Account
            </AppText>

            <AppText
              size={18}
              style={{ textAlign: "center", marginBottom: 32 }}
              color={theme.colors.textPrimary}
            >
              {TEXTS.Auth.createAccountInstruction}
            </AppText>

            {/* CREATE ACCOUNT ONLINE */}
            <AppButton
              title={TEXTS.Auth.creatAccountOnline}
              onPress={() => {
                Linking.openURL("https://www.google.com/");
                setShowCreateModal(false);
              }}
            />

            <View style={{ height: 12 }} />

            {/* BACK */}
            <AppButton
              title={TEXTS.Auth.back}
              variant="outline"
              onPress={() => setShowCreateModal(false)}
            />
          </View>
        </View>
      </Modal>
    </AuthLayout>
  );
}
