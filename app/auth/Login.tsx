import { Modal, View, TouchableOpacity, TextInput, Alert } from "react-native";
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
  const [serverError, setServerError] = useState("");

  const handleLogin = async () => {
    const net = await checkConnection();

    if (!net.isConnected) {
      Alert.alert("No connection", "Please connect to Wi-Fi or mobile data.");
      return;
    }

    if (!net.isInternetReachable) {
      Alert.alert("No internet", "Please check your network connection.");
      return;
    }

    let valid = true;
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!isEmail(email)) {
      setEmailError("Enter a valid email");
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

      const res = await loginApi({
        email,
        password,
        portal: "ADMIN",
        rememberMe: true,
      });

      router.replace("/main/dashboard");
    } catch (e: any) {
      console.log("LOGIN ERROR:", e);

      Alert.alert(
        "Login Failed",
        e?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <AppText size={16} weight="600" style={{ textAlign: "center" }}>
        Please Sign In to your account
      </AppText>

      <View style={{ marginTop: 20 }}>
        <AppInput
          placeholder="Email"
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
          placeholder="Password"
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
            title="SIGN IN"
            onPress={() => {
              handleLogin();
            }}
            loading={loading}
          />
        </View>
        <Divider />

        <AppButton
          title="SIGN IN WITH GOOGLE"
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
              You’ll be redirected to our website to complete your account
              setup.
            </AppText>

            {/* CREATE ACCOUNT ONLINE */}
            <AppButton
              title="CREATE ACCOUNT ONLINE"
              onPress={() => {
                Linking.openURL("https://www.google.com/");
                setShowCreateModal(false);
              }}
            />

            <View style={{ height: 12 }} />

            {/* BACK */}
            <AppButton
              title="BACK"
              variant="outline"
              onPress={() => setShowCreateModal(false)}
            />
          </View>
        </View>
      </Modal>
    </AuthLayout>
  );
}
