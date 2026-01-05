import { View, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import { useState, forwardRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import type { KeyboardTypeOptions } from "react-native";

type Props = {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (t: string) => void;
  returnKeyType?: "next" | "done" | "go" | "send";
  onSubmitEditing?: () => void;

  maxLength?: number;
  numericOnly?: boolean;

  // user-controlled keyboard
  keyboardType?: KeyboardTypeOptions;
};

const AppInput = forwardRef<TextInput, Props>(
  (
    {
      placeholder,
      secureTextEntry,
      value,
      onChangeText,
      returnKeyType = "done",
      onSubmitEditing,
      maxLength,
      numericOnly = false,
      keyboardType,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [hidden, setHidden] = useState(secureTextEntry);

    const handleChange = (text: string) => {
      let out = text;

      if (numericOnly) {
        out = out.replace(/[^0-9]/g, "");
      }

      if (maxLength && out.length > maxLength) {
        out = out.slice(0, maxLength);
      }

      onChangeText(out);
    };

    // 👇 RULE:
    // If keyboardType is passed -> use it
    // Else -> show alphanumeric keyboard
    const resolvedKeyboard: KeyboardTypeOptions = keyboardType ?? "default";

    return (
      <View style={{ width: "100%", marginVertical: 8, position: "relative" }}>
        <TextInput
          ref={ref}
          placeholder={placeholder}
          value={value}
          secureTextEntry={hidden}
          onChangeText={handleChange}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          keyboardType={resolvedKeyboard}
          placeholderTextColor={theme.colors.textMuted}
          maxLength={maxLength}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.surface,
            paddingRight: secureTextEntry ? 44 : 14,
          }}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidden((p) => !p)}
            style={{ position: "absolute", right: 10, top: 12 }}
          >
            <Ionicons
              name={hidden ? "eye-off" : "eye"}
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

AppInput.displayName = "AppInput";

export default AppInput;
