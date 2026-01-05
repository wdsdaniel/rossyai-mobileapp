import React, { useState, useEffect } from "react";
import { View, Image, Alert } from "react-native";
import AppText from "../../components/ui/AppText";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import { useTheme } from "../../hooks/ThemeContext";
import { TEXTS } from "@/constants/texts";
import { getOTP, verifyOTP } from "../../api/verification/verification.api";
import { getLoginResponse, getToken, saveLoginResponse } from "@/api/storage";
import { router } from "expo-router";

export default function VerificationScreen() {
  const { theme } = useTheme();

  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(5 * 60);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const fetchOtp = async () => {
      try {
        const loginResponse = await getLoginResponse();
        const email = loginResponse?.userData.email;

        if (!email) {
          Alert.alert(
            TEXTS.Verification.verification,
            TEXTS.Verification.emailBlank
          );
          return;
        }

        await getOTP({
          email,
          purpose: "signup",
        });
      } catch (e) {
        console.log("Failed to get otp:", e);
      }
    };

    fetchOtp();
  }, []);

  const formatTime = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleVerify = async () => {
    setError("");

    // 1️⃣ Local validations
    if (!code.trim()) {
      setError(TEXTS.Verification.pleaseEnterOTP);
      return;
    }

    if (code.trim().length !== 6) {
      setError(TEXTS.Verification.mustBeSixDigit);
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        Alert.alert(
          TEXTS.Verification.verification,
          TEXTS.Auth.somethingWentWrong
        );
        return;
      }

      const otp = String(code);

      const res = await verifyOTP({
        token,
        otp,
        purpose: "signup",
      });

      // Adjust condition based on your API response
      if (res?.error) {
        setError(res.message);
        Alert.alert(TEXTS.Verification.verification, res.message);
        return;
      }

      const loginResponse = await getLoginResponse();

      if (loginResponse && loginResponse.userData) {
        loginResponse.userData.email_verified = true;
        await saveLoginResponse(loginResponse);
      }

      router.replace("/main/dashboard");
      // navigate to next screen if needed
    } catch (e) {
      console.log("Verification Error => ", e);
      setError(TEXTS.Auth.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 70,
        backgroundColor: theme.colors.background,
      }}
    >
      <Image
        source={require("../../assets/images/AppIcon.png")}
        style={{ width: 90, height: 90, marginBottom: 10 }}
        resizeMode="contain"
      />

      <AppText size={20} weight="700" style={{ marginBottom: 40 }}>
        {TEXTS.App.rossyAI}
      </AppText>

      <AppText size={20} weight="700" color={theme.colors.primary}>
        {TEXTS.Verification.verificationCode}
      </AppText>

      <AppText
        size={14}
        color={theme.colors.textMuted}
        style={{ textAlign: "center", marginTop: 8, marginBottom: 20 }}
      >
        {TEXTS.Verification.verificationInstruction}
      </AppText>

      {/* OTP INPUT */}
      <AppInput
        placeholder={TEXTS.Verification.sixDigitCode}
        value={code}
        onChangeText={setCode}
        numericOnly={true}
        maxLength={6}
        keyboardType="number-pad"
        returnKeyType="done"
      />

      {/* ERROR MESSAGE */}
      {error ? (
        <AppText color="red" size={12} style={{ marginTop: 6 }}>
          {error}
        </AppText>
      ) : null}

      {/* TIMER */}
      <AppText
        size={12}
        color={theme.colors.textMuted}
        style={{ width: "100%", textAlign: "right", marginTop: 4 }}
      >
        {TEXTS.Verification.timeRemaining}: {formatTime()}
      </AppText>

      {/* VERIFY BUTTON */}
      <View style={{ width: "100%", marginTop: 25 }}>
        <AppButton
          title={TEXTS.Verification.verify}
          onPress={handleVerify}
          loading={loading}
          variant="primary"
        />
      </View>
    </View>
  );
}
